import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type AuthRecord = Record<string, unknown>;

export interface AuthSession {
  raw: AuthRecord;
  token: string | null;
  refreshToken: string | null;
  email: string | null;
  user: AuthRecord | null;
  authenticatedAt: string;
}

interface AuthState {
  session: AuthSession | null;
  setSession: (response: unknown) => void;
  clearSession: () => void;
}

const toRecord = (value: unknown): AuthRecord | null =>
  value && typeof value === "object" ? (value as AuthRecord) : null;

const toStringValue = (value: unknown): string | null =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : null;

const pickString = (source: AuthRecord | null, keys: string[]) => {
  if (!source) {
    return null;
  }

  for (const key of keys) {
    const candidate = toStringValue(source[key]);

    if (candidate) {
      return candidate;
    }
  }

  return null;
};

export const normalizeAuthSession = (response: unknown): AuthSession => {
  const root = toRecord(response) ?? { value: response };
  const nestedData = toRecord(root.data);
  const candidate = nestedData ?? root;
  const user = toRecord(root.user) ?? toRecord(candidate.user);

  const token =
    pickString(root, ["accessToken", "token", "jwt"]) ??
    pickString(candidate, ["accessToken", "token", "jwt"]);
  const refreshToken =
    pickString(root, ["refreshToken"]) ?? pickString(candidate, ["refreshToken"]);
  const email =
    pickString(user, ["email"]) ??
    pickString(candidate, ["email"]) ??
    pickString(root, ["email"]);

  return {
    raw: root,
    token,
    refreshToken,
    email,
    user,
    authenticatedAt: new Date().toISOString(),
  };
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      setSession: (response) => set({ session: normalizeAuthSession(response) }),
      clearSession: () => set({ session: null }),
    }),
    {
      name: "empreende-mais-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ session: state.session }),
    }
  )
);