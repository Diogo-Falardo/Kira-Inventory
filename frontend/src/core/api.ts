/**
 * Axios client with JWT authentication and automatic refresh token handling.
 *
 * - Stores access and refresh tokens in localStorage
 * - Attaches the Bearer token automatically
 * - Refreshes expired tokens (401) transparently
 * - Retries failed requests after refresh
 */

import axios, { AxiosError } from "axios";
import type {
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

import { env } from "./env";

// ======= Token keys for localStorage =======
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// ======= Token types =======
type Tokens = { access_token: string; refresh_token: string };

// ------------------------------------------------------------
//  Token management helpers
// ------------------------------------------------------------

/**
 * Reads tokens from localStorage.
 */
export function getTokens(): Tokens | null {
  const a = localStorage.getItem(ACCESS_TOKEN_KEY);
  const r = localStorage.getItem(REFRESH_TOKEN_KEY);
  return a && r ? { access_token: a, refresh_token: r } : null;
}

/**
 * Saves tokens to localStorage.
 */
export function setTokens(t: Tokens) {
  localStorage.setItem(ACCESS_TOKEN_KEY, t.access_token);
  localStorage.setItem(REFRESH_TOKEN_KEY, t.refresh_token);
}

/**
 * Clears tokens from localStorage.
 */
export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

// ------------------------------------------------------------
//  Axios instance setup
// ------------------------------------------------------------

/**
 * Create the base Axios instance.
 * You can override the baseURL via your Vite env variable.
 */
const api: AxiosInstance = axios.create({
  baseURL: env.API_URL ?? "http://localhost:8081",
});

/**
 * Extracts a clean, human-readable message from FastAPI/HTTP errors.
 */
export function getApiErrorMessage(err: unknown): string {
  const e = err as AxiosError<any>;
  const data = e?.response?.data;

  // FastAPI validation error: { detail: [ { msg: "...", ... } ] }
  if (Array.isArray(data?.detail) && data.detail.length > 0) {
    return data.detail[0].msg;
  }

  // FastAPI/HTTP error: { detail: "..." }
  if (typeof data?.detail === "string") {
    return data.detail;
  }

  // Generic backend message: { message: "..." }
  if (typeof data?.message === "string") {
    return data.message;
  }

  // Raw string response
  if (typeof data === "string") {
    return data;
  }

  // Fallback: default Axios error message
  return e?.message || "Unexpected error";
}

// ------------------------------------------------------------
//  Request interceptor
// ------------------------------------------------------------

/**
 * Attach the Authorization header (Bearer token) to each request.
 */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const tokens = getTokens();
  if (tokens?.access_token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${tokens.access_token}`;
  }
  return config;
});

// ------------------------------------------------------------
//  Response interceptor: handle expired tokens (401)
// ------------------------------------------------------------

/**
 * To avoid multiple parallel refresh calls, we use a queue system.
 */
let isRefreshing = false;
let queue: { resolve: (t: string) => void; reject: (e: any) => void }[] = [];

/**
 * Resolve or reject all pending requests after refresh finishes.
 */
function flush(error: any, token: string | null) {
  queue.forEach((p) => (error ? p.reject(error) : token && p.resolve(token)));
  queue = [];
}

/**
 * Perform the refresh token request.
 * Returns a new access token and updates both tokens in storage.
 */
async function doRefresh(): Promise<string> {
  const tokens = getTokens();
  if (!tokens?.refresh_token) throw new Error("No refresh token available");
  const resp = await api.post("/auth/refresh", {
    refresh_token: tokens.refresh_token,
  });
  const { access_token, refresh_token } = resp.data;
  setTokens({ access_token, refresh_token });
  return access_token;
}

/**
 * Intercept 401 errors:
 * - If a request fails with 401, try to refresh the token once.
 * - Queue concurrent 401 requests until the refresh completes.
 * - Retry the original request after a successful refresh.
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Only handle 401 once per request
    if (status === 401 && !original?._retry) {
      if (isRefreshing) {
        // Wait for the refresh in progress
        return new Promise((resolve, reject) => {
          queue.push({
            resolve: (token: string) => {
              original.headers = original.headers ?? {};
              original.headers.Authorization = `Bearer ${token}`;
              resolve(api.request(original));
            },
            reject,
          });
        });
      }

      // Mark as retried to prevent loops
      original._retry = true;
      isRefreshing = true;

      try {
        // Get a new token
        const newToken = await doRefresh();
        flush(null, newToken);

        // Retry the original request with the new token
        original.headers = original.headers ?? {};
        original.headers.Authorization = `Bearer ${newToken}`;
        return api.request(original);
      } catch (e) {
        // If refresh fails: clear tokens and optionally redirect to login
        flush(e, null);
        clearTokens();
        // window.location.href = '/login'
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// ------------------------------------------------------------
//  Mutator function for Orval
// ------------------------------------------------------------

/**
 * The `apiFetcher` is the function Orval uses for every request.
 * It simply executes the Axios request and returns the `data` property.
 */
export async function apiFetcher<T>(config: AxiosRequestConfig): Promise<T> {
  const resp = await api.request<T>(config);
  return resp.data as T;
}

// ------------------------------------------------------------
//  Auth helper utilities
// ------------------------------------------------------------

/**
 * Save tokens to localStorage after login.
 * Typically called after a successful login mutation.
 */
export function afterLoginStoreTokens<T extends Tokens>(data: T) {
  setTokens({
    access_token: data.access_token,
    refresh_token: data.refresh_token,
  });
}

/**
 * Clear all tokens and optionally redirect user to the login page.
 */
export function logout() {
  clearTokens();
  // Optionally redirect: window.location.href = '/login'
}

// Export the configured Axios instance for direct use if needed.
export default api;
