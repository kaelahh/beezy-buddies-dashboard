// ═══════════════════════════════════════════════════════════════
// pages/ExpensesPage.js
// ═══════════════════════════════════════════════════════════════

function ExpensesPage({ navigate, user, pendingCount }) {
  const { state, addExpense } = React.useContext(AppCtx);
  const toast = React.useContext(ToastCtx);

  const [form, setForm] = React.useState({
    item_name: "", category: "Ingredients", supplier: "", amount: "", payment_method: "Cash",
  });
  const [errors,   setErrors]   = React.useState({});
  const [saving,   setSaving]   = React.useState(false);
  const [filter,   setFilter]   = React.useState("all");
  const [showForm, setShowForm] = React.useState(false);

  const todayExpenses = state.expenses.filter(e => e.date === todayS());
  const todayTotal    = todayExpenses.reduce((s, e) => s + (+e.amount || 0), 0);

  const updateForm = (k, v) => { setForm(f => ({ ...f, [k]: v })); setErrors({}); };

  const validate = () => {
    const e = {};
    if (!form.item_name.trim())         e.item_name = true;
    if (!form.amount || +form.amount <= 0) e.amount = true;
    return e;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    const exp = {
      id: genId(), date: todayS(), timestamp: nowISO(), created_by: user.name,
      ...form, amount: +form.amount,
    };
    await addExpense(exp);
    setSaving(false);
    toast("Expense saved! 📝");
    setForm({ item_name: "", category: "Ingredients", supplier: "", amount: "", payment_method: "Cash" });
    setShowForm(false);
  };

  const cats  = ["all", ...EXPENSE_CATEGORIES];
  const shown = filter === "all" ? todayExpenses : todayExpenses.filter(e => e.category === filter);

  return (
    <div className="page">
      <PageHeader
        title="📋 Expenses"
        sub={`Today: ${peso(todayTotal)}`}
        navigate={navigate}
        user={user}
        pendingCount={pendingCount}
        action={
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
            <Icon name="plus" size={14} /> Add
          </button>
        }
      />
      <div className="page-body">

        {/* ── KPIs ── */}
        <div className="grid-2 mb-3">
          <div className="stat-card">
            <div className="stat-lbl">Today's Expenses</div>
            <div className="stat-val">{peso(todayTotal)}</div>
          </div>
          <div className="stat-card yellow">
            <div className="stat-lbl" style={{ color: "rgba(0,0,0,.6)" }}>Transactions</div>
            <div className="stat-val">{todayExpenses.length}</div>
          </div>
        </div>

        {/* ── Category filter ── */}
        <div style={{ overflowX: "auto", display: "flex", gap: 8, paddingBottom: 8, marginBottom: 12 }}>
          {cats.map(c => (
            <button key={c} className={`chip ${filter === c ? "active" : ""}`} style={{ whiteSpace: "nowrap" }} onClick={() => setFilter(c)}>
              {c === "all" ? "All" : c}
            </button>
          ))}
        </div>

        {/* ── List ── */}
        <div className="card">
          {shown.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🛍️</div>
              <div className="empty-title">No expenses today</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Tap + Add to record one.</div>
            </div>
          ) : (
            [...shown].reverse().map(e => (
              <div key={e.id} className="list-item">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{e.item_name}</div>
                    <div style={{ display: "flex", gap: 6, marginTop: 4, flexWrap: "wrap" }}>
                      <span className="badge badge-green">{e.category}</span>
                      <span className={`badge ${e.payment_method === "Cash" ? "badge-gray" : "badge-yellow"}`}>
                        {e.payment_method}
                      </span>
                    </div>
                    {e.supplier && <div style={{ fontSize: 12, color: "var(--tx3)", marginTop: 4 }}>{e.supplier}</div>}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, fontSize: 16, color: "var(--r500)" }}>{peso(e.amount)}</div>
                    <div style={{ fontSize: 11, color: "var(--tx3)", marginTop: 2 }}>
                      {new Date(e.timestamp).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Add Expense Modal ── */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="➕ New Expense">
        <div className="field mb-2">
          <label className="label">Item Name *</label>
          <input className={`input ${errors.item_name ? "input-error" : ""}`} value={form.item_name} onChange={e => updateForm("item_name", e.target.value)} placeholder="e.g. Flour (25kg)" />
        </div>
        <div className="row gap-2 mb-2">
          <div className="field">
            <label className="label">Category</label>
            <select className="input select" value={form.category} onChange={e => updateForm("category", e.target.value)}>
              {EXPENSE_CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="field">
            <label className="label">Payment</label>
            <select className="input select" value={form.payment_method} onChange={e => updateForm("payment_method", e.target.value)}>
              <option>Cash</option>
              <option>GCash</option>
            </select>
          </div>
        </div>
        <div className="field mb-2">
          <label className="label">Supplier</label>
          <input className="input" value={form.supplier} onChange={e => updateForm("supplier", e.target.value)} placeholder="Optional" />
        </div>
        <div className="field mb-3">
          <label className="label">Amount (₱) *</label>
          <input className={`input ${errors.amount ? "input-error" : ""}`} type="number" min="0" step="0.01" value={form.amount} onChange={e => updateForm("amount", e.target.value)} placeholder="0.00" />
        </div>
        <div className="row gap-2">
          <button className="btn btn-ghost btn-full" onClick={() => setShowForm(false)}>Cancel</button>
          <button className="btn btn-primary btn-full" onClick={handleSave} disabled={saving}>
            {saving ? <Spinner /> : "Save Expense"}
          </button>
        </div>
      </Modal>
    </div>
  );
}