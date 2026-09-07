import { getDb } from "$lib/db";
import type { Media } from "$lib/types";

export async function fetchMediaForBoulder(
  boulderId: number,
): Promise<Media[]> {
  const db = await getDb();
  return db.select<Media[]>(
    `SELECT id, boulder_id AS boulderId, type, file_path AS filePath,
            thumbnail_path AS thumbnailPath, caption
     FROM media WHERE boulder_id = $1 ORDER BY created_at DESC`,
    [boulderId],
  );
}

export async function createMedia(
  boulderId: number,
  type: "photo" | "video",
  filePath: string,
  caption?: string,
): Promise<void> {
  const db = await getDb();
  await db.execute(
    `INSERT INTO media (boulder_id, type, file_path, caption) VALUES ($1, $2, $3, $4)`,
    [boulderId, type, filePath, caption ?? null],
  );
}

export async function deleteMedia(id: number): Promise<void> {
  const db = await getDb();
  await db.execute("DELETE FROM media WHERE id = $1", [id]); // note: leaves the file on disk, see below
}
