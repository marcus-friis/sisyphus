import type { PageLoad } from "./$types";
import { fetchSettings } from "$lib/api/settings";

export const load: PageLoad = async () => {
  const settings = await fetchSettings();
  return { settings };
};
