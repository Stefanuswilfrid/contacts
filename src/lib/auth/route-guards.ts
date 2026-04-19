import { redirect } from "@tanstack/react-router";
import { supabase } from "#/lib/supabase/client";

async function getSessionUser() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user ?? null;
}

/** Use on public routes (e.g. `/`): send authenticated users to the app. */
export async function requireGuest() {
  const user = await getSessionUser();
  if (user) {
    throw redirect({ to: "/dashboard" });
  }
}

/** Use on private routes (e.g. `/dashboard`): send anonymous users to login. */
export async function requireAuth() {
  const user = await getSessionUser();
  if (!user) {
    throw redirect({ to: "/" });
  }
}
