import clsx from "clsx";
import type { ComponentType } from "react";
import type { ContactViewTab } from "#/modules/contact/hooks/use-contact-search";

export type ContactPageTabItem = {
  id: ContactViewTab;
  label: string;
  icon: ComponentType<{ className?: string }>;
  count?: number;
};

type ContactPageTabsProps = {
  tabs: ContactPageTabItem[];
  activeTab: ContactViewTab;
  onTabChange: (tab: ContactViewTab) => void;
};

export function ContactPageTabs({ tabs, activeTab, onTabChange }: ContactPageTabsProps) {
  return (
    <div className="border-b border-border bg-card/50">
      <div className="flex items-center gap-1 p-2 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={clsx(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm transition-all whitespace-nowrap",
                isActive
                  ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary",
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={clsx(
                    "px-1.5 py-0.5 rounded text-xs",
                    isActive ? "bg-primary-foreground/20" : "bg-muted",
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
