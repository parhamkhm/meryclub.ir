const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");

const DB_PATH = process.env.MERY_DB_PATH || path.join(__dirname, "data", "club.db");
require("node:fs").mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new DatabaseSync(DB_PATH);
db.exec("PRAGMA journal_mode = WAL;");
db.exec("PRAGMA foreign_keys = ON;");

db.exec(`
  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL UNIQUE,
    birth_month INTEGER,
    birth_day INTEGER,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS loyalty_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS settings_audit (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    key TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT NOT NULL,
    changed_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS rewards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    member_id INTEGER NOT NULL REFERENCES members(id),
    type TEXT NOT NULL DEFAULT 'welcome',
    description TEXT NOT NULL,
    issued_at TEXT NOT NULL DEFAULT (datetime('now')),
    expires_at TEXT NOT NULL,
    redeemed_at TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_rewards_member ON rewards(member_id);
`);

// Seed default loyalty settings on first run only — never overwrites a value
// an admin has already saved (settings changes are forward-only, per spec).
const seedDefaults = {
  welcome_reward_description: "یک اسپرسو رایگان",
  welcome_reward_valid_days: "14",
};
const getStmt = db.prepare("SELECT value FROM loyalty_settings WHERE key = ?");
const insertStmt = db.prepare(
  "INSERT INTO loyalty_settings (key, value) VALUES (?, ?)"
);
for (const [key, value] of Object.entries(seedDefaults)) {
  if (!getStmt.get(key)) insertStmt.run(key, value);
}

module.exports = db;
