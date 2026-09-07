import { getDb } from "$lib/db";

export interface Gym {
  id: number;
  name: string;
  type: "gym" | "outdoor";
}

export async function fetchGyms(): Promise<Gym[]> {
  const db = await getDb();
  return db.select<Gym[]>("SELECT id, name, type FROM gym ORDER BY name");
}

export async function createGym(
  name: string,
  type: Gym["type"] = "gym",
): Promise<number> {
  const db = await getDb();
  const result = await db.execute(
    "INSERT INTO gym (name, type) VALUES ($1, $2)",
    [name, type],
  );
  return result.lastInsertId as number;
}
