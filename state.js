// ═══════════════════════════════════════════════════════════════
// state.js — React contexts: Auth, App state, Toast
// ═══════════════════════════════════════════════════════════════
const { useState, useEffect, useContext, useReducer, createContext } = React;

// ─── Auth Context ────────────────────────────────────────────
const AuthCtx = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(() => LS.get("bb_user", null));

  const login = (email, password) => {
    const found = USERS.find(u => u.email === email && u.password === password);
    if (!found) return null;
    const session = { id: found.id, email: found.email, role: found.role, name: found.name };
    LS.set("bb_user", session);
    setUser(session);
    return session;
  };

  const logout = () => {
    LS.set("bb_user", null);
    setUser(null);
  };

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  );
}

// ─── App Reducer ─────────────────────────────────────────────
const INIT = {
  sales:       LS.get("bb_sales",      []),
  expenses:    LS.get("bb_expenses",   []),
  production:  LS.get("bb_production", []),
  products:    LS.get("bb_products",   DEFAULT_PRODUCTS),
  recovery:    LS.get("bb_recovery",   RECOVERY_DEFAULT),
  pendingSync: LS.get("bb_pending",    []),
};

function appReducer(state, action) {
  switch (action.type) {

    case "ADD_SALE": {
      const sales = [...state.sales, action.payload];
      LS.set("bb_sales", sales);
      // Apply cost recovery proportionally
      const rv     = action.payload.revenue || 0;
      const recAmt = rv * (state.recovery.percentage / 100);
      const budget = state.recovery.boxes.total + state.recovery.vehicle.total;
      const boxShare = budget === 0 ? 0.5 : state.recovery.boxes.total / budget;
      const recovery = {
        ...state.recovery,
        boxes: {
          ...state.recovery.boxes,
          recovered: Math.min(state.recovery.boxes.total, state.recovery.boxes.recovered + recAmt * boxShare),
        },
        vehicle: {
          ...state.recovery.vehicle,
          recovered: Math.min(state.recovery.vehicle.total, state.recovery.vehicle.recovered + recAmt * (1 - boxShare)),
        },
      };
      LS.set("bb_recovery", recovery);
      return { ...state, sales, recovery };
    }

    case "ADD_EXPENSE": {
      const expenses = [...state.expenses, action.payload];
      LS.set("bb_expenses", expenses);
      return { ...state, expenses };
    }

    case "ADD_PRODUCTION": {
      const production = [...state.production, action.payload];
      LS.set("bb_production", production);
      return { ...state, production };
    }

    case "SET_RECOVERY": {
      LS.set("bb_recovery", action.payload);
      return { ...state, recovery: action.payload };
    }

    case "ADD_PRODUCT": {
      const products = [...state.products, action.payload];
      LS.set("bb_products", products);
      return { ...state, products };
    }

    case "EDIT_PRODUCT": {
      const products = state.products.map(p => p.id === action.payload.id ? action.payload : p);
      LS.set("bb_products", products);
      return { ...state, products };
    }

    case "DEL_PRODUCT": {
      const products = state.products.filter(p => p.id !== action.payload);
      LS.set("bb_products", products);
      return { ...state, products };
    }

    case "ADD_PENDING": {
      const pendingSync = [...state.pendingSync, action.payload];
      LS.set("bb_pending", pendingSync);
      return { ...state, pendingSync };
    }

    case "SET_PENDING": {
      LS.set("bb_pending", action.payload);
      return { ...state, pendingSync: action.payload };
    }

    default:
      return state;
  }
}

// ─── App Context ─────────────────────────────────────────────
const AppCtx = createContext(null);

function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, INIT);

  // Auto-sync queued records when network comes back
  useEffect(() => {
    const sync = () => {
      if (state.pendingSync.length > 0 && navigator.onLine) {
        sheetsAPI.syncQueue(state.pendingSync, remaining =>
          dispatch({ type: "SET_PENDING", payload: remaining })
        );
      }
    };
    window.addEventListener("online", sync);
    sync();
    return () => window.removeEventListener("online", sync);
  }, []);

  // Queue helper: try Sheets; fall back to pending queue on failure
  const queue = async (action, payload) => {
    const ok = await sheetsAPI.send(action, payload);
    if (!ok) dispatch({ type: "ADD_PENDING", payload: { action, payload } });
  };

  const addSale = async (sale, products) => {
    dispatch({ type: "ADD_SALE", payload: sale });
    const enriched = {
      ...sale,
      lines: sale.lines.map(l => ({
        ...l,
        type: (products || []).find(p => p.name === l.product)?.type || "",
      })),
    };
    await queue("appendSale", enriched);
  };

  const addExpense = async (exp) => {
    dispatch({ type: "ADD_EXPENSE", payload: exp });
    await queue("appendExpense", exp);
  };

  const addProduction = async (prod) => {
    dispatch({ type: "ADD_PRODUCTION", payload: prod });
    await queue("appendProduction", prod);
  };

  return (
    <AppCtx.Provider value={{ state, dispatch, addSale, addExpense, addProduction }}>
      {children}
    </AppCtx.Provider>
  );
}

// ─── Toast Context ────────────────────────────────────────────
const ToastCtx = createContext(null);

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const show = (msg, type = "ok") => {
    const id = genId();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 2800);
  };

  return (
    <ToastCtx.Provider value={show}>
      {children}
      <div className="toast-wrap">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}