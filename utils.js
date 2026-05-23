// ═══════════════════════════════════════════════════════════════
// utils.js — Pure helpers: formatting, storage, Sheets API
// ═══════════════════════════════════════════════════════════════

// ─── ID & Date ───────────────────────────────────────────────
const genId  = () => `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
const todayS = () => new Date().toISOString().split("T")[0];
const nowISO = () => new Date().toISOString();

// ─── Formatting ──────────────────────────────────────────────
const peso  = n => `₱${(+n || 0).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const shortD = d => new Date(d).toLocaleDateString("en-PH", { month: "short", day: "numeric" });
const fullD  = d => new Date(d).toLocaleDateString("en-PH", { month: "long", day: "numeric", year: "numeric" });
const pct    = (a, b) => b === 0 ? 0 : Math.min(100, Math.round(a / b * 100));

// ─── Business Logic ───────────────────────────────────────────
function calcLineRev(qty, price, discPct) {
  const gross = qty * price;
  return gross - gross * (discPct / 100);
}

// ─── LocalStorage Wrapper ────────────────────────────────────
const LS = {
  get: (key, fallback) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  },
};

// ─── Google Sheets API ────────────────────────────────────────
const sheetsAPI = {
  async send(action, payload) {
    if (!GAS_URL) return false;
    try {
      await fetch(GAS_URL, {
        method:  "POST",
        mode:    "no-cors",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ action, payload }),
      });
      return true;
    } catch {
      return false;
    }
  },

  async setup() {
    return sheetsAPI.send("setup", {});
  },

  async syncQueue(queue, onDone) {
    const failed = [];
    for (const item of queue) {
      const ok = await sheetsAPI.send(item.action, item.payload);
      if (!ok) failed.push(item);
    }
    onDone(failed);
  },
};