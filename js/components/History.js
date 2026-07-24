// ══════════════════════════════════════════════════════════════════════
// SazónPOS — History Page
// ══════════════════════════════════════════════════════════════════════

const HistoryPage = ({ ventas }) => {
  const [filter, setFilter] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [selectedTicket, setSelectedTicket] = React.useState(null);

  const filtered = React.useMemo(() => {
    let result = ventas;
    if (filter !== "all") result = result.filter(v => v.method === filter);
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(v =>
        String(v.id).includes(q) ||
        v.time.includes(q) ||
        v.type.toLowerCase().includes(q) ||
        v.method.toLowerCase().includes(q) ||
        (v.notes && v.notes.toLowerCase().includes(q)) ||
        v.items.some(item => item.name.toLowerCase().includes(q))
      );
    }
    return result;
  }, [ventas, filter, search]);

  return (
    <div className="page-container animate-fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Historial de Ventas</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>{filtered.length} de {ventas.length} transacciones</p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <div className="history-search">
            <Icons.search size={16} className="history-search-icon" />
            <input type="text" placeholder="Buscar por ID, hora, plato..." value={search} onChange={e => setSearch(e.target.value)} />
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
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: 64, textAlign: "center" }}>
          <div style={{ width: 64, height: 64, background: "var(--bg-slate-50)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <Icons.receipt size={28} style={{ color: "var(--text-faint)" }} />
          </div>
          <p style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{search ? "Sin resultados" : "Sin ventas registradas"}</p>
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 4 }}>
            {search ? "Prueba con otro término de búsqueda" : "Las transacciones aparecerán aquí"}
          </p>
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
                <th>Notas</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id} onClick={() => setSelectedTicket(selectedTicket?.id === v.id ? null : v)}
                  style={{ cursor: "pointer", background: selectedTicket?.id === v.id ? "var(--bg-slate-50)" : undefined }}>
                  <td className="mono" style={{ color: "var(--text-muted)", fontWeight: 500 }}>#{String(v.id).slice(-6)}</td>
                  <td className="mono" style={{ fontWeight: 500, color: "var(--text-secondary)" }}>{v.time}</td>
                  <td><span className="badge badge-neutral">{v.type}</span></td>
                  <td style={{ color: "var(--text-secondary)" }}>{v.items.reduce((s, i) => s + i.qty, 0)} items</td>
                  <td>
                    <span className={`badge ${v.method === "Efectivo" ? "badge-success" : v.method === "Plin" ? "badge-info" : "badge-warning"}`}>
                      {v.method}
                    </span>
                  </td>
                  <td style={{ maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12, color: "var(--text-muted)" }}>
                    {v.notes || "—"}
                  </td>
                  <td className="text-right mono" style={{ fontWeight: 700, color: "var(--text-primary)" }}>{money(v.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Ticket Detail */}
      {selectedTicket && (
        <div className="card animate-slide-up" style={{ marginTop: 20, padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: 18, color: "var(--text-primary)" }}>
                Ticket #{String(selectedTicket.id).slice(-6)}
              </h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                {selectedTicket.time} · {selectedTicket.type} · {selectedTicket.method}
              </p>
            </div>
            <button className="btn btn-secondary" onClick={() => setSelectedTicket(null)} style={{ padding: "8px 16px" }}>
              <Icons.x size={14} /> Cerrar
            </button>
          </div>

          <div className="ticket-detail-items">
            {selectedTicket.items.map((item, i) => (
              <div key={i} className="ticket-detail-item">
                <span style={{ fontWeight: 500 }}>{item.qty}x {item.name}</span>
                <span className="mono" style={{ fontWeight: 600 }}>{money(item.price * item.qty)}</span>
              </div>
            ))}
          </div>

          {selectedTicket.notes && (
            <div style={{ background: "#FFFBEB", borderRadius: 12, padding: 12, marginTop: 12, display: "flex", alignItems: "center", gap: 8 }}>
              <Icons.messageSquare size={14} style={{ color: "var(--warning)" }} />
              <span style={{ fontSize: 13, color: "var(--text-secondary)" }}>{selectedTicket.notes}</span>
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 16, borderTop: "2px dashed var(--border-light)" }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: "var(--text-primary)" }}>Total</span>
            <span className="mono" style={{ fontWeight: 700, fontSize: 20, color: "var(--brand)" }}>{money(selectedTicket.total)}</span>
          </div>
        </div>
      )}
    </div>
  );
};