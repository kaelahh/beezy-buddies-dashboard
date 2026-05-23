// ═══════════════════════════════════════════════════════════════
// components.js — Shared UI components
// ═══════════════════════════════════════════════════════════════

// ─── Icon ─────────────────────────────────────────────────────
function Icon({ name, size = 20 }) {
  const icons = {
    home: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    sales: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="20" height="14" x="2" y="5" rx="2"/>
        <line x1="2" x2="22" y1="10" y2="10"/>
      </svg>
    ),
    cash: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4l3 3"/>
      </svg>
    ),
    expense: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" x2="8" y1="13" y2="13"/>
        <line x1="16" x2="8" y1="17" y2="17"/>
        <line x1="10" x2="8" y1="9"  y2="9"/>
      </svg>
    ),
    prod: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/>
        <path d="m2 17 10 5 10-5"/>
        <path d="m2 12 10 5 10-5"/>
      </svg>
    ),
    inv: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="18" x="3" y="3" rx="2" ry="2"/>
        <line x1="3" x2="21" y1="9" y2="9"/>
        <line x1="9" x2="9" y1="21" y2="9"/>
      </svg>
    ),
    settings: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
        <circle cx="12" cy="12" r="3"/>
      </svg>
    ),
    plus: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <line x1="12" x2="12" y1="5" y2="19"/>
        <line x1="5"  x2="19" y1="12" y2="12"/>
      </svg>
    ),
    trash: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="m19 6-.867 12.142A2 2 0 0 1 16.138 20H7.862a2 2 0 0 1-1.995-1.858L5 6"/>
        <path d="M10 11v6"/>
        <path d="M14 11v6"/>
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
      </svg>
    ),
    logout: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" x2="9" y1="12" y2="12"/>
      </svg>
    ),
    check: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ),
    warn: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3z"/>
        <line x1="12" x2="12"    y1="9"  y2="13"/>
        <line x1="12" x2="12.01" y1="17" y2="17"/>
      </svg>
    ),
    sync: (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
        <path d="M21 3v5h-5"/>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
        <path d="M8 16H3v5"/>
      </svg>
    ),
  };
  return icons[name] || null;
}

// ─── Spinner ──────────────────────────────────────────────────
function Spinner() {
  return (
    <span
      className="anim-spin"
      style={{
        display: "inline-block",
        width: 18, height: 18,
        border: "2.5px solid rgba(255,255,255,.3)",
        borderTopColor: "#fff",
        borderRadius: "50%",
      }}
    />
  );
}

// ─── Modal (bottom sheet) ─────────────────────────────────────
function Modal({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="overlay" onClick={onClose}>
      <div className="sheet anim-slide-up" onClick={e => e.stopPropagation()}>
        <div className="sheet-handle" />
        {title && (
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, fontFamily: "'Baloo 2', cursive" }}>
            {title}
          </h3>
        )}
        {children}
      </div>
    </div>
  );
}

// ─── Confirm Modal ────────────────────────────────────────────
function ConfirmModal({ open, msg, onConfirm, onCancel }) {
  return (
    <Modal open={open} onClose={onCancel} title="Are you sure?">
      <p style={{ color: "var(--tx2)", marginBottom: 20 }}>{msg}</p>
      <div className="row gap-2">
        <button className="btn btn-ghost btn-full" onClick={onCancel}>Cancel</button>
        <button className="btn btn-primary btn-full" onClick={onConfirm}>Confirm</button>
      </div>
    </Modal>
  );
}

// ─── Bottom Navigation ────────────────────────────────────────
function BottomNav({ route, navigate, user }) {
  const cashierTabs = [
    { path: "/sales",      label: "Sales",      icon: "sales" },
    { path: "/cash-count", label: "Cash Count", icon: "cash"  },
  ];
  const adminTabs = [
    { path: "/dashboard",  label: "Dashboard", icon: "home"    },
    { path: "/sales",      label: "Sales",     icon: "sales"   },
    { path: "/expenses",   label: "Expenses",  icon: "expense" },
    { path: "/production", label: "Produce",   icon: "prod"    },
    { path: "/products",   label: "Products",  icon: "inv"     },
  ];
  const tabs = user.role === "cashier" ? cashierTabs : adminTabs;

  return (
    <nav className="bottom-nav">
      {tabs.map(t => (
        <button
          key={t.path}
          className={`nav-item ${route === t.path ? "active" : ""}`}
          onClick={() => navigate(t.path)}
        >
          <Icon name={t.icon} size={22} />
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ─── Page Header ──────────────────────────────────────────────
function PageHeader({ title, sub, action, navigate, showLogout, user, pendingCount }) {
  const { logout } = React.useContext(AuthCtx);

  return (
    <div
      className="page-header"
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}
    >
      <div>
        <div className="page-title display">{title}</div>
        {sub && <div className="page-sub">{sub}</div>}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        {pendingCount > 0 && (
          <span
            title="Pending sync"
            style={{
              background: "var(--y400)", color: "var(--g900)",
              borderRadius: 99, padding: "3px 8px",
              fontSize: 11, fontWeight: 700,
              display: "flex", alignItems: "center", gap: 4,
            }}
          >
            <Icon name="sync" size={12} />{pendingCount}
          </span>
        )}

        {action}

        {showLogout && (
          <button
            className="btn btn-ghost btn-sm"
            style={{ padding: "8px 10px" }}
            onClick={() => { logout(); window.location.hash = "/login"; }}
          >
            <Icon name="logout" size={16} />
          </button>
        )}

        {user?.role === "admin" && (
          <button
            className="btn btn-sm"
            style={{ background: "var(--g50)", color: "var(--g700)", padding: "8px 10px" }}
            onClick={() => navigate("/settings")}
          >
            <Icon name="settings" size={16} />
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Layout (page shell + nav) ────────────────────────────────
function Layout({ children, route, navigate }) {
  const { user }  = React.useContext(AuthCtx);
  const { state } = React.useContext(AppCtx);

  return (
    <div className="page">
      {React.cloneElement(children, {
        navigate,
        user,
        pendingCount: state.pendingSync.length,
      })}
      <BottomNav route={route} navigate={navigate} user={user} />
    </div>
  );
}