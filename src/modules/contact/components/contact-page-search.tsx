import { SearchBar } from "#/components/search-bar";

type ContactPageSearchProps = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  matchCount: number;
  isSearchLoading?: boolean;
};

export function ContactPageSearch({
  searchQuery,
  onSearchChange,
  matchCount,
  isSearchLoading = false,
}: ContactPageSearchProps) {
  return (
    <div className="p-4 sm:p-6 border-b border-border bg-card/50">
      <SearchBar value={searchQuery} onChange={onSearchChange} />
      {searchQuery ? (
        <div className="mt-3 text-sm text-muted-foreground font-mono flex flex-wrap items-center gap-2">
          {isSearchLoading && (
            <span className="inline-flex items-center gap-1.5 text-primary">
              <span className="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              searching…
            </span>
          )}
          <span className="text-primary">~</span>
          found {matchCount} match{matchCount !== 1 ? "es" : ""} for
          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary">
            {`"${searchQuery}"`}
          </span>
        </div>
      ) : null}
    </div>
  );
}
