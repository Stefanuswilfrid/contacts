import type { Contact } from "#/types/contact";
import { filterContactsByQuery } from "#/modules/contact/utils/search";

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
  const tabScoped = applyTabFilter(contacts, activeTab);
  const q = searchQuery.trim();
  const filteredContacts = q
    ? filterContactsByQuery(tabScoped, q)
    : tabScoped;

  return { filteredContacts, isSearchLoading: false };
}
