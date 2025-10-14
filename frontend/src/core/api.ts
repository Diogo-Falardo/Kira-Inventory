import axios from "axios";
import type { AxiosError, AxiosRequestConfig } from "axios";
import { env } from "./env";

// add "/" in the end of url
function withTrailingSlash(url: string) {
  return url.replace(/\/+$/, "") + "/";
}

function getToken() {
  return localStorage.getItem("token");
}

function getRefreshToken(): string | null {
  return localStorage.getItem("refresh_token");
}
function saveAccessToken(token: string): void {
  localStorage.setItem("token", token);
}

// function clearTokens(): void {
//   localStorage.removeItem("token");
//   localStorage.removeItem("refresh_token");
// }

type ApiErrorResponse = {
  detail?: string;
  message?: string;
  error?: string;
};

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return (
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      `Error! ${error}`
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "unknow error";
}

export const api = axios.create({
  baseURL: withTrailingSlash(env.API_URL),
  withCredentials: false,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- tiny helper so TS knows about our flag
type RetriableConfig = AxiosRequestConfig & { _retry?: boolean };

// automatic refresh when 401
let isRefreshing = false;
/** queue of waiters to replay requests once a fresh token is available */
let failedQueue: Array<(token: string | null) => void> = [];

/** notifies all queued requests with the new token (or null on failure) */
function processQueue(newToken: string | null) {
  failedQueue.forEach((cb) => cb(newToken));
  failedQueue = [];
}

// use a separate axios client for refresh so it doesn't hit the same interceptors
const refreshClient = axios.create({
  baseURL: withTrailingSlash(env.API_URL),
  headers: { "Content-Type": "application/json", Accept: "application/json" },
  // withCredentials: false // keep false for bearer; true only if using cookies
});

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = (error.config || {}) as RetriableConfig;

    // if we don't even have a request config or it's not a 401, just bubble up
    if (!original || status !== 401) {
      return Promise.reject(error);
    }

    // never try to refresh for the refresh endpoint itself (avoid infinite loop)
    if ((original.url || "").includes("/auth/refresh")) {
      return Promise.reject(error);
    }

    // prevent infinite retry loops
    if (original._retry) {
      return Promise.reject(error);
    }
    original._retry = true;

    // if a refresh is already happening, enqueue and wait
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push((token) => {
          if (!token) {
            reject(error);
            return;
          }
          // ensure headers object exists before assigning
          original.headers = original.headers ?? {};
          (original.headers as any).Authorization = `Bearer ${token}`;
          resolve(api(original));
        });
      });
    }

    // first request to trigger refresh
    isRefreshing = true;

    try {
      const rt = getRefreshToken();
      if (!rt) {
        // no refresh token to use -> clear and fail fast
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");
        processQueue(null);
        return Promise.reject(error);
      }

      // call refresh endpoint using the clean client
      const { data } = await refreshClient.post<{
        access_token: string;
        refresh_token?: string; // backend may or may not return a new one
        token_type: string;
      }>("auth/refresh", { refresh_token: rt });

      const newAccess = data.access_token;
      if (!newAccess) {
        // defensive: refresh did not return a token
        processQueue(null);
        return Promise.reject(error);
      }

      // persist tokens (keep your helpers if you prefer)
      saveAccessToken(newAccess);
      if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
      }

      // wake up all queued requests with the fresh token
      processQueue(newAccess);

      // retry the original request with the new Authorization header
      original.headers = original.headers ?? {};
      (original.headers as any).Authorization = `Bearer ${newAccess}`;
      return api(original);
    } catch (err) {
      // refresh failed -> clear session and fail all queued requests
      processQueue(null);
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);
