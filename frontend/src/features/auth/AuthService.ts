import { api } from "@/core/api";
import type { UserCreate, UserLogin, UserOut, Token } from "@/lib/types";
import { useMutation } from "@tanstack/react-query";

// POST /auth/register -> UserOut
export async function registerUser(payload: UserCreate): Promise<UserOut> {
  const { data } = await api.post<UserOut>("/auth/register", payload);
  return data;
}

export function useRegisterUser() {
  return useMutation({
    mutationFn: registerUser,
  });
}

// POST /auth/login -> Token
export async function loginUser(payload: UserLogin): Promise<Token> {
  const { data } = await api.post<Token>("/auth/login", payload);
  return data;
}

export function useLoginUser() {
  return useMutation({
    mutationFn: loginUser,
  });
}

// POST /auth/refresh -> Token
// export async function refreshToken(refresh_token: string): Promise<Token> {
//   const { data } = await api.post<Token>("/auth/refresh", { refresh_token });
//   return data;
// }

// export function useRefreshToken() {
//   return useMutation({
//     mutationFn: refreshToken,
//   });
// }
