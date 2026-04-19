import { Users, Sparkles, User, LogOut } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useUser } from "#/hooks/use-user";

export function ContactPageHeader() {
  const navigate = useNavigate();
  const { user, logout, isRequesting } = useUser();
  const displayName =
    user?.email ??
    (typeof user?.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : null) ??
    "guest";

  async function handleLogout() {
    await logout();
    await navigate({ to: "/" });
  }

  return (
    <header className="border-b border-border p-4 sm:p-6 bg-card">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
            <Users className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-sans text-foreground tracking-wide">
              contacts<span className="text-primary">.app</span>
            </h1>
            <div className="text-sm text-muted-foreground font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              your people, organized
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-border">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <User className="w-4 h-4 text-primary" />
            </div>
            <span className="hidden sm:block font-mono text-sm text-foreground truncate max-w-[12rem]">
              {displayName}
            </span>
          </div>

          <button
            type="button"
            onClick={() => void handleLogout()}
            disabled={isRequesting}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 border-border font-mono text-sm text-muted-foreground hover:border-destructive/50 hover:text-destructive hover:bg-destructive/5 transition-all disabled:opacity-50 disabled:pointer-events-none"
            title="Sign out"
          >
            {isRequesting ? (
              <span className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-muted-foreground" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
