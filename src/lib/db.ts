import Database from "@tauri-apps/plugin-sql";

let dbInstance: Database | null = null;

// A module-level singleton is safe here specifically because this is a
// single-user desktop process, not a multi-request server — the usual
// "don't share mutable module state" rule for SvelteKit servers doesn't apply.
export async function getDb(): Promise<Database> {
  if (!dbInstance) {
    dbInstance = await Database.load("sqlite:boulder.db");
  }
  return dbInstance;
}
