import { getDb } from "$lib/db";

export interface GradePyramidRow {
  gradeV: number;
  count: number;
}

export interface MonthlyVolumeRow {
  month: string; // 'YYYY-MM'
  boulders: number; // distinct boulders touched
  attempts: number; // total tries logged
}

export interface ProgressRow {
  month: string;
  maxGrade: number;
}

export interface SendStats {
  totalSent: number;
  totalFlashed: number;
  totalProjects: number;
  avgAttemptsToSend: number | null;
}

export async function fetchGradePyramid(): Promise<GradePyramidRow[]> {
  const db = await getDb();
  return db.select<GradePyramidRow[]>(`
    SELECT grade_v AS gradeV, COUNT(*) AS count
    FROM boulder
    WHERE status IN ('sent', 'flashed')
    GROUP BY grade_v
    ORDER BY grade_v
  `);
}

export async function fetchMonthlyVolume(): Promise<MonthlyVolumeRow[]> {
  const db = await getDb();
  return db.select<MonthlyVolumeRow[]>(`
    SELECT strftime('%Y-%m', date) AS month,
           COUNT(DISTINCT boulder_id) AS boulders,
           SUM(attempts) AS attempts
    FROM attempt
    GROUP BY month
    ORDER BY month
  `);
}

export async function fetchProgressOverTime(): Promise<ProgressRow[]> {
  const db = await getDb();
  return db.select<ProgressRow[]>(`
    SELECT strftime('%Y-%m', date_sent) AS month, MAX(grade_v) AS maxGrade
    FROM boulder
    WHERE date_sent IS NOT NULL
    GROUP BY month
    ORDER BY month
  `);
}

export async function fetchSendStats(): Promise<SendStats> {
  const db = await getDb();
  const [counts] = await db.select<
    { sent: number; flashed: number; projects: number }[]
  >(`
    SELECT
      SUM(CASE WHEN status = 'sent' THEN 1 ELSE 0 END) AS sent,
      SUM(CASE WHEN status = 'flashed' THEN 1 ELSE 0 END) AS flashed,
      SUM(CASE WHEN status = 'project' THEN 1 ELSE 0 END) AS projects
    FROM boulder
  `);

  // Average total attempts across boulders that eventually got sent — flashes count as 1.
  const [avg] = await db.select<{ avgAttempts: number | null }[]>(`
    SELECT AVG(total) AS avgAttempts FROM (
      SELECT b.id, SUM(a.attempts) AS total
      FROM boulder b JOIN attempt a ON a.boulder_id = b.id
      WHERE b.status IN ('sent', 'flashed')
      GROUP BY b.id
    )
  `);

  return {
    totalSent: counts?.sent ?? 0,
    totalFlashed: counts?.flashed ?? 0,
    totalProjects: counts?.projects ?? 0,
    avgAttemptsToSend: avg?.avgAttempts ?? null,
  };
}
