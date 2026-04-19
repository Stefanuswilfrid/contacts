import clsx from "clsx";
import { ArrowRight, Eye, EyeOff, Sparkles, User, Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "#/components/button";
import { useUser } from "#/hooks/use-user";

export function LoginForm() {
    const navigate = useNavigate();
    const { login, signUp, isRequesting, signInWithOAuth, oauthProvider } = useUser();
    const [isSignUp, setIsSignUp] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!email.trim() || !password) return;
        if (isSignUp) {
            const ok = await signUp({ email, password });
            if (ok) await navigate({ to: "/dashboard" });
            return;
        }
        const ok = await login({ email, password });
        if (ok) await navigate({ to: "/dashboard" });
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary shadow-lg shadow-primary/30 mb-6 animate-bounce-subtle">
            <User className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="font-display text-5xl leading-none text-foreground tracking-wide mb-3">
            contacts<span className="text-primary">.app</span>
          </h1>
          <div className="text-muted-foreground font-mono text-sm tracking-wide flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            {isSignUp ? "create your account" : "welcome back, friend"}
            <Sparkles className="w-4 h-4 text-primary" />
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-card rounded-2xl border border-border p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email (Supabase email + password) */}
            <div className="space-y-2">
              <label className="block text-sm font-mono text-foreground">
                email <span className="text-primary">*</span>
              </label>
              <div
                className={clsx(
                  "relative rounded-xl border-2 transition-all duration-200",
                  focusedField === "email"
                    ? "border-primary shadow-md shadow-primary/10"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <User className={clsx(
                    "w-5 h-5 transition-colors",
                    focusedField === "email" ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="you@example.com"
                  className="w-full bg-transparent pl-12 pr-4 py-4 font-mono text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-mono text-foreground">
                password <span className="text-primary">*</span>
              </label>
              <div
                className={clsx(
                  "relative rounded-xl border-2 transition-all duration-200",
                  focusedField === "password"
                    ? "border-primary shadow-md shadow-primary/10"
                    : "border-border hover:border-primary/50"
                )}
              >
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Lock className={clsx(
                    "w-5 h-5 transition-colors",
                    focusedField === "password" ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="enter your password..."
                  className="w-full bg-transparent pl-12 pr-12 py-4 font-mono text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            {!isSignUp ? (
              <div className="flex items-center justify-between text-sm font-mono">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="w-5 h-5 rounded-md border-2 border-border group-hover:border-primary/50 flex items-center justify-center transition-colors">
                    <div className="w-2.5 h-2.5 rounded-sm bg-primary scale-0 group-hover:scale-100 transition-transform" />
                  </div>
                  <span className="text-muted-foreground group-hover:text-foreground transition-colors">
                    remember me
                  </span>
                </label>
                <button
                  type="button"
                  className="text-primary hover:underline"
                >
                  forgot password?
                </button>
              </div>
            ) : null}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isRequesting}
              disabled={!email.trim() || !password}
            >
              {isRequesting ? (
                isSignUp ? (
                  "creating account..."
                ) : (
                  "logging in..."
                )
              ) : isSignUp ? (
                <>
                  create account
                  <ArrowRight className="h-5 w-5" />
                </>
              ) : (
                <>
                  sign in
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-4 text-muted-foreground font-mono">
                or continue with
              </span>
            </div>
          </div>

          {/* Social Login — enable GitHub & Google in Supabase → Authentication → Providers */}
          <div className="grid  gap-4 ">
            <Button
              type="button"
              variant="outline"
              fullWidth
              isLoading={oauthProvider === "google"}
              disabled={Boolean(oauthProvider) || isRequesting}
              onClick={() => void signInWithOAuth("google")}
            >
              {oauthProvider === "google" ? (
                "redirecting…"
              ) : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  google
                </>
              )}
            </Button>
          </div>

          {/* Sign up / Sign in toggle */}
          <p className="mt-8 text-center text-sm font-mono text-muted-foreground">
            {isSignUp ? (
              <>
                already have an account?{" "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => setIsSignUp(false)}
                >
                  sign in
                </button>
              </>
            ) : (
              <>
                {"don't have an account? "}
                <button
                  type="button"
                  className="text-primary hover:underline"
                  onClick={() => setIsSignUp(true)}
                >
                  sign up
                </button>
              </>
            )}
          </p>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs font-mono text-muted-foreground">
          made with <span className="text-primary">{"<3"}</span> 
          <span className="animate-blink ml-1">_</span>
        </p>
      </div>
    </div>
    )    
}