import { create } from "zustand";

interface AuthUserPreview {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface AuthState {
  status: "idle" | "authenticated" | "unauthenticated";
  user?: AuthUserPreview;
  setAuth: (payload: { status: AuthState["status"]; user?: AuthUserPreview }) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: "idle",
  user: undefined,
  setAuth: (payload) => set(() => payload),
  reset: () => set({ status: "unauthenticated", user: undefined }),
}));
