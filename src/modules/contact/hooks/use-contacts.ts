import type { Contact } from "#/types/contact";
import { fetchContacts } from "#/lib/supabase/contacts";
import { useUser } from "#/hooks/use-user";
import { useCallback, useEffect, useState } from "react";

export type ContactsLoadStatus = "loading" | "ready" | "error";

export function useContacts() {
  const { user } = useUser();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [status, setStatus] = useState<ContactsLoadStatus>("loading");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const list = await fetchContacts();
      setContacts(list);
      setStatus("ready");
    } catch (e) {
      const message = e instanceof Error ? e.message : "Failed to load contacts";
      setError(message);
      setContacts([]);
      setStatus("error");
    }
  }, [user?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  return { contacts, setContacts, status, error, refetch: load };
}
