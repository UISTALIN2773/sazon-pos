// ══════════════════════════════════════════════════════════════════════
// SazónPOS — History Page
// ══════════════════════════════════════════════════════════════════════

const HistoryPage = ({ ventas }) => {
  const [filter, setFilter] = React.useState("all");
  const filtered = React.useMemo(() => {
    if (filter === "all") return ventas;
    return ventas.filter(v => v.method === filter);
  }, [ventas, filter]);

  return (
    <div className="page-container animate-fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Historial de Ventas</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>{ventas.length} transacciones</p>
        </div>
        <div className="segmented">
          {[{ id: "all", label: "Todas" }, { id: "Efectivo", label: "Efectivo" }, { id: "Plin", label: "Plin" }, { id: "Yape", label: "Yape" }].map(f => (
            <button key={f.id} onClick={() => setFilter(f.id)}
              className={`segmented-item ${filter === f.id ? "active" : ""}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 64, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, background: "var(--bg-slate-50)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Icons.receipt size={28} style={{ color: "var(--text-faint)" }} />
          </div>
          <p style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Sin ventas registradas</p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>Las transacciones aparecerán aquí</p>
        </div>
      ) : (
        <div className="card">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Hora</th>
                <th>Tipo</th>
                <th>Items</th>
                <th>Método</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id}>
                  <td className="mono" style={{ color: "var(--text-muted)", fontWeight: 500 }}>#{String(v.id).slice(-6)}</td>
                  <td className="mono" style={{ fontWeight: 500, color: "var(--text-secondary)" }}>{v.time}</td>
                  <td><span className="badge badge-neutral">{v.type}</span></td>
                  <td style={{ color: "var(--text-secondary)" }}>{v.items.reduce((s, i) => s + i.qty, 0)} items</td>
                  <td>
                    <span className={`badge ${v.method === "Efectivo" ? "badge-success" : v.method === "Plin" ? "badge-info" : "badge-warning"}`}>
                      {v.method}
                    </span>
                  </td>
                  <td className="text-right mono" style={{ fontWeight: 700, color: "var(--text-primary)" }}>{money(v.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};