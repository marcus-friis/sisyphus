import { fetchBoulders } from "$lib/api/boulders";

export const load = async () => {
  const boulders = fetchBoulders();
  return { boulders };
};
