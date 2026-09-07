import type { PageLoad } from "./$types";
import {
  fetchGradePyramid,
  fetchMonthlyVolume,
  fetchProgressOverTime,
  fetchSendStats,
} from "$lib/api/analytics";

export const load: PageLoad = async () => {
  const [pyramid, volume, progress, stats] = await Promise.all([
    fetchGradePyramid(),
    fetchMonthlyVolume(),
    fetchProgressOverTime(),
    fetchSendStats(),
  ]);

  return { pyramid, volume, progress, stats };
};
