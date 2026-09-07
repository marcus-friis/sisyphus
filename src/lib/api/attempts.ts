import { getDb } from "$lib/db";
import type { Attempt, NewAttemptInput } from "$lib/types";

export async function fetchAttemptsForBoulder(
  boulderId: number,
): Promise<Attempt[]> {
  const db = await getDb();
  return db.select<Attempt[]>(
    `SELECT id, boulder_id AS boulderId, date, attempts, result, notes
     FROM attempt WHERE boulder_id = $1 ORDER BY date DESC, id DESC`,
    [boulderId],
  );
}

// Logging a new attempt can promote a boulder from 'project' to 'sent'/'flashed',
// so this updates the boulder row too rather than leaving that in the caller's hands.
export async function addAttempt(
  boulderId: number,
  input: NewAttemptInput,
): Promise<void> {
  const db = await getDb();

  await db.execute(
    `INSERT INTO attempt (boulder_id, date, attempts, result, notes) VALUES ($1, $2, $3, $4, $5)`,
    [boulderId, input.date, input.attempts, input.result, input.notes ?? null],
  );

  if (input.result === "sent" || input.result === "flash") {
    await db.execute(
      `UPDATE boulder SET status = $1, date_sent = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3`,
      [input.result, input.date, boulderId],
    );
  }
}
