export const ssr = false;

import { redirect } from "@sveltejs/kit";
import { fetchSettings } from "$lib/api/settings";

export const load = async ({ url }) => {
  const settings = await fetchSettings();

  if (!settings && url.pathname !== "/register") {
    redirect(307, "/register");
  }

  return { username: settings?.username };
};
