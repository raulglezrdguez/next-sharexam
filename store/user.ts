import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "firebase/auth";

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  getUserData: () => {
    uid: string | undefined;
    email: string | null | undefined;
    displayName: string | null | undefined;
    photoURL: string | null | undefined;
    emailVerified: boolean | undefined;
  } | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => {
        set({ user, isAuthenticated: !!user });
      },
      clearUser: () => {
        set({ user: null, isAuthenticated: false });
      },
      getUserData: () => {
        const user = get().user;
        if (!user) return null;
        return {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
        };
      },
    }),
    {
      name: "user-storage",
      // Only persist basic user info, not the full Firebase User object
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        // Don't persist the full user object as it can cause serialization issues
        user: state.user
          ? {
              uid: state.user.uid,
              email: state.user.email,
              displayName: state.user.displayName,
              photoURL: state.user.photoURL,
              emailVerified: state.user.emailVerified,
            }
          : null,
      }),
      // Skip hydration to avoid conflicts with Firebase auth state
      skipHydration: true,
    }
  )
);
