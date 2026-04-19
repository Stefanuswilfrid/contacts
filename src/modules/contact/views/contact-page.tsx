import type { Contact } from "#/types/contact";
import { Clock, List } from "lucide-react";
import { useMemo, useState } from "react";

import { useUser } from "#/hooks/use-user";
import { useContacts } from "#/modules/contact/hooks/use-contacts";
import { useContactSearch, type ContactViewTab } from "#/modules/contact/hooks/use-contact-search";
import { ContactPageSearch } from "../components/contact-page-search";
import { ContactPageFooter } from "../layout/contact-page-footer";
import { ContactPageHeader } from "../layout/contact-page-header";
import { ContactPageMain } from "../components/contact-page-main";
import { ContactPageTabs } from "../components/contact-page-tabs";

export function ContactPage() {
  const { displayName } = useUser();
  const { contacts, setContacts, status: contactsStatus, error: contactsError } =
    useContacts();
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<ContactViewTab>("all");

  const { filteredContacts, isSearchLoading } = useContactSearch({
    contacts,
    activeTab,
    searchQuery,
  });

  const tabs = useMemo(() => {
    const recentCount = contacts.filter((c) => c.lastViewed).length;
    return [
      { id: "all" as const, label: "all", icon: List, count: contacts.length },
      {
        id: "recent" as const,
        label: "recent",
        icon: Clock,
        count: Math.min(recentCount, 5),
      },
    ];
  }, [contacts]);

  const handleSelectContact = (contact: Contact) => {
    setContacts((prev) =>
      prev.map((c) =>
        c.id === contact.id ? { ...c, lastViewed: Date.now() } : c,
      ),
    );
    setSelectedContact({ ...contact, lastViewed: Date.now() });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex h-screen max-w-7xl flex-col">
        <ContactPageHeader />

        <ContactPageTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <ContactPageSearch
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          matchCount={filteredContacts.length}
          isSearchLoading={isSearchLoading}
        />

        <ContactPageMain
          list={{
            activeTab,
            contacts: filteredContacts,
            status: contactsStatus,
            error: contactsError,
            onSelect: handleSelectContact,
          }}
          details={{
            contact: selectedContact,
            onClose: () => setSelectedContact(null),
          }}
        />

        <ContactPageFooter displayName={displayName} />
      </div>

      
    </div>
  );
}
