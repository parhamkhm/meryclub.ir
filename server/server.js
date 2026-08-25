const fs = require("node:fs");
const path = require("node:path");
const express = require("express");
const session = require("express-session");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const bcrypt = require("bcryptjs");
const db = require("./db");

const CONFIG_PATH = process.env.MERY_CONFIG_PATH || path.join(__dirname, "config.json");
const config = JSON.parse(fs.readFileSync(CONFIG_PATH, "utf8"));

const app = express();
app.set("trust proxy", 1); // behind nginx
app.use(helmet());
app.use(express.json({ limit: "10kb" }));
app.use(
  session({
    name: "mery.sid",
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      // Secure cookies require HTTPS. Production always runs behind nginx TLS;
      // MERY_INSECURE_COOKIES exists only for local http:// testing.
      secure: !process.env.MERY_INSECURE_COOKIES,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 8, // 8h
    },
  })
);

// ---- helpers ---------------------------------------------------------

function requireAdmin(req, res, next) {
  if (req.session && req.session.isAdmin) return next();
  return res.status(401).json({ ok: false, error: "unauthenticated" });
}

// Defense-in-depth CSRF check for state-changing admin routes: same-origin only.
function requireSameOrigin(req, res, next) {
  const origin = req.get("origin");
  if (origin && new URL(origin).host !== req.get("host")) {
    return res.status(403).json({ ok: false, error: "cross-origin request rejected" });
  }
  next();
}

const IRAN_MOBILE = /^09\d{9}$/;

function normalizePhone(raw) {
  return String(raw || "").trim().replace(/[\s-]/g, "");
}

// ---- public: join the club -------------------------------------------

const joinLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, code: "rate_limited", error: "تعداد درخواست‌ها زیاد بوده، کمی بعد دوباره امتحان کنید." },
});

app.post("/api/club/join", joinLimiter, (req, res) => {
  const { name, phone, birthMonth, birthDay, website, formLoadedAt } = req.body || {};

  // honeypot: real users never fill this hidden field
  if (website) return res.status(400).json({ ok: false, code: "invalid_request", error: "درخواست نامعتبر است." });

  // too-fast submission is a strong bot signal
  const elapsed = Date.now() - Number(formLoadedAt || 0);
  if (!formLoadedAt || Number.isNaN(elapsed) || elapsed < 1500) {
    return res.status(400).json({ ok: false, code: "invalid_request", error: "درخواست نامعتبر است." });
  }

  const cleanName = String(name || "").trim().slice(0, 80);
  const cleanPhone = normalizePhone(phone);

  if (cleanName.length < 2) {
    return res.status(400).json({ ok: false, code: "invalid_name", error: "نام را کامل وارد کنید." });
  }
  if (!IRAN_MOBILE.test(cleanPhone)) {
    return res.status(400).json({ ok: false, code: "invalid_phone", error: "شماره موبایل معتبر نیست. مثال: 09123456789" });
  }

  let month = null, day = null;
  if (birthMonth || birthDay) {
    month = Number(birthMonth);
    day = Number(birthDay);
    if (!Number.isInteger(month) || month < 1 || month > 12 || !Number.isInteger(day) || day < 1 || day > 31) {
      return res.status(400).json({ ok: false, code: "invalid_birthday", error: "تاریخ تولد نامعتبر است." });
    }
  }

  const existing = db.prepare("SELECT id FROM members WHERE phone = ?").get(cleanPhone);
  if (existing) {
    return res.status(409).json({ ok: false, code: "duplicate_phone", error: "این شماره قبلاً عضو باشگاه شده است." });
  }

  const insertMember = db.prepare(
    "INSERT INTO members (name, phone, birth_month, birth_day) VALUES (?, ?, ?, ?)"
  );
  const memberInfo = insertMember.run(cleanName, cleanPhone, month, day);

  const descRow = db.prepare("SELECT value FROM loyalty_settings WHERE key = 'welcome_reward_description'").get();
  const daysRow = db.prepare("SELECT value FROM loyalty_settings WHERE key = 'welcome_reward_valid_days'").get();
  const description = descRow ? descRow.value : "هدیهٔ خوش‌آمدگویی";
  const validDays = daysRow ? parseInt(daysRow.value, 10) : 14;

  const expiresAt = new Date(Date.now() + validDays * 86400000).toISOString();
  const insertReward = db.prepare(
    "INSERT INTO rewards (member_id, type, description, expires_at) VALUES (?, 'welcome', ?, ?)"
  );
  insertReward.run(memberInfo.lastInsertRowid, description, expiresAt);

  return res.json({
    ok: true,
    reward: { description, expiresAt },
  });
});

// ---- public: reviews & suggestions ------------------------------------

const REVIEW_NAME_MAXLEN = 60;
const REVIEW_BODY_MAXLEN = 600;
const REVIEW_TAG_MAXLEN = 60;
const TOP8_TTL_MS = 12 * 60 * 60 * 1000; // recompute cadence, not live

const reviewVerifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, code: "rate_limited", error: "تعداد درخواست‌ها زیاد بوده، کمی بعد دوباره امتحان کنید." },
});

// Only ever returns ok:true/false — never the member's name. Returning a
// name here would let anyone enumerate real customers by guessing numbers.
app.post("/api/reviews/verify-phone", reviewVerifyLimiter, (req, res) => {
  const cleanPhone = normalizePhone((req.body || {}).phone);
  if (!IRAN_MOBILE.test(cleanPhone)) {
    return res.status(400).json({ ok: false, code: "invalid_phone", error: "شماره موبایل معتبر نیست. مثال: 09123456789" });
  }
  const member = db.prepare("SELECT id FROM members WHERE phone = ?").get(cleanPhone);
  if (!member) {
    return res.status(404).json({ ok: false, code: "not_member", error: "این شماره عضو باشگاه مشتریان نیست." });
  }
  return res.json({ ok: true });
});

const reviewSubmitLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, code: "rate_limited", error: "تعداد درخواست‌ها زیاد بوده، کمی بعد دوباره امتحان کنید." },
});

app.post("/api/reviews", reviewSubmitLimiter, (req, res) => {
  const { phone, displayName, body, itemTag, website, formLoadedAt } = req.body || {};

  // honeypot: real users never fill this hidden field
  if (website) return res.status(400).json({ ok: false, code: "invalid_request", error: "درخواست نامعتبر است." });

  // too-fast submission is a strong bot signal
  const elapsed = Date.now() - Number(formLoadedAt || 0);
  if (!formLoadedAt || Number.isNaN(elapsed) || elapsed < 1500) {
    return res.status(400).json({ ok: false, code: "invalid_request", error: "درخواست نامعتبر است." });
  }

  const cleanPhone = normalizePhone(phone);
  if (!IRAN_MOBILE.test(cleanPhone)) {
    return res.status(400).json({ ok: false, code: "invalid_phone", error: "شماره موبایل معتبر نیست. مثال: 09123456789" });
  }

  const member = db.prepare("SELECT id FROM members WHERE phone = ?").get(cleanPhone);
  if (!member) {
    return res.status(403).json({ ok: false, code: "not_member", error: "فقط اعضای باشگاه مشتریان می‌توانند نظر ثبت کنند." });
  }

  const cleanName = String(displayName || "").trim().slice(0, REVIEW_NAME_MAXLEN);
  const cleanBody = String(body || "").trim().slice(0, REVIEW_BODY_MAXLEN);
  const cleanTag = String(itemTag || "").trim().slice(0, REVIEW_TAG_MAXLEN) || null;

  if (cleanName.length < 2) {
    return res.status(400).json({ ok: false, code: "invalid_name", error: "نام نمایشی را کامل وارد کنید." });
  }
  if (cleanBody.length < 10) {
    return res.status(400).json({ ok: false, code: "invalid_body", error: "متن نظر خیلی کوتاه است." });
  }

  db.prepare(
    "INSERT INTO reviews (phone, display_name, body, item_tag) VALUES (?, ?, ?, ?)"
  ).run(cleanPhone, cleanName, cleanBody, cleanTag);

  return res.json({ ok: true });
});

// Recomputed from the full approved pool at most every 12h (not live) so a
// review outside the current top 8 still has a fair shot at entering it —
// reactions given from /comments (prompt 2) count toward this ranking too.
function computeTop8() {
  const rows = db.prepare(
    "SELECT id FROM reviews WHERE status = 'approved' ORDER BY reaction_count DESC, created_at DESC LIMIT 8"
  ).all();
  const ids = rows.map((r) => r.id);
  const computedAt = Date.now();
  db.prepare(
    `INSERT INTO homepage_top8 (id, review_ids, computed_at) VALUES (1, ?, ?)
     ON CONFLICT(id) DO UPDATE SET review_ids = excluded.review_ids, computed_at = excluded.computed_at`
  ).run(JSON.stringify(ids), computedAt);
  return ids;
}

function getTop8Ids() {
  const cached = db.prepare("SELECT review_ids, computed_at FROM homepage_top8 WHERE id = 1").get();
  if (!cached || Date.now() - cached.computed_at > TOP8_TTL_MS) return computeTop8();
  return JSON.parse(cached.review_ids);
}

app.get("/api/reviews/top8", (req, res) => {
  const ids = getTop8Ids();
  if (ids.length === 0) return res.json({ ok: true, reviews: [] });

  const placeholders = ids.map(() => "?").join(",");
  const rows = db.prepare(
    `SELECT id, display_name, body, item_tag, reaction_count, created_at FROM reviews WHERE id IN (${placeholders})`
  ).all(...ids);
  const byId = new Map(rows.map((r) => [r.id, r]));
  const ordered = ids.map((id) => byId.get(id)).filter(Boolean);
  res.json({ ok: true, reviews: ordered });
});

// Full approved pool — used by prompt 2's /comments page.
app.get("/api/reviews", (req, res) => {
  const rows = db.prepare(
    "SELECT id, display_name, body, item_tag, reaction_count, created_at FROM reviews WHERE status = 'approved' ORDER BY created_at DESC LIMIT 500"
  ).all();
  res.json({ ok: true, reviews: rows });
});

const reactionLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, code: "rate_limited", error: "تعداد درخواست‌ها زیاد بوده، کمی بعد دوباره امتحان کنید." },
});

// Shared counter: a reaction given from the homepage or from /comments
// (prompt 2) hits this same endpoint and the same review row. `fingerprint`
// is a client-generated localStorage id, not real authentication — good
// enough to stop casual repeat-clicking on a café site, not a security boundary.
app.post("/api/reviews/:id/react", reactionLimiter, (req, res) => {
  const id = Number(req.params.id);
  const fingerprint = String((req.body || {}).fingerprint || "").trim().slice(0, 100);

  if (!Number.isInteger(id) || id <= 0 || fingerprint.length < 8) {
    return res.status(400).json({ ok: false, code: "invalid_request", error: "درخواست نامعتبر است." });
  }

  const review = db.prepare("SELECT id, reaction_count FROM reviews WHERE id = ? AND status = 'approved'").get(id);
  if (!review) return res.status(404).json({ ok: false, code: "not_found", error: "نظر یافت نشد." });

  try {
    db.prepare("INSERT INTO reactions (review_id, fingerprint) VALUES (?, ?)").run(id, fingerprint);
  } catch (err) {
    return res.json({ ok: true, alreadyReacted: true, reactionCount: review.reaction_count });
  }

  db.prepare("UPDATE reviews SET reaction_count = reaction_count + 1 WHERE id = ?").run(id);
  const updated = db.prepare("SELECT reaction_count FROM reviews WHERE id = ?").get(id);
  res.json({ ok: true, alreadyReacted: false, reactionCount: updated.reaction_count });
});

// ---- admin: auth -------------------------------------------------------

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { ok: false, error: "تلاش بیش‌ازحد. کمی بعد دوباره امتحان کنید." },
});

app.post("/api/admin/login", loginLimiter, requireSameOrigin, (req, res) => {
  const { username, password } = req.body || {};
  if (username !== config.adminUser || !bcrypt.compareSync(String(password || ""), config.adminPassHash)) {
    return res.status(401).json({ ok: false, error: "نام کاربری یا رمز عبور اشتباه است." });
  }
  req.session.isAdmin = true;
  res.json({ ok: true });
});

app.post("/api/admin/logout", requireSameOrigin, (req, res) => {
  req.session.destroy(() => res.json({ ok: true }));
});

app.get("/api/admin/session", (req, res) => {
  res.json({ ok: true, isAdmin: !!(req.session && req.session.isAdmin) });
});

// ---- admin: members ------------------------------------------------------

app.get("/api/admin/members", requireAdmin, (req, res) => {
  const q = String(req.query.q || "").trim().replace(/[\s-]/g, "");
  const members = q
    ? db.prepare("SELECT * FROM members WHERE phone LIKE ? OR name LIKE ? ORDER BY id DESC").all(`%${q}%`, `%${q}%`)
    : db.prepare("SELECT * FROM members ORDER BY id DESC LIMIT 500").all();

  const rewardStmt = db.prepare("SELECT * FROM rewards WHERE member_id = ? ORDER BY id DESC");
  const withRewards = members.map((m) => ({ ...m, rewards: rewardStmt.all(m.id) }));
  res.json({ ok: true, members: withRewards });
});

app.post("/api/admin/rewards/:id/redeem", requireAdmin, requireSameOrigin, (req, res) => {
  const id = Number(req.params.id);
  const reward = db.prepare("SELECT * FROM rewards WHERE id = ?").get(id);
  if (!reward) return res.status(404).json({ ok: false, error: "یافت نشد." });
  if (reward.redeemed_at) return res.status(409).json({ ok: false, error: "قبلاً استفاده شده است." });
  if (new Date(reward.expires_at) < new Date()) {
    return res.status(409).json({ ok: false, error: "منقضی شده است." });
  }
  db.prepare("UPDATE rewards SET redeemed_at = datetime('now') WHERE id = ? AND redeemed_at IS NULL").run(id);
  res.json({ ok: true });
});

// ---- admin: loyalty settings ---------------------------------------------

app.get("/api/admin/settings", requireAdmin, (req, res) => {
  const rows = db.prepare("SELECT key, value, updated_at FROM loyalty_settings").all();
  res.json({ ok: true, settings: rows });
});

app.post("/api/admin/settings", requireAdmin, requireSameOrigin, (req, res) => {
  const { description, validDays } = req.body || {};
  const cleanDesc = String(description || "").trim().slice(0, 200);
  const cleanDays = Number(validDays);

  if (cleanDesc.length < 2) {
    return res.status(400).json({ ok: false, error: "توضیح جایزه را وارد کنید." });
  }
  if (!Number.isInteger(cleanDays) || cleanDays < 1 || cleanDays > 365) {
    return res.status(400).json({ ok: false, error: "مدت اعتبار باید بین ۱ تا ۳۶۵ روز باشد." });
  }

  const updates = [
    ["welcome_reward_description", cleanDesc],
    ["welcome_reward_valid_days", String(cleanDays)],
  ];

  const getStmt = db.prepare("SELECT value FROM loyalty_settings WHERE key = ?");
  const updateStmt = db.prepare("UPDATE loyalty_settings SET value = ?, updated_at = datetime('now') WHERE key = ?");
  const auditStmt = db.prepare(
    "INSERT INTO settings_audit (key, old_value, new_value) VALUES (?, ?, ?)"
  );

  const txn = db.exec ? null : null; // node:sqlite has no built-in transaction helper here; do it manually
  db.exec("BEGIN");
  try {
    for (const [key, value] of updates) {
      const current = getStmt.get(key);
      if (!current || current.value !== value) {
        auditStmt.run(key, current ? current.value : null, value);
        updateStmt.run(value, key);
      }
    }
    db.exec("COMMIT");
  } catch (err) {
    db.exec("ROLLBACK");
    throw err;
  }

  res.json({ ok: true });
});

// ---- admin: settings audit log -------------------------------------------

app.get("/api/admin/settings/audit", requireAdmin, (req, res) => {
  const rows = db.prepare("SELECT * FROM settings_audit ORDER BY id DESC LIMIT 100").all();
  res.json({ ok: true, audit: rows });
});

// ---- admin: reviews -------------------------------------------------------

app.get("/api/admin/reviews", requireAdmin, (req, res) => {
  const status = ["pending", "approved", "rejected"].includes(req.query.status) ? req.query.status : "pending";
  const rows = db.prepare(
    "SELECT * FROM reviews WHERE status = ? ORDER BY created_at DESC LIMIT 500"
  ).all(status);
  res.json({ ok: true, reviews: rows });
});

app.post("/api/admin/reviews/:id/approve", requireAdmin, requireSameOrigin, (req, res) => {
  const id = Number(req.params.id);
  const review = db.prepare("SELECT id FROM reviews WHERE id = ?").get(id);
  if (!review) return res.status(404).json({ ok: false, error: "یافت نشد." });
  db.prepare("UPDATE reviews SET status = 'approved', approved_at = datetime('now') WHERE id = ?").run(id);
  res.json({ ok: true });
});

app.post("/api/admin/reviews/:id/reject", requireAdmin, requireSameOrigin, (req, res) => {
  const id = Number(req.params.id);
  const review = db.prepare("SELECT id FROM reviews WHERE id = ?").get(id);
  if (!review) return res.status(404).json({ ok: false, error: "یافت نشد." });
  db.prepare("UPDATE reviews SET status = 'rejected' WHERE id = ?").run(id);
  res.json({ ok: true });
});

// ---- static admin page ---------------------------------------------------

app.use("/club-admin", express.static(path.join(__dirname, "public")));

// Local dev only: serve the main static site from the same origin so the
// club signup form's relative /api/ calls work without a separate proxy.
// Production never sets this — nginx serves the static site there instead.
if (process.env.MERY_SERVE_ROOT) {
  app.use(express.static(process.env.MERY_SERVE_ROOT));
}

const PORT = process.env.PORT || 3210;
app.listen(PORT, "127.0.0.1", () => {
  console.log(`meryclub-api listening on 127.0.0.1:${PORT}`);
});
