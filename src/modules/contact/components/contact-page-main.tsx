import type { Contact } from "#/types/contact";
import { VirtualizedList } from "#/components/virtualized-list";
import clsx from "clsx";
import { Clock, List } from "lucide-react";
import { ContactCard } from "./contact-card";
import { ContactDetails } from "./contact-details";
import type { ContactsLoadStatus } from "#/modules/contact/hooks/use-contacts";
import type { ContactViewTab } from "#/modules/contact/hooks/use-contact-search";

type ContactListProps = {
  activeTab: ContactViewTab;
  contacts: Contact[];
  status: ContactsLoadStatus;
  error: string | null;
  onSelect: (contact: Contact) => void;
};

type ContactDetailsPaneProps = {
  contact: Contact | null;
  onClose: () => void;
};

type ContactPageMainProps = {
  list: ContactListProps;
  details: ContactDetailsPaneProps;
};

export function ContactPageMain({ list, details }: ContactPageMainProps) {
  return (
    <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
      <div
        className={clsx(
          "flex-col overflow-hidden border-border bg-card/30 lg:w-[420px] lg:border-r",
          details.contact ? "hidden lg:flex" : "flex",
        )}
      >
        {list.status === "loading" ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
            <p className="font-mono text-sm text-muted-foreground">loading contacts…</p>
          </div>
        ) : list.status === "error" ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <p className="font-mono text-sm text-destructive">
              {list.error ?? "could not load contacts"}
            </p>
          </div>
        ) : list.contacts.length === 0 ? (
          <div className="flex-1 overflow-y-auto p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <span className="font-mono text-2xl text-muted-foreground">
                {list.activeTab === "recent" ? (
                  <Clock className="h-6 w-6" />
                ) : (
                  <List className="h-6 w-6" />
                )}
              </span>
            </div>
            <div className="mb-2 font-mono text-foreground">
              {list.activeTab === "recent" ? "no recent contacts" : "no matches found"}
            </div>
            <div className="font-mono text-sm text-muted-foreground">
              {list.activeTab === "recent"
                ? "view some contacts first"
                : "try a different search term"}
            </div>
          </div>
        ) : (
          <VirtualizedList
            items={list.contacts}
            estimateSize={100}
            gap={8}
            overscan={3}
            getItemKey={(c) => c.id}
            scrollClassName="px-2 pt-2"
            renderItem={(contact, index) => (
              <ContactCard
                contact={contact}
                index={index + 1}
                isSelected={details.contact?.id === contact.id}
                onClick={() => list.onSelect(contact)}
              />
            )}
          />
        )}

        <div className="border-t border-border bg-card p-3 font-mono text-xs text-muted-foreground flex shrink-0 items-center justify-center gap-2">
          <span className="text-primary">*</span>
          click a contact to view details
          <span className="animate-blink">_</span>
        </div>
      </div>

      <div
        className={clsx(
          "flex-1 flex-col overflow-hidden bg-background",
          details.contact ? "flex" : "hidden lg:flex",
        )}
      >
        {details.contact ? (
          <ContactDetails contact={details.contact} onClose={details.onClose} />
        ) : (
          <div className="flex flex-1 items-center justify-center p-8">
            <div className="max-w-sm text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 animate-bounce-subtle items-center justify-center rounded-2xl bg-primary/10">
                <span className="font-mono text-4xl text-primary">{":)"}</span>
              </div>
              <h3 className="mb-2 font-sans text-xl text-foreground">
                pick someone!
              </h3>
              <p className="font-mono text-sm text-muted-foreground">
                select a contact from the list to see their full profile
              </p>
              <div className="mt-6 font-mono text-xs text-muted-foreground/60">
                <span className="text-primary">tip:</span> use search to filter
                <span className="ml-1 animate-blink">_</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
