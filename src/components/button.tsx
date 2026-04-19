import clsx from "clsx";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "outline";

export type ButtonProps = {
  variant?: ButtonVariant;
  fullWidth?: boolean;
  isLoading?: boolean;
  children: ReactNode;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export function Button({
  variant = "primary",
  fullWidth = false,
  isLoading = false,
  children,
  className,
  disabled,
  type = "button",
  ...rest
}: ButtonProps) {
  const isDisabled = Boolean(disabled) || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={clsx(
        "inline-flex items-center justify-center rounded-xl font-mono transition-all duration-200",
        fullWidth && "w-full",
        variant === "primary" && [
          "gap-3 py-4 text-lg",
          disabled && !isLoading
            ? "bg-muted text-muted-foreground cursor-not-allowed"
            : isLoading
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 cursor-wait opacity-90"
              : "bg-primary text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 hover:-translate-y-0.5",
        ],
        variant === "outline" &&
          "gap-2 border-2 border-border py-3 text-sm text-foreground hover:border-primary/50 hover:bg-secondary/50",
        className,
      )}
      {...rest}
    >
      {variant === "primary" && isLoading ? (
        <>
          <span
            className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground"
            aria-hidden
          />
          {children}
        </>
      ) : variant === "outline" && isLoading ? (
        <>
          <span
            className="h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-primary/30 border-t-primary"
            aria-hidden
          />
          {children}
        </>
      ) : (
        children
      )}
    </button>
  );
}
