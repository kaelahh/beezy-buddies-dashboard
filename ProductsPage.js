// ═══════════════════════════════════════════════════════════════
// pages/ProductsPage.js
// ═══════════════════════════════════════════════════════════════

const TYPE_META = {
  manufactured: { label: "Manufactured", badge: "badge-green",  emoji: "🏭" },
  resale:       { label: "Resale",        badge: "badge-yellow", emoji: "🛒" },
  custom:       { label: "Custom",        badge: "badge-gray",   emoji: "✏️" },
};

function ProductsPage({ navigate, user, pendingCount }) {
  const { state, dispatch } = React.useContext(AppCtx);
  const toast = React.useContext(ToastCtx);

  const BLANK = { name: "", type: "manufactured" };
  const [showForm,      setShowForm]      = React.useState(false);
  const [editing,       setEditing]       = React.useState(null);
  const [form,          setForm]          = React.useState(BLANK);
  const [deleteTarget,  setDeleteTarget]  = React.useState(null);
  const [filterType,    setFilterType]    = React.useState("all");

  const openAdd  = ()  => { setEditing(null); setForm(BLANK); setShowForm(true); };
  const openEdit = (p) => { setEditing(p); setForm({ name: p.name, type: p.type }); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(BLANK); };

  const handleSave = () => {
    if (!form.name.trim()) { toast("Enter a product name.", "err"); return; }
    if (editing) {
      dispatch({ type: "EDIT_PRODUCT", payload: { ...editing, name: form.name.trim(), type: form.type } });
      toast("Product updated! ✅");
    } else {
      const duplicate = state.products.some(p => p.name.toLowerCase() === form.name.trim().toLowerCase());
      if (duplicate) { toast("A product with that name already exists.", "err"); return; }
      dispatch({ type: "ADD_PRODUCT", payload: { id: genId(), name: form.name.trim(), type: form.type } });
      toast("Product added! 🧁");
    }
    closeForm();
  };

  const handleDelete = (id) => {
    dispatch({ type: "DEL_PRODUCT", payload: id });
    toast("Product removed.");
    setDeleteTarget(null);
  };

  const shown = filterType === "all"
    ? state.products
    : state.products.filter(p => p.type === filterType);

  return (
    <div className="page">
      <PageHeader
        title="🧁 Products"
        sub={`${state.products.length} product${state.products.length !== 1 ? "s" : ""}`}
        navigate={navigate}
        user={user}
        pendingCount={pendingCount}
        action={
          <button className="btn btn-primary btn-sm" onClick={openAdd}>
            <Icon name="plus" size={14} /> Add
          </button>
        }
      />

      <div className="page-body">

        {/* ── Filter chips ── */}
        <div style={{ display: "flex", gap: 8, marginBottom: 16, overflowX: "auto", paddingBottom: 2 }}>
          {[["all", "All"], ["manufactured", "Manufactured"], ["resale", "Resale"], ["custom", "Custom"]].map(([v, l]) => (
            <button
              key={v}
              className={`chip ${filterType === v ? "active" : ""}`}
              style={{ whiteSpace: "nowrap" }}
              onClick={() => setFilterType(v)}
            >
              {l}
            </button>
          ))}
        </div>

        {/* ── Product list ── */}
        {shown.length === 0 ? (
          <div className="empty-state card">
            <div className="card-body">
              <div className="empty-icon">🧁</div>
              <div className="empty-title">
                {filterType === "all" ? "No products yet" : "No products in this category"}
              </div>
              <div style={{ fontSize: 13, marginTop: 4 }}>Tap <strong>+ Add</strong> to create your first product.</div>
            </div>
          </div>
        ) : (
          <div className="card anim-fade">
            {shown.map(p => {
              const meta = TYPE_META[p.type] || TYPE_META.custom;
              return (
                <div key={p.id} className="list-item" style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ fontSize: 24, lineHeight: 1, flexShrink: 0 }}>{meta.emoji}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.name}
                    </div>
                    <span className={`badge ${meta.badge}`} style={{ marginTop: 4 }}>{meta.label}</span>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button className="btn btn-ghost btn-sm" style={{ padding: "7px 10px" }} onClick={() => openEdit(p)}>
                      ✏️
                    </button>
                    <button
                      className="btn btn-sm"
                      style={{ padding: "7px 10px", background: "var(--r100)", color: "var(--r500)", border: "none" }}
                      onClick={() => setDeleteTarget(p.id)}
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Type count summary ── */}
        {state.products.length > 0 && (
          <div className="grid-3 mt-4">
            {Object.entries(TYPE_META).map(([k, meta]) => {
              const count = state.products.filter(p => p.type === k).length;
              return (
                <div key={k} style={{ background: "var(--g50)", borderRadius: 10, padding: 10, textAlign: "center" }}>
                  <div style={{ fontSize: 18 }}>{meta.emoji}</div>
                  <div style={{ fontWeight: 800, fontSize: 20, color: "var(--g700)" }}>{count}</div>
                  <div style={{ fontSize: 11, color: "var(--tx3)", fontWeight: 600 }}>{meta.label}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Add / Edit Modal ── */}
      <Modal open={showForm} onClose={closeForm} title={editing ? "✏️ Edit Product" : "🧁 Add Product"}>
        <div className="field mb-2">
          <label className="label">Product Name *</label>
          <input
            className="input" autoFocus
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="e.g. Buko Pie Special"
            onKeyDown={e => e.key === "Enter" && handleSave()}
          />
        </div>
        <div className="field mb-4">
          <label className="label">Type</label>
          <select className="input select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
            <option value="manufactured">🏭 Manufactured (has recipe)</option>
            <option value="resale">🛒 Resale (fixed cost)</option>
            <option value="custom">✏️ Custom (manual costing)</option>
          </select>
        </div>
        <div className="row gap-2">
          <button className="btn btn-ghost btn-full" onClick={closeForm}>Cancel</button>
          <button className="btn btn-primary btn-full" onClick={handleSave}>
            {editing ? "Save Changes" : "Add Product"}
          </button>
        </div>
      </Modal>

      {/* ── Delete confirm ── */}
      <ConfirmModal
        open={!!deleteTarget}
        msg={`Remove "${state.products.find(p => p.id === deleteTarget)?.name}"? This won't affect existing sales records.`}
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}