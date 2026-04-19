import type { Contact } from "#/types/contact";
import { filterContactsByQuery } from "#/modules/contact/utils/search";
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
    return filterContactsByQuery(tabScoped, q);
  }, [tabScoped, searchQuery]);

  return { filteredContacts, isSearchLoading: false };
}
