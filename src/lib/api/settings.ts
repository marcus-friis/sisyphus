import { getDb } from "$lib/db";

export interface Settings {
  username: string;
  gradeSystem: "v" | "font";
  defaultGymId: number | null;
}

export async function fetchSettings(): Promise<Settings | null> {
  const db = await getDb();
  const [row] = await db.select<Settings[]>(
    "SELECT username, grade_system AS gradeSystem, default_gym_id AS defaultGymId FROM settings WHERE id = 1",
  );
  return row ?? null;
}

export async function createSettings(username: string): Promise<void> {
  const db = await getDb();
  await db.execute("INSERT INTO settings (id, username) VALUES (1, $1)", [
    username,
  ]);
}

export async function updateUsername(username: string): Promise<void> {
  const db = await getDb();
  await db.execute("UPDATE settings SET username = $1 WHERE id = 1", [
    username,
  ]);
}

export async function updateGradeSystem(
  gradeSystem: "v" | "font",
): Promise<void> {
  const db = await getDb();
  await db.execute("UPDATE settings SET grade_system = $1 WHERE id = 1", [
    gradeSystem,
  ]);
}
