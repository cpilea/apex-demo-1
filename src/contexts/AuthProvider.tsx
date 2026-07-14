import { useCallback, useEffect, useMemo, useState } from "react";
import { readScopedStorage, removeScopedStorage, writeScopedStorage } from "../lib/localStorage";
import type { AuthFormValues, SessionUser, StoredUser } from "../types/auth";
import { AuthContext, type AuthContextValue } from "./AuthContext";

const USERS_KEY = "users";
const SESSION_KEY = "session";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

async function hashPassword(password: string) {
  const encodedPassword = new TextEncoder().encode(password);
  const digest = await crypto.subtle.digest("SHA-256", encodedPassword);

  return Array.from(new Uint8Array(digest), (value) => value.toString(16).padStart(2, "0")).join(
    ""
  );
}

function toSessionUser(user: StoredUser): SessionUser {
  const { password: _password, ...sessionUser } = user;
  return sessionUser;
}

function readUsers() {
  return readScopedStorage<StoredUser[]>(USERS_KEY, []);
}

function writeUsers(users: StoredUser[]) {
  writeScopedStorage(USERS_KEY, users);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setUser(readScopedStorage<SessionUser | null>(SESSION_KEY, null));
    setIsReady(true);
  }, []);

  const signIn = useCallback(async ({ email, password }: AuthFormValues) => {
    const normalizedEmail = normalizeEmail(email);
    const nextPasswordHash = await hashPassword(password);
    const users = readUsers();
    const existingUser = users.find(
      (candidate) => normalizeEmail(candidate.email) === normalizedEmail
    );

    const passwordMatches = Boolean(
      existingUser &&
        (existingUser.password === nextPasswordHash || existingUser.password === password)
    );

    if (!existingUser || !passwordMatches) {
      throw new Error("We couldn't match that email and password.");
    }

    if (existingUser.password !== nextPasswordHash) {
      const upgradedUsers = users.map((candidate) =>
        candidate.id === existingUser.id ? { ...candidate, password: nextPasswordHash } : candidate
      );
      writeUsers(upgradedUsers);
      existingUser.password = nextPasswordHash;
    }

    const sessionUser = toSessionUser(existingUser);
    writeScopedStorage(SESSION_KEY, sessionUser);
    setUser(sessionUser);
  }, []);

  const signUp = useCallback(async ({ name, email, password }: AuthFormValues) => {
    const trimmedName = name?.trim();
    const normalizedEmail = normalizeEmail(email);

    if (!trimmedName) {
      throw new Error("Enter your name to create an account.");
    }

    const users = readUsers();

    if (users.some((candidate) => normalizeEmail(candidate.email) === normalizedEmail)) {
      throw new Error("An account with that email already exists.");
    }

    const newUser: StoredUser = {
      id: crypto.randomUUID(),
      name: trimmedName,
      email: normalizedEmail,
      password: await hashPassword(password),
      createdAt: new Date().toISOString(),
    };

    writeUsers([...users, newUser]);

    const sessionUser = toSessionUser(newUser);
    writeScopedStorage(SESSION_KEY, sessionUser);
    setUser(sessionUser);
  }, []);

  const signOut = useCallback(() => {
    removeScopedStorage(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isReady,
      signIn,
      signUp,
      signOut,
    }),
    [isReady, signIn, signOut, signUp, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
