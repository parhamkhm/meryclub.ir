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

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    phone TEXT NOT NULL,
    display_name TEXT NOT NULL,
    body TEXT NOT NULL,
    item_tag TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    reaction_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    approved_at TEXT
  );

  CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
  CREATE INDEX IF NOT EXISTS idx_reviews_ranking ON reviews(status, reaction_count DESC, created_at DESC);

  CREATE TABLE IF NOT EXISTS reactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    review_id INTEGER NOT NULL REFERENCES reviews(id),
    fingerprint TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE (review_id, fingerprint)
  );

  -- Single-row cache of the homepage's top-8 review ids, refreshed at most
  -- every 12h (see getTop8Ids in server.js) so popular reviews can't
  -- permanently lock out newer ones from ever being seen.
  CREATE TABLE IF NOT EXISTS homepage_top8 (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    review_ids TEXT NOT NULL,
    computed_at INTEGER NOT NULL
  );
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
