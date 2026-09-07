import type { PageLoad } from "./$types";
import { fetchGyms } from "$lib/api/gyms";

export const load: PageLoad = async () => {
  return { gyms: await fetchGyms() };
};
