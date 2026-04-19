import type { Contact } from "#/types/contact";
import clsx from "clsx";

interface ContactCardProps {
  contact: Contact;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

export function ContactCard({
  contact,
  isSelected,
  onClick,
  index,
}: ContactCardProps) {
  const initials = contact.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <button
      onClick={onClick}
      className={clsx(
        "w-full text-left p-4 rounded-lg transition-all duration-200 group",
        "hover:shadow-md hover:shadow-primary/10 hover:-translate-y-0.5",
        isSelected
          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
          : "bg-card hover:bg-card border border-border hover:border-primary/30"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Index badge */}
        <span className={clsx(
          "text-xs font-mono px-1.5 py-0.5 rounded",
          isSelected ? "bg-primary-foreground/20 text-primary-foreground" : "bg-muted text-muted-foreground"
        )}>
          #{String(index).padStart(2, "0")}
        </span>

        {/* Avatar */}
        <div className="shrink-0">
          <div
            className={clsx(
              "flex h-11 w-11 items-center justify-center rounded-lg font-mono text-sm font-bold transition-colors",
              isSelected
                ? "bg-primary-foreground/20 text-primary-foreground"
                : "bg-primary/10 text-primary",
            )}
          >
            {initials}
          </div>
        </div>

        {/* Contact Info */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="flex items-center gap-2">
            <span
              className={clsx(
                "font-sans text-lg truncate",
                isSelected ? "text-primary-foreground" : "text-foreground"
              )}
            >
              {contact.name}
            </span>
          </div>
          <div className={clsx(
            "text-sm truncate font-mono",
            isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
          )}>
            @{contact.username.toLowerCase()}
            <span className="mx-1.5">{"/"}</span>
            {contact.company.name}
          </div>
        </div>

        {/* Arrow indicator */}
        <span
          className={clsx(
            "text-lg transition-all",
            isSelected 
              ? "text-primary-foreground opacity-100 translate-x-0" 
              : "text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
          )}
        >
          {">"}
        </span>
      </div>
    </button>
  );
}
