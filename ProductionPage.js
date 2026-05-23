// ═══════════════════════════════════════════════════════════════
// pages/ProductionPage.js
// ═══════════════════════════════════════════════════════════════

function ProductionPage({ navigate, user, pendingCount }) {
  const { state, addProduction } = React.useContext(AppCtx);
  const toast = React.useContext(ToastCtx);

  const [form,     setForm]     = React.useState({ product: "", qty_produced: "" });
  const [saving,   setSaving]   = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);
  const [errors,   setErrors]   = React.useState({});
  const [viewDate, setViewDate] = React.useState(todayS());

  const dayProd = state.production.filter(p => p.date === viewDate);

  // Units sold per product name on viewDate
  const soldMap = React.useMemo(() => {
    const m = {};
    state.sales
      .filter(s => s.date === viewDate)
      .forEach(s => s.lines.forEach(l => { m[l.product] = (m[l.product] || 0) + l.qty; }));
    return m;
  }, [state.sales, viewDate]);

  // Units produced per product name on viewDate
  const prodMap = React.useMemo(() => {
    const m = {};
    dayProd.forEach(p => { m[p.product] = (m[p.product] || 0) + p.qty_produced; });
    return m;
  }, [dayProd]);

  // All products that have either production or are manufactured type
  const allProducts = [...new Set([
    ...Object.keys(prodMap),
    ...state.products.filter(p => p.type === "manufactured").map(p => p.name),
  ])];

  const validate = () => {
    const e = {};
    if (!form.product)                          e.product = true;
    if (!form.qty_produced || +form.qty_produced <= 0) e.qty = true;
    return e;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    const prod = {
      id: genId(), date: viewDate, timestamp: nowISO(), created_by: user.name,
      product: form.product, qty_produced: +form.qty_produced,
    };
    await addProduction(prod);
    setSaving(false);
    toast("Production logged! 🏭");
    setForm({ product: "", qty_produced: "" });
    setShowForm(false);
  };

  return (
    <div className="page">
      <PageHeader
        title="🏭 Production"
        sub="Daily production log"
        navigate={navigate}
        user={user}
        pendingCount={pendingCount}
        action={
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(true)}>
            <Icon name="plus" size={14} /> Log
          </button>
        }
      />
      <div className="page-body">

        <div className="field mb-3">
          <label className="label">View Date</label>
          <input className="input" type="date" value={viewDate} onChange={e => setViewDate(e.target.value)} style={{ maxWidth: 200 }} />
        </div>

        {allProducts.length === 0 ? (
          <div className="empty-state card">
            <div className="card-body">
              <div className="empty-icon">🥧</div>
              <div className="empty-title">No production data</div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Log production to track output.</div>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {allProducts.map(name => {
              const produced = prodMap[name] || 0;
              const sold     = soldMap[name] || 0;
              const unsold   = Math.max(0, produced - sold);
              return (
                <div key={name} className="card">
                  <div className="card-body">
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 10 }}>{name}</div>
                    <div className="grid-3">
                      <div style={{ background: "var(--g50)",  borderRadius: 8, padding: 10, textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: "var(--tx3)",  fontWeight: 600 }}>Produced</div>
                        <div style={{ fontWeight: 800, fontSize: 20, color: "var(--g700)"  }}>{produced}</div>
                      </div>
                      <div style={{ background: "var(--y100)", borderRadius: 8, padding: 10, textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: "#b45309",    fontWeight: 600 }}>Sold</div>
                        <div style={{ fontWeight: 800, fontSize: 20, color: "#b45309"    }}>{sold}</div>
                      </div>
                      <div style={{ background: "var(--r100)", borderRadius: 8, padding: 10, textAlign: "center" }}>
                        <div style={{ fontSize: 11, color: "var(--r500)", fontWeight: 600 }}>Unsold</div>
                        <div style={{ fontWeight: 800, fontSize: 20, color: "var(--r500)" }}>{unsold}</div>
                      </div>
                    </div>
                    {produced > 0 && (
                      <div style={{ marginTop: 10 }}>
                        <div className="prog-bar">
                          <div className="prog-fill yellow" style={{ width: `${pct(sold, produced)}%` }} />
                        </div>
                        <div style={{ fontSize: 11, color: "var(--tx3)", marginTop: 4, textAlign: "right" }}>
                          {pct(sold, produced)}% sell-through
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Log production modal ── */}
      <Modal open={showForm} onClose={() => setShowForm(false)} title="🏭 Log Production">
        <div className="field mb-2">
          <label className="label">Product *</label>
          <select
            className={`input select ${errors.product ? "input-error" : ""}`}
            value={form.product}
            onChange={e => { setForm(f => ({ ...f, product: e.target.value })); setErrors({}); }}
          >
            <option value="">Select product...</option>
            {state.products.filter(p => p.type === "manufactured").map(p => (
              <option key={p.id} value={p.name}>{p.name}</option>
            ))}
          </select>
        </div>
        <div className="field mb-3">
          <label className="label">Quantity Produced *</label>
          <input
            className={`input ${errors.qty ? "input-error" : ""}`}
            type="number" min="1"
            value={form.qty_produced}
            onChange={e => { setForm(f => ({ ...f, qty_produced: e.target.value })); setErrors({}); }}
            placeholder="0"
          />
        </div>
        <div className="row gap-2">
          <button className="btn btn-ghost btn-full" onClick={() => setShowForm(false)}>Cancel</button>
          <button className="btn btn-primary btn-full" onClick={handleSave} disabled={saving}>
            {saving ? <Spinner /> : "Log Production"}
          </button>
        </div>
      </Modal>
    </div>
  );
}