// Local dev entry point only — sets the same env vars the README's manual
// dev command sets, but in-process so it works the same across shells/OSes.
// Production never runs this file; systemd starts server.js directly with
// its own environment.
const path = require("node:path");

process.env.MERY_SERVE_ROOT = process.env.MERY_SERVE_ROOT || path.join(__dirname, "..");
process.env.MERY_INSECURE_COOKIES = process.env.MERY_INSECURE_COOKIES || "1";
process.env.PORT = process.env.PORT || "3210";

require("./server.js");
