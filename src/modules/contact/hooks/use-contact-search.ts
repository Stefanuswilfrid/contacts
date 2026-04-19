import type { Contact } from "#/types/contact";
import { useMemo } from "react";

export type ContactViewTab = "all" | "recent";

function applyTabFilter(contacts: Contact[], activeTab: ContactViewTab): Contact[] {
  let result = [...contacts];

  if (activeTab === "recent") {
    result = result
      .filter((c) => c.lastViewed)
      .sort((a, b) => (b.lastViewed || 0) - (a.lastViewed || 0))
      .slice(0, 5);
  }

  return result;
}

function localTextFilter(contacts: Contact[], query: string): Contact[] {
  const q = query.trim().toLowerCase();
  if (!q) return contacts;
  return contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(q) ||
      contact.username.toLowerCase().includes(q) ||
      contact.email.toLowerCase().includes(q) ||
      contact.company.name.toLowerCase().includes(q) ||
      contact.address.city.toLowerCase().includes(q),
  );
}

type UseContactSearchArgs = {
  contacts: Contact[];
  activeTab: ContactViewTab;
  searchQuery: string;
};

export function useContactSearch({
  contacts,
  activeTab,
  searchQuery,
}: UseContactSearchArgs) {
  const tabScoped = useMemo(
    () => applyTabFilter(contacts, activeTab),
    [contacts, activeTab],
  );

  const filteredContacts = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return tabScoped;
    return localTextFilter(tabScoped, q);
  }, [tabScoped, searchQuery]);

  return { filteredContacts, isSearchLoading: false };
}
