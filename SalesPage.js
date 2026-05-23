// ═══════════════════════════════════════════════════════════════
// pages/SalesPage.js
// ═══════════════════════════════════════════════════════════════

function SalesPage({ navigate, user, pendingCount }) {
  const { state, addSale } = React.useContext(AppCtx);
  const toast = React.useContext(ToastCtx);

  const EMPTY_LINE = { product: "", qty: 1, price: "", discountPct: 0 };
  const [lines,       setLines]       = React.useState([{ ...EMPTY_LINE }]);
  const [cashAmt,     setCashAmt]     = React.useState("");
  const [gcashAmt,    setGcashAmt]    = React.useState("");
  const [saving,      setSaving]      = React.useState(false);
  const [errors,      setErrors]      = React.useState({});
  const [showHistory, setShowHistory] = React.useState(false);
  const [savedAnim,   setSavedAnim]   = React.useState(false);

  // ── Line management ──────────────────────────────────────────
  const updateLine = (i, field, val) => {
    const copy = [...lines];
    copy[i] = { ...copy[i], [field]: val };
    setLines(copy);
    setErrors({});
  };
  const addLine    = ()  => setLines([...lines, { ...EMPTY_LINE }]);
  const removeLine = (i) => { if (lines.length > 1) setLines(lines.filter((_, x) => x !== i)); };

  // ── Revenue calc ─────────────────────────────────────────────
  const lineRevenue = (l) => {
    if (!l.qty || !l.price) return 0;
    return calcLineRev(+l.qty, +l.price, +l.discountPct || 0);
  };
  const totalRevenue = lines.reduce((s, l) => s + lineRevenue(l), 0);
  const totalPayment = (+cashAmt || 0) + (+gcashAmt || 0);
  const change       = totalPayment - totalRevenue;

  // ── Validation ───────────────────────────────────────────────
  const validate = () => {
    const e = {};
    lines.forEach((l, i) => {
      if (!l.product)              e[`product_${i}`] = true;
      if (!l.price || +l.price <= 0) e[`price_${i}`] = true;
      if (!l.qty   || +l.qty   <= 0) e[`qty_${i}`]   = true;
    });
    if (totalPayment < totalRevenue) e.payment = true;
    return e;
  };

  // ── Save ─────────────────────────────────────────────────────
  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); toast("Please fix the errors.", "err"); return; }

    setSaving(true);
    const recPct = state.recovery.percentage;
    const sale = {
      id:             genId(),
      date:           todayS(),
      timestamp:      nowISO(),
      created_by:     user.name,
      lines:          lines.map(l => ({
        product:     l.product,
        qty:         +l.qty,
        price:       +l.price,
        discountPct: +l.discountPct || 0,
        revenue:     lineRevenue(l),
      })),
      revenue:         totalRevenue,
      cash_amount:     +cashAmt  || 0,
      gcash_amount:    +gcashAmt || 0,
      recovery_pct:    recPct,
      recovery_amount: totalRevenue * (recPct / 100),
    };

    await addSale(sale, state.products);
    setSaving(false);
    setSavedAnim(true);
    setTimeout(() => setSavedAnim(false), 1500);
    toast(`Saved! ${peso(totalRevenue)} recorded. 🎉`);
    setLines([{ ...EMPTY_LINE }]);
    setCashAmt("");
    setGcashAmt("");
  };

  const todaySales   = state.sales.filter(s => s.date === todayS());
  const todayRevenue = todaySales.reduce((s, x) => s + (x.revenue || 0), 0);

  return (
    <div className="page">
      <PageHeader
        title="🛒 Sales"
        sub={`Today: ${peso(todayRevenue)}`}
        navigate={navigate}
        showLogout
        user={user}
        pendingCount={pendingCount}
        action={
          <button className="btn btn-sm" style={{ background: "var(--g50)", color: "var(--g700)", padding: "8px 10px" }} onClick={() => setShowHistory(true)}>
            History
          </button>
        }
      />

      <div className="page-body">
        <div style={{ fontSize: 13, color: "var(--tx3)", fontWeight: 600, marginBottom: 12 }}>
          📅 {fullD(todayS())}
        </div>

        {/* ── Line items ── */}
        {lines.map((l, i) => (
          <div key={i} className="card mb-3 anim-fade" style={{ animationDelay: `${i * 0.05}s` }}>
            <div className="card-body">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontWeight: 700, fontSize: 14, color: "var(--g700)" }}>Item #{i + 1}</span>
                {lines.length > 1 && (
                  <button className="btn btn-sm btn-danger" style={{ padding: "4px 8px", borderRadius: 8 }} onClick={() => removeLine(i)}>
                    <Icon name="trash" size={14} />
                  </button>
                )}
              </div>

              <div className="field mb-2">
                <label className="label">Product</label>
                <select
                  className={`input select ${errors[`product_${i}`] ? "input-error" : ""}`}
                  value={l.product}
                  onChange={e => updateLine(i, "product", e.target.value)}
                >
                  <option value="">Select product...</option>
                  {state.products.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                </select>
              </div>

              <div className="row gap-2 mb-2">
                <div className="field">
                  <label className="label">Qty</label>
                  <input
                    className={`input ${errors[`qty_${i}`] ? "input-error" : ""}`}
                    type="number" min="1"
                    value={l.qty}
                    onChange={e => updateLine(i, "qty", e.target.value)}
                    placeholder="1"
                  />
                </div>
                <div className="field">
                  <label className="label">Price (₱)</label>
                  <input
                    className={`input ${errors[`price_${i}`] ? "input-error" : ""}`}
                    type="number" min="0" step="0.01"
                    value={l.price}
                    onChange={e => updateLine(i, "price", e.target.value)}
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="field">
                <label className="label">Discount %</label>
                <input
                  className="input" type="number" min="0" max="100"
                  value={l.discountPct}
                  onChange={e => updateLine(i, "discountPct", e.target.value)}
                  placeholder="0"
                />
              </div>

              {l.qty && l.price && (
                <div style={{ marginTop: 10, background: "var(--g50)", borderRadius: 8, padding: "8px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, color: "var(--tx2)" }}>Line total</span>
                  <span style={{ fontWeight: 800, color: "var(--g700)", fontSize: 16 }}>{peso(lineRevenue(l))}</span>
                </div>
              )}
            </div>
          </div>
        ))}

        <button className="btn btn-ghost btn-full mb-3" onClick={addLine}>
          <Icon name="plus" size={16} /> Add Another Item
        </button>

        {/* ── Payment ── */}
        <div className="card mb-3">
          <div className="card-body">
            <div style={{ fontWeight: 700, fontSize: 15, color: "var(--g900)", marginBottom: 12 }}>💳 Payment</div>
            <div className="row gap-2 mb-2">
              <div className="field">
                <label className="label">Cash (₱)</label>
                <input className="input" type="number" min="0" step="0.01" value={cashAmt} onChange={e => setCashAmt(e.target.value)} placeholder="0.00" />
              </div>
              <div className="field">
                <label className="label">GCash (₱)</label>
                <input className="input" type="number" min="0" step="0.01" value={gcashAmt} onChange={e => setGcashAmt(e.target.value)} placeholder="0.00" />
              </div>
            </div>

            {errors.payment && (
              <div style={{ color: "var(--r500)", fontSize: 13, marginBottom: 8, display: "flex", gap: 5 }}>
                <Icon name="warn" size={13} /> Payment is less than total.
              </div>
            )}

            <div style={{ background: "var(--g50)", borderRadius: 10, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 14, color: "var(--tx2)" }}>Total Revenue</span>
                <span style={{ fontWeight: 800, fontSize: 18, color: "var(--g700)" }}>{peso(totalRevenue)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 14, color: "var(--tx2)" }}>Total Payment</span>
                <span style={{ fontWeight: 700, fontSize: 15 }}>{peso(totalPayment)}</span>
              </div>
              {totalPayment >= totalRevenue && totalRevenue > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ fontSize: 14, color: "var(--tx2)" }}>Change</span>
                  <span style={{ fontWeight: 700, fontSize: 15, color: change >= 0 ? "var(--g700)" : "var(--r500)" }}>
                    {peso(change)}
                  </span>
                </div>
              )}
              <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--g200)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontSize: 12, color: "var(--tx3)" }}>Recovery ({state.recovery.percentage}%)</span>
                <span style={{ fontSize: 12, color: "var(--tx3)" }}>{peso(totalRevenue * (state.recovery.percentage / 100))}</span>
              </div>
            </div>
          </div>
        </div>

        <button
          className={`btn btn-primary btn-full btn-lg ${savedAnim ? "anim-pop" : ""}`}
          onClick={handleSave}
          disabled={saving || totalRevenue === 0}
        >
          {saving ? <><Spinner /> Saving...</> : <><Icon name="check" size={18} /> Save Transaction</>}
        </button>
      </div>

      {/* ── History modal ── */}
      <Modal open={showHistory} onClose={() => setShowHistory(false)} title="📜 Sales History">
        <div style={{ maxHeight: "50vh", overflowY: "auto" }}>
          {todaySales.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🧾</div>
              <div className="empty-title">No sales today</div>
            </div>
          ) : (
            [...todaySales].reverse().map(s => (
              <div key={s.id} className="list-item">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{s.lines.map(l => `${l.qty}× ${l.product}`).join(", ")}</div>
                    <div style={{ fontSize: 12, color: "var(--tx3)", marginTop: 2 }}>
                      {new Date(s.timestamp).toLocaleTimeString("en-PH", { hour: "2-digit", minute: "2-digit" })} · By {s.created_by}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 800, color: "var(--g700)" }}>{peso(s.revenue)}</div>
                    <div style={{ fontSize: 11, color: "var(--tx3)" }}>
                      {s.cash_amount  > 0 ? `₱${s.cash_amount} cash`  : ""}
                      {s.gcash_amount > 0 ? ` GCash ₱${s.gcash_amount}` : ""}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <button className="btn btn-ghost btn-full mt-3" onClick={() => setShowHistory(false)}>Close</button>
      </Modal>
    </div>
  );
}