// ═══════════════════════════════════════════════════════════════
// config.js — App-wide configuration & constants
// ═══════════════════════════════════════════════════════════════

// ─── Google Apps Script URL ──────────────────────────────────
// Set this to your deployed GAS Web App URL to enable Sheets sync.
// Leave empty ("") to run in local-only mode.
const GAS_URL = ""; // e.g. "https://script.google.com/macros/s/YOUR_ID/exec"

// ─── Hardcoded Users (MVP) ────────────────────────────────────
const USERS = [
  { id: "u1", email: "cashier@beezybuddies.ph", password: "cashier2024", role: "cashier", name: "Cashier" },
  { id: "u2", email: "admin@beezybuddies.ph",   password: "admin2024!",  role: "admin",   name: "Admin"   },
];

// ─── Route Access Control ─────────────────────────────────────
const CASHIER_ROUTES = ["/sales", "/cash-count"];
const ADMIN_ROUTES   = ["/dashboard", "/sales", "/expenses", "/production", "/products", "/settings"];

// ─── Default Product Catalogue ───────────────────────────────
const DEFAULT_PRODUCTS = [
  { id: "buko-sm",   name: "Buko Pie (Small)",  type: "manufactured" },
  { id: "buko-lg",   name: "Buko Pie (Large)",  type: "manufactured" },
  { id: "pandan",    name: "Pandan Buko Pie",   type: "manufactured" },
  { id: "buko-tart", name: "Buko Tart",         type: "manufactured" },
  { id: "ube",       name: "Ube Pie",           type: "manufactured" },
  { id: "ensaymada", name: "Ensaymada",         type: "manufactured" },
  { id: "pandesal",  name: "Pandesal (pack)",   type: "resale"       },
  { id: "custom",    name: "Other / Custom",    type: "custom"       },
];

// ─── Expense Categories ───────────────────────────────────────
const EXPENSE_CATEGORIES = [
  "Ingredients", "Packaging", "Utilities", "Labor",
  "Transport", "Maintenance", "Rent", "Office Supplies", "Other",
];

// ─── Cost Recovery Defaults ───────────────────────────────────
const RECOVERY_DEFAULT = {
  percentage: 2,
  boxes:   { label: "Boxes & Display Equipment", total: 300000,  recovered: 0 },
  vehicle: { label: "Delivery Vehicle",           total: 1300000, recovered: 0 },
};