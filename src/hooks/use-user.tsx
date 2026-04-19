import React from "react";
import type { AuthError, Session, User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { isSupabaseConfigured, supabase } from "#/lib/supabase/client";

function toastAuthError(error: AuthError) {
  const msg = error.message.toLowerCase();
  const rateLimited =
    error.status === 429 ||
    msg.includes("rate limit") ||
    msg.includes("too many requests") ||
    msg.includes("email rate");
  if (rateLimited) {
    toast.error(
      "Email rate limit: wait a bit before trying again. For local dev, turn off “Confirm email” in Supabase → Authentication → Providers → Email so sign-up does not send mail.",
    );
    return;
  }
  toast.error(error.message);
}

export type LoginFormValues = {
  email: string;
  password: string;
};

type OAuthProvider = "github" | "google";

function getDisplayName(user: User | null): string {
  if (!user) return "guest";
  return (
    user.email ??
    (typeof user.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null) ??
    "guest"
  );
}

type AuthContextValue = {
  user: User | null;
  displayName: string;
  session: Session | null;
  login: (payload: LoginFormValues) => Promise<boolean>;
  signUp: (payload: LoginFormValues) => Promise<boolean>;
  signInWithOAuth: (provider: OAuthProvider) => Promise<void>;
  oauthProvider: OAuthProvider | null;
  logout: () => Promise<void>;
  isRequesting: boolean;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<Session | null>(null);
  const [isRequesting, setIsRequesting] = React.useState(false);
  const [oauthProvider, setOauthProvider] = React.useState<OAuthProvider | null>(null);

  React.useEffect(() => {
    if (!isSupabaseConfigured()) return;

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = React.useCallback(async (payload: LoginFormValues) => {
    if (!isSupabaseConfigured()) {
      toast.error("Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.");
      return false;
    }
    setIsRequesting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: payload.email.trim(),
        password: payload.password,
      });
      if (error) {
        toastAuthError(error);
        return false;
      }
      toast.success("Welcome back!");
      return true;
    } finally {
      setIsRequesting(false);
    }
  }, []);

  const signUp = React.useCallback(async (payload: LoginFormValues) => {
    if (!isSupabaseConfigured()) {
      toast.error("Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.");
      return false;
    }
    setIsRequesting(true);
    try {
      const email = payload.email.trim();
      const { data, error } = await supabase.auth.signUp({
        email,
        password: payload.password,
        options: {
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) {
        toastAuthError(error);
        return false;
      }
      // Only an empty *array* means "already registered" (Supabase omits identities on some responses).
      if (Array.isArray(data.user?.identities) && data.user.identities.length === 0) {
        toast.error("This email is already registered. Try signing in.");
        return false;
      }
      if (data.session) {
        toast.success("Welcome! Your account is ready.");
        return true;
      }
      // Email confirmation enabled in Supabase: no session until the user confirms.
      toast.success("Check your email to confirm your account, then sign in.");
      return false;
    } finally {
      setIsRequesting(false);
    }
  }, []);

  const signInWithOAuth = React.useCallback(async (provider: OAuthProvider) => {
    if (!isSupabaseConfigured()) {
      toast.error("Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.");
      return;
    }
    setOauthProvider(provider);
    try {
      const redirectTo = `${window.location.origin}/dashboard`;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo,
          ...(provider === "github" && {
            scopes: "read:user user:email",
          }),
        },
      });
      if (error) {
        toastAuthError(error);
        return;
      }
      if (data.url) {
        window.location.assign(data.url);
        return;
      }
      toast.error("Could not start sign-in. Check Supabase Auth providers and redirect URLs.");
    } finally {
      setOauthProvider(null);
    }
  }, []);

  const logout = React.useCallback(async () => {
    setIsRequesting(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toastAuthError(error);
        return;
      }
      toast.success("Signed out");
    } finally {
      setIsRequesting(false);
    }
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({
      user: session?.user ?? null,
      displayName: getDisplayName(session?.user ?? null),
      session,
      login,
      signUp,
      signInWithOAuth,
      oauthProvider,
      logout,
      isRequesting,
    }),
    [session, login, signUp, signInWithOAuth, oauthProvider, logout, isRequesting],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useUser(): AuthContextValue {
  const ctx = React.useContext(AuthContext);
  if (!ctx) {
    throw new Error("useUser must be used within AuthProvider");
  }
  return ctx;
}
