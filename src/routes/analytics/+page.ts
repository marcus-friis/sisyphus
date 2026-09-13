import type { PageLoad } from "./$types";
import {
  fetchGradePyramid,
  fetchMonthlyVolume,
  fetchProgressOverTime,
  fetchSendStats,
} from "$lib/api/analytics";

export const load: PageLoad = async () => {
  return {
    pyramid: fetchGradePyramid(),
    volume: fetchMonthlyVolume(),
    progress: fetchProgressOverTime(),
    stats: fetchSendStats(),
  };
};
