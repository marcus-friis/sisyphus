import { getDb } from "$lib/db";
import type {
  Boulder,
  BoulderWithStats,
  NewAttemptInput,
  NewBoulderInput,
} from "$lib/types";

export async function fetchBoulders(): Promise<BoulderWithStats[]> {
  const db = await getDb();
  return db.select<BoulderWithStats[]>(`
    SELECT
      b.id,
      b.name,
      b.grade_v AS gradeV,
      b.grade_font AS gradeFont,
      b.gym_id AS gymId,
      b.wall_angle AS wallAngle,
      b.status,
      b.date_first_tried AS dateFirstTried,
      b.date_sent AS dateSent,
      b.notes,
      COALESCE(SUM(a.attempts), 0) AS totalAttempts,
      MAX(a.date) AS lastTriedDate
    FROM boulder b
    LEFT JOIN attempt a ON a.boulder_id = b.id
    GROUP BY b.id
    ORDER BY b.created_at DESC
  `);
}

export async function createBoulder(input: NewBoulderInput): Promise<number> {
  const db = await getDb();
  const result = await db.execute(
    `INSERT INTO boulder (name, grade_v, grade_font, gym_id, wall_angle, status, date_first_tried, notes)
     VALUES ($1, $2, $3, $4, $5, 'project', $6, $7)`,
    [
      input.name ?? null,
      input.gradeV,
      input.gradeFont ?? null,
      input.gymId ?? null,
      input.wallAngle ?? null,
      new Date().toISOString().slice(0, 10),
      input.notes ?? null,
    ],
  );
  return result.lastInsertId as number;
}

export async function createBoulderWithFirstAttempt(
  boulder: NewBoulderInput,
  firstAttempt: NewAttemptInput,
): Promise<number> {
  const db = await getDb();

  const status =
    firstAttempt.result === "fell" ? "project" : firstAttempt.result;
  const dateSent = firstAttempt.result === "fell" ? null : firstAttempt.date;

  const boulderResult = await db.execute(
    `INSERT INTO boulder (name, grade_v, grade_font, gym_id, wall_angle, status, date_first_tried, date_sent, notes)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      boulder.name ?? null,
      boulder.gradeV,
      boulder.gradeFont ?? null,
      boulder.gymId ?? null,
      boulder.wallAngle ?? null,
      status,
      firstAttempt.date,
      dateSent,
      boulder.notes ?? null,
    ],
  );
  const boulderId = boulderResult.lastInsertId as number;

  await db.execute(
    `INSERT INTO attempt (boulder_id, date, attempts, result, notes) VALUES ($1, $2, $3, $4, $5)`,
    [
      boulderId,
      firstAttempt.date,
      firstAttempt.attempts,
      firstAttempt.result,
      firstAttempt.notes ?? null,
    ],
  );

  return boulderId;
}

export async function fetchBoulderById(id: number): Promise<Boulder | null> {
  const db = await getDb();
  const [row] = await db.select<Boulder[]>(
    `SELECT id, name, grade_v AS gradeV, grade_font AS gradeFont, gym_id AS gymId,
            wall_angle AS wallAngle, status, date_first_tried AS dateFirstTried,
            date_sent AS dateSent, notes
     FROM boulder WHERE id = $1`,
    [id],
  );
  return row ?? null;
}

export async function deleteBoulder(id: number): Promise<void> {
  const db = await getDb();
  await db.execute("DELETE FROM boulder WHERE id = $1", [id]); // cascades to attempt + media
}
