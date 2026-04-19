import type { Contact } from "#/types/contact";

export function filterContactsByQuery(
  contacts: Contact[],
  query: string,
): Contact[] {
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
