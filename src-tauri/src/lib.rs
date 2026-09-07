// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri_plugin_sql::{Migration, MigrationKind};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let migrations = vec![Migration {
        version: 1,
        description: "create_initial_tables",
        sql: "
                CREATE TABLE gym (
                  id     INTEGER PRIMARY KEY AUTOINCREMENT,
                  name   TEXT NOT NULL,
                  type   TEXT NOT NULL DEFAULT 'gym',
                  address TEXT
                );

                CREATE TABLE boulder (
                  id            INTEGER PRIMARY KEY AUTOINCREMENT,
                  name          TEXT,
                  grade_v       INTEGER NOT NULL,
                  grade_font    TEXT,
                  gym_id        INTEGER REFERENCES gym(id),
                  wall_angle    TEXT,
                  status        TEXT NOT NULL DEFAULT 'project',
                  date_first_tried DATE,
                  date_sent     DATE,
                  notes         TEXT,
                  created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
                  updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE attempt (
                  id            INTEGER PRIMARY KEY AUTOINCREMENT,
                  boulder_id    INTEGER NOT NULL REFERENCES boulder(id) ON DELETE CASCADE,
                  date          DATE NOT NULL,
                  attempts      INTEGER NOT NULL DEFAULT 1,
                  result        TEXT NOT NULL,
                  notes         TEXT
                );

                CREATE TABLE media (
                  id             INTEGER PRIMARY KEY AUTOINCREMENT,
                  boulder_id     INTEGER NOT NULL REFERENCES boulder(id) ON DELETE CASCADE,
                  attempt_id     INTEGER REFERENCES attempt(id) ON DELETE SET NULL,
                  type           TEXT NOT NULL,
                  file_path      TEXT NOT NULL,
                  thumbnail_path TEXT,
                  caption        TEXT,
                  created_at     DATETIME DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TABLE tag (
                  id   INTEGER PRIMARY KEY AUTOINCREMENT,
                  name TEXT UNIQUE NOT NULL
                );

                CREATE TABLE boulder_tag (
                  boulder_id INTEGER NOT NULL REFERENCES boulder(id) ON DELETE CASCADE,
                  tag_id     INTEGER NOT NULL REFERENCES tag(id) ON DELETE CASCADE,
                  PRIMARY KEY (boulder_id, tag_id)
                );

                CREATE TABLE settings (
                  id             INTEGER PRIMARY KEY CHECK (id = 1),
                  username       TEXT NOT NULL DEFAULT 'Climber',
                  grade_system   TEXT NOT NULL DEFAULT 'v',
                  default_gym_id INTEGER REFERENCES gym(id)
                );
            ",
        kind: MigrationKind::Up,
    }];

    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:boulder.db", migrations)
                .build(),
        )
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
