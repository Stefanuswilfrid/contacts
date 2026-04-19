import type { Contact } from "#/types/contact";
import { fetchContacts } from "#/lib/supabase/contacts";
import { isSupabaseConfigured } from "#/lib/supabase/client";
import { useUser } from "#/hooks/use-user";
import { useCallback, useEffect, useState } from "react";

export type ContactsLoadStatus = "loading" | "ready" | "error";

const MISSING_ENV =
  "Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.";

export function useContacts() {
  const { user } = useUser();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [status, setStatus] = useState<ContactsLoadStatus>(() =>
    isSupabaseConfigured() ? "loading" : "error",
  );
  const [error, setError] = useState<string | null>(() =>
    isSupabaseConfigured() ? null : MISSING_ENV,
  );

  const load = useCallback(async () => {
    if (!isSupabaseConfigured()) {
      setContacts([]);
      setError(MISSING_ENV);
      setStatus("error");
      return;
    }

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
