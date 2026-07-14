import { createContext } from "react";
import type { AuthFormValues, SessionUser } from "../types/auth";

export type AuthContextValue = {
  user: SessionUser | null;
  isReady: boolean;
  signIn: (values: AuthFormValues) => Promise<void>;
  signUp: (values: AuthFormValues) => Promise<void>;
  signOut: () => void;
};

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);
