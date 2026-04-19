import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";

export type InputFieldProps = {
  fieldId: string;
  label: string;
  icon: LucideIcon;
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
  right?: ReactNode;
} & Omit<ComponentProps<"input">, "id">;

export function InputField({
  fieldId,
  label,
  icon: Icon,
  focusedField,
  setFocusedField,
  right,
  className,
  onFocus,
  onBlur,
  ...inputProps
}: InputFieldProps) {
  const isFocused = focusedField === fieldId;
  return (
    <div className="space-y-2">
      <label htmlFor={fieldId} className="block text-sm font-mono text-foreground">
        {label} <span className="text-primary">*</span>
      </label>
      <div
        className={clsx(
          "relative rounded-xl border-2 transition-all duration-200",
          isFocused
            ? "border-primary shadow-md shadow-primary/10"
            : "border-border hover:border-primary/50",
        )}
      >
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <Icon
            className={clsx(
              "w-5 h-5 transition-colors",
              isFocused ? "text-primary" : "text-muted-foreground",
            )}
          />
        </div>
        <input
          id={fieldId}
          {...inputProps}
          className={clsx(
            "w-full bg-transparent pl-12 py-4 font-mono text-foreground placeholder:text-muted-foreground focus:outline-none",
            right ? "pr-12" : "pr-4",
            className,
          )}
          onFocus={(e) => {
            setFocusedField(fieldId);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocusedField(null);
            onBlur?.(e);
          }}
        />
        {right}
      </div>
    </div>
  );
}
