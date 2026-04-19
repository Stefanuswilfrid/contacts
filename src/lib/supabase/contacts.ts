import type { Contact } from "#/types/contact";
import { supabase } from "#/lib/supabase/client";

/** Row shape from `public.users` (snake_case + jsonb). Not `auth.users`. */
export type UserRow = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Contact["address"];
  phone: string;
  website: string;
  company: Contact["company"];
  is_favorite: boolean | null;
  last_viewed: number | null;
  /** Present for rows created when someone signs up; null for seeded demo contacts */
  auth_user_id?: string | null;
};

export function mapUserRowToContact(row: UserRow): Contact {
  return {
    id: row.id,
    name: row.name,
    username: row.username,
    email: row.email,
    address: row.address,
    phone: row.phone,
    website: row.website,
    company: row.company,
    ...(row.is_favorite != null && { isFavorite: row.is_favorite }),
    ...(row.last_viewed != null && { lastViewed: row.last_viewed }),
  };
}

/**
 * Load contact list rows from `public.users`. Requires that table plus RLS
 * allowing read for your client (anon/authenticated as you prefer).
 *
 * Uses `getUser()` at fetch time (not React state) so the session is visible
 * right after signup/redirect, then drops the row whose `auth_user_id` matches
 * the signed-in user (client-side filter avoids PostgREST `.or()` quirks with UUIDs).
 */
export async function fetchContacts(): Promise<Contact[]> {
  const {
    data: { user: sessionUser },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw error;
  if (!data?.length) return [];

  let rows = data as UserRow[];
  const uid = sessionUser?.id;
  const sessionEmail = sessionUser?.email?.trim().toLowerCase();
  if (uid) {
    rows = rows.filter((row) => {
      if (row.auth_user_id === uid) return false;
      // If the signup trigger didn’t set auth_user_id yet, still hide “your” row by email
      if (
        sessionEmail &&
        !row.auth_user_id &&
        row.email?.trim().toLowerCase() === sessionEmail
      ) {
        return false;
      }
      return true;
    });
  }

  return rows.map(mapUserRowToContact);
}
