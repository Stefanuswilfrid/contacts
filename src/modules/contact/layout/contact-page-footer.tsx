type ContactPageFooterProps = {
  displayName: string;
};

export function ContactPageFooter({ displayName }: ContactPageFooterProps) {
  return (
    <footer className="border-t border-border bg-card p-3">
      <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 text-xs font-mono text-muted-foreground">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-green-500" />
          <span>online</span>
          <span className="text-foreground/30">|</span>
          <span className="truncate">
            logged in as <span className="text-primary">{displayName}</span>
          </span>
        </div>
        <div className="hidden shrink-0 items-center gap-4 sm:flex">
          <span>
            made with <span className="text-primary">{"<3"}</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
