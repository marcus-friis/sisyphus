import type { PageLoad } from "./$types";
import { fetchBoulders } from "$lib/api/boulders";

export const load: PageLoad = async () => {
  return { boulders: fetchBoulders() };
};
