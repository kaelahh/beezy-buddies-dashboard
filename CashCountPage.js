// ═══════════════════════════════════════════════════════════════
// pages/CashCountPage.js
// ═══════════════════════════════════════════════════════════════

function CashCountPage({ navigate, user, pendingCount }) {
  const { state } = React.useContext(AppCtx);
  const [startCash,  setStartCash]  = React.useState("");
  const [actualCash, setActualCash] = React.useState("");

  const todaySales    = state.sales.filter(s => s.date === todayS());
  const todayExpenses = state.expenses.filter(e => e.date === todayS());

  const cashSales    = todaySales.reduce((s, x) => s + (+x.cash_amount || 0), 0);
  const cashExpenses = todayExpenses
    .filter(e => e.payment_method === "Cash")
    .reduce((s, x) => s + (+x.amount || 0), 0);

  const expectedCash = (+startCash || 0) + cashSales - cashExpenses;
  const diff         = (+actualCash || 0) - expectedCash;
  const hasBoth      = actualCash !== "" && startCash !== "";

  const diffColor = diff > 0 ? "#b45309" : diff < 0 ? "var(--r500)" : "var(--g700)";
  const diffLabel = Math.abs(diff) < 1 ? "✅ Balanced" : diff > 0 ? "📈 Overage" : "📉 Shortage";
  const diffBg    = Math.abs(diff) < 1 ? "var(--g50)" : diff > 0 ? "var(--y100)" : "var(--r100)";

  return (
    <div className="page">
      <PageHeader
        title="💵 Cash Count"
        sub="End-of-day reconciliation"
        navigate={navigate}
        showLogout
        user={user}
        pendingCount={pendingCount}
      />
      <div className="page-body">

        {/* ── Inputs ── */}
        <div className="card mb-3">
          <div className="card-body">
            <div style={{ fontWeight: 700, marginBottom: 12, color: "var(--g900)" }}>📅 {fullD(todayS())}</div>
            <div className="field mb-2">
              <label className="label">Starting Cash (₱)</label>
              <input className="input" type="number" min="0" step="0.01" value={startCash} onChange={e => setStartCash(e.target.value)} placeholder="0.00" />
            </div>
            <div className="field">
              <label className="label">Actual Cash on Hand (₱)</label>
              <input className="input" type="number" min="0" step="0.01" value={actualCash} onChange={e => setActualCash(e.target.value)} placeholder="0.00" />
            </div>
          </div>
        </div>

        {/* ── Summary calc ── */}
        <div className="card mb-3">
          <div className="card-body">
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 12, color: "var(--g900)" }}>📊 Today's Summary</div>

            {[
              ["Starting Cash",  peso(+startCash || 0)],
              ["Cash Sales",     peso(cashSales)],
              ["Cash Expenses",  `−${peso(cashExpenses)}`],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>
                <span style={{ fontSize: 14, color: "var(--tx2)" }}>{label}</span>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{value}</span>
              </div>
            ))}

            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 15 }}>Expected Cash</span>
              <span style={{ fontWeight: 800, fontSize: 16, color: "var(--g700)" }}>{peso(expectedCash)}</span>
            </div>

            {hasBoth && (
              <div style={{ marginTop: 8, borderRadius: 12, padding: 14, background: diffBg, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15 }}>{diffLabel}</div>
                  <div style={{ fontSize: 12, color: "var(--tx2)", marginTop: 2 }}>
                    {Math.abs(diff) < 1 ? "Cash matches perfectly!" : `Difference of ${peso(Math.abs(diff))}`}
                  </div>
                </div>
                <div style={{ fontWeight: 800, fontSize: 22, color: diffColor }}>
                  {diff === 0 ? "₱0" : (diff > 0 ? "+" : "") + peso(diff)}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Today breakdown ── */}
        <div className="card">
          <div className="card-body">
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: "var(--g900)" }}>Today's Breakdown</div>
            <div className="grid-2" style={{ gap: 8 }}>
              {[
                ["Transactions",   todaySales.length,                                               false],
                ["Total Revenue",  peso(todaySales.reduce((s, x) => s + (x.revenue || 0), 0)),      false],
                ["Cash Sales",     peso(cashSales),                                                  false],
                ["GCash Sales",    peso(todaySales.reduce((s, x) => s + (+x.gcash_amount || 0), 0)), false],
              ].map(([label, value]) => (
                <div key={label} style={{ background: "var(--g50)", borderRadius: 10, padding: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 12, color: "var(--tx3)", fontWeight: 600 }}>{label}</div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "var(--g700)" }}>{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}