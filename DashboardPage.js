// ═══════════════════════════════════════════════════════════════
// pages/DashboardPage.js
// ═══════════════════════════════════════════════════════════════

function DashboardPage({ navigate, user, pendingCount }) {
  const { state } = React.useContext(AppCtx);
  const [period, setPeriod] = React.useState("today");

  const now       = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const thisYear  = `${now.getFullYear()}`;

  // ── Filter helpers ──────────────────────────────────────────
  const byPeriod = (date) => {
    if (period === "today") return date === todayS();
    if (period === "month") return date.startsWith(thisMonth);
    if (period === "year")  return date.startsWith(thisYear);
    return true; // "all"
  };

  const sales    = state.sales.filter(s => byPeriod(s.date));
  const expenses = state.expenses.filter(e => byPeriod(e.date));

  // ── KPIs ─────────────────────────────────────────────────────
  const revenue    = sales.reduce((s, x) => s + (x.revenue || 0), 0);
  const expTotal   = expenses.reduce((s, e) => s + (+e.amount || 0), 0);
  const netIncome  = revenue - expTotal;
  const unitsSold  = sales.reduce((s, x) => s + x.lines.reduce((a, l) => a + l.qty, 0), 0);
  const cashSales  = sales.reduce((s, x) => s + (+x.cash_amount  || 0), 0);
  const gcashSales = sales.reduce((s, x) => s + (+x.gcash_amount || 0), 0);

  // ── Product breakdown ─────────────────────────────────────
  const productMap = {};
  sales.forEach(s => s.lines.forEach(l => {
    if (!productMap[l.product]) productMap[l.product] = { qty: 0, revenue: 0 };
    productMap[l.product].qty     += l.qty;
    productMap[l.product].revenue += l.revenue || 0;
  }));
  const topProducts = Object.entries(productMap).sort((a, b) => b[1].revenue - a[1].revenue).slice(0, 5);

  // ── Expense category breakdown ────────────────────────────
  const catMap = {};
  expenses.forEach(e => { catMap[e.category] = (catMap[e.category] || 0) + (+e.amount || 0); });
  const topCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 4);

  return (
    <div className="page">
      <PageHeader
        title="📊 Dashboard"
        sub={`Hello, ${user.name}!`}
        navigate={navigate}
        user={user}
        pendingCount={pendingCount}
        showLogout
      />
      <div className="page-body">

        {/* ── Period selector ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          {[["today", "Today"], ["month", "This Month"], ["year", "This Year"], ["all", "All Time"]].map(([v, l]) => (
            <button
              key={v}
              className={`chip ${period === v ? "active" : ""}`}
              style={{ flex: 1, justifyContent: "center", fontSize: 12, padding: "6px 8px" }}
              onClick={() => setPeriod(v)}
            >
              {l}
            </button>
          ))}
        </div>

        {/* ── KPI cards ── */}
        <div className="grid-2 mb-3">
          <div className="stat-card">
            <div className="stat-lbl">Revenue</div>
            <div className="stat-val" style={{ fontSize: 22 }}>{peso(revenue)}</div>
          </div>
          <div className="stat-card" style={{ background: "var(--r500)" }}>
            <div className="stat-lbl">Expenses</div>
            <div className="stat-val" style={{ fontSize: 22 }}>{peso(expTotal)}</div>
          </div>
        </div>
        <div className="grid-2 mb-3">
          <div className="stat-card yellow">
            <div className="stat-lbl" style={{ color: "rgba(0,0,0,.6)" }}>Net Income</div>
            <div className="stat-val" style={{ fontSize: 22, color: netIncome >= 0 ? "var(--g900)" : "var(--r500)" }}>
              {peso(netIncome)}
            </div>
          </div>
          <div className="stat-card light">
            <div className="stat-lbl">Units Sold</div>
            <div className="stat-val">{unitsSold}</div>
          </div>
        </div>

        {/* ── Payment split ── */}
        <div className="card mb-3">
          <div className="card-body">
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>💳 Payment Split</div>
            <div className="row gap-2">
              <div style={{ flex: 1, background: "var(--g50)", borderRadius: 10, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "var(--tx3)", fontWeight: 600 }}>Cash</div>
                <div style={{ fontWeight: 800, fontSize: 16, color: "var(--g700)" }}>{peso(cashSales)}</div>
                <div style={{ fontSize: 11, color: "var(--tx3)" }}>{revenue > 0 ? `${Math.round(cashSales / revenue * 100)}%` : "—"}</div>
              </div>
              <div style={{ flex: 1, background: "var(--y100)", borderRadius: 10, padding: 12, textAlign: "center" }}>
                <div style={{ fontSize: 11, color: "#b45309", fontWeight: 600 }}>GCash</div>
                <div style={{ fontWeight: 800, fontSize: 16, color: "#b45309" }}>{peso(gcashSales)}</div>
                <div style={{ fontSize: 11, color: "#b45309" }}>{revenue > 0 ? `${Math.round(gcashSales / revenue * 100)}%` : "—"}</div>
              </div>
            </div>
            {revenue > 0 && (
              <div style={{ marginTop: 10 }}>
                <div className="prog-bar" style={{ height: 10 }}>
                  <div className="prog-fill" style={{ width: `${pct(cashSales, revenue)}%`, background: "var(--g500)" }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Top Products ── */}
        {topProducts.length > 0 && (
          <div className="card mb-3">
            <div className="card-body">
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>🧁 Top Products</div>
              {topProducts.map(([name, d]) => (
                <div key={name} style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--tx1)" }}>{name}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--g700)" }}>{peso(d.revenue)}</span>
                  </div>
                  <div className="prog-bar">
                    <div className="prog-fill" style={{ width: `${pct(d.revenue, revenue)}%` }} />
                  </div>
                  <div style={{ fontSize: 11, color: "var(--tx3)", marginTop: 3 }}>{d.qty} units sold</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Expense breakdown ── */}
        {topCats.length > 0 && (
          <div className="card mb-3">
            <div className="card-body">
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>📋 Expense Breakdown</div>
              {topCats.map(([cat, amt]) => (
                <div key={cat} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontSize: 13, color: "var(--tx2)" }}>{cat}</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--r500)" }}>{peso(amt)}</span>
                    <span style={{ fontSize: 11, color: "var(--tx3)" }}>{expTotal > 0 ? `${Math.round(amt / expTotal * 100)}%` : "—"}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Cost Recovery progress ── */}
        <div className="card mb-3">
          <div className="card-body">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontWeight: 700, fontSize: 14 }}>🔄 Cost Recovery</div>
              <span className="badge badge-green">{state.recovery.percentage}% per sale</span>
            </div>
            {[["boxes", "📦"], ["vehicle", "🚐"]].map(([key, emoji]) => {
              const item = state.recovery[key];
              const p    = pct(item.recovered, item.total);
              return (
                <div key={key} style={{ marginBottom: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{emoji} {item.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "var(--g700)" }}>{p}%</span>
                  </div>
                  <div className="prog-bar" style={{ height: 10 }}>
                    <div className="prog-fill yellow" style={{ width: `${p}%` }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
                    <span style={{ fontSize: 11, color: "var(--tx3)" }}>{peso(item.recovered)} recovered</span>
                    <span style={{ fontSize: 11, color: "var(--tx3)" }}>{peso(item.total - item.recovered)} remaining</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Recent transactions ── */}
        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 8 }}>🕐 Recent Transactions</div>
        <div className="card">
          {sales.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <div className="empty-title">No data for this period</div>
            </div>
          ) : (
            [...sales].reverse().slice(0, 8).map(s => (
              <div key={s.id} className="list-item">
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>
                      {s.lines.map(l => `${l.qty}×${l.product}`).join(", ").slice(0, 40)}
                      {s.lines.length > 1 ? "..." : ""}
                    </div>
                    <div style={{ fontSize: 11, color: "var(--tx3)", marginTop: 2 }}>{shortD(s.date)} · {s.created_by}</div>
                  </div>
                  <div style={{ fontWeight: 800, color: "var(--g700)", fontSize: 14 }}>{peso(s.revenue)}</div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}