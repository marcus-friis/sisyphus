import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { fetchBoulderById } from "$lib/api/boulders";
import { fetchAttemptsForBoulder } from "$lib/api/attempts";
import { fetchMediaForBoulder } from "$lib/api/media";

export const load: PageLoad = async ({ params }) => {
  const id = Number(params.id);
  const boulder = await fetchBoulderById(id);

  if (!boulder) {
    error(404, "Boulder not found");
  }

  const [attempts, media] = await Promise.all([
    fetchAttemptsForBoulder(id),
    fetchMediaForBoulder(id),
  ]);

  return { boulder, attempts, media };
};
