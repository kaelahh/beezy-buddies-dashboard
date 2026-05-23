// ═══════════════════════════════════════════════════════════════
// pages/LoginPage.js
// ═══════════════════════════════════════════════════════════════

function LoginPage({ navigate }) {
  const { login } = React.useContext(AuthCtx);
  const [email,   setEmail]   = React.useState("admin@beezybuddies.ph");
  const [pass,    setPass]    = React.useState("");
  const [err,     setErr]     = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const handleLogin = async () => {
    if (!email || !pass) { setErr("Fill in all fields."); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 400)); // brief UX delay
    const user = login(email, pass);
    if (!user) { setErr("Invalid email or password."); setLoading(false); return; }
    window.location.hash = user.role === "cashier" ? "/sales" : "/dashboard";
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, var(--g800) 0%, var(--g600) 60%, var(--y400) 160%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div style={{ width: "100%", maxWidth: 360 }}>

        {/* ── Logo ── */}
        <div className="text-center" style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 64, lineHeight: 1 }}>🐝</div>
          <h1 className="display" style={{ color: "#fff", fontSize: 30, fontWeight: 800, marginTop: 12, lineHeight: 1.1 }}>
            Beezy Buddies
          </h1>
          <div style={{ color: "rgba(255,255,255,.75)", fontSize: 14, marginTop: 4, fontWeight: 500 }}>
            Buko Pie atbp • POS & Tracker
          </div>
        </div>

        {/* ── Card ── */}
        <div className="card anim-pop" style={{ padding: 24 }}>
          <div style={{ marginBottom: 20, textAlign: "center" }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: "var(--g900)" }}>Welcome back!</div>
            <div style={{ fontSize: 13, color: "var(--tx3)", marginTop: 2 }}>Sign in to continue</div>
          </div>

          <div className="field mb-3">
            <label className="label">Email</label>
            <input
              className="input" type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setErr(""); }}
              placeholder="you@beezybuddies.ph"
            />
          </div>

          <div className="field mb-3">
            <label className="label">Password</label>
            <input
              className="input" type="password"
              value={pass}
              onChange={e => { setPass(e.target.value); setErr(""); }}
              placeholder="••••••••"
              onKeyDown={e => e.key === "Enter" && handleLogin()}
            />
          </div>

          {err && (
            <div style={{ color: "var(--r500)", fontSize: 13, marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
              <Icon name="warn" size={14} />{err}
            </div>
          )}

          <button className="btn btn-primary btn-full btn-lg" onClick={handleLogin} disabled={loading}>
            {loading ? <Spinner /> : "Sign In"}
          </button>

          {/* Demo credentials hint */}
          <div style={{ marginTop: 20, background: "var(--g50)", borderRadius: 10, padding: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--tx2)", textTransform: "uppercase", letterSpacing: ".04em", marginBottom: 6 }}>
              Demo Credentials
            </div>
            <div style={{ fontSize: 12, color: "var(--tx2)" }}>
              <div>👑 Admin: admin@beezybuddies.ph / admin2024!</div>
              <div style={{ marginTop: 3 }}>🛒 Cashier: cashier@beezybuddies.ph / cashier2024</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}