// ══════════════════════════════════════════════════════════════════════
// SazónPOS — Tables Page
// ══════════════════════════════════════════════════════════════════════

const TablesPage = ({ onTableChange }) => {
  const [tables, setTables] = React.useState(TABLES);
  const [selectedTable, setSelectedTable] = React.useState(null);

  const statusLabels = { libre: "Disponible", ocupada: "Ocupada", reservada: "Reservada" };
  const statusActions = {
    libre: { next: "ocupada", label: "Ocupar", icon: "🪑" },
    ocupada: { next: "libre", label: "Liberar", icon: "✅" },
    reservada: { next: "libre", label: "Liberar", icon: "✅" },
  };

  const cycleStatus = (tableId) => {
    setTables(prev => prev.map(t => {
      if (t.id !== tableId) return t;
      const action = statusActions[t.status];
      const newStatus = action.next;
      onTableChange(tableId, newStatus);
      return {
        ...t,
        status: newStatus,
        order: newStatus === "libre" ? 0 : t.order,
      };
    }));
    setSelectedTable(null);
  };

  const selected = tables.find(t => t.id === selectedTable);

  return (
    <div className="page-container animate-fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Gestión de Mesas</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>
            {tables.filter(t => t.status === "libre").length} disponibles · {tables.filter(t => t.status === "ocupada").length} ocupadas · {tables.filter(t => t.status === "reservada").length} reservadas
          </p>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          {["libre", "ocupada", "reservada"].map(s => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "var(--text-muted)" }}>
              <span className={`table-card-dot ${s}`} style={{ width: 8, height: 8 }}></span>
              <span style={{ fontWeight: 500 }}>{statusLabels[s]}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: selectedTable ? 24 : 0 }}>
        {tables.map((table, i) => (
          <button key={table.id}
            className={`table-card ${table.status} animate-fade-up`}
            style={{
              animationDelay: `${i * 0.04}s`,
              outline: selectedTable === table.id ? "2px solid var(--brand)" : "none",
              outlineOffset: 2,
            }}
            onClick={() => setSelectedTable(selectedTable === table.id ? null : table.id)}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <span className="table-card-number">{table.id}</span>
              <span className={`table-card-dot ${table.status}`} style={{ width: 12, height: 12 }}></span>
            </div>
            <div className="table-card-status">{statusLabels[table.status]}</div>
            <div className="table-card-capacity">{table.capacity} personas</div>
            {table.order > 0 && (
              <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(0,0,0,0.06)" }}>
                <span style={{ fontSize: 10, fontWeight: 600, color: "var(--text-muted)", background: "rgba(255,255,255,0.6)", padding: "2px 8px", borderRadius: 6 }}>
                  {table.order} items en curso
                </span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Table Detail Panel */}
      {selected && (
        <div className="card animate-slide-up" style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: 20, color: "var(--text-primary)" }}>Mesa {selected.id}</h3>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>
                {selected.capacity} personas · {statusLabels[selected.status]}
              </p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn btn-primary" onClick={() => cycleStatus(selected.id)}>
                {statusActions[selected.status].icon} {statusActions[selected.status].label}
              </button>
              <button className="btn btn-secondary" onClick={() => setSelectedTable(null)}>
                <Icons.x size={16} />
              </button>
            </div>
          </div>

          {selected.status === "ocupada" && selected.order > 0 && (
            <div style={{ background: "var(--bg-slate-50)", borderRadius: 16, padding: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 12 }}>Pedido actual</p>
              <div style={{ display: "flex", gap: 12 }}>
                {Array.from({ length: selected.order }).map((_, i) => (
                  <div key={i} style={{
                    width: 48, height: 48, borderRadius: 12, background: "var(--bg-white)", border: "1px solid var(--border-light)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24
                  }}>
                    {["🥔", "🥩", "🍸", "🍮"][i % 4]}
                  </div>
                ))}
              </div>
              <p style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 12 }}>
                {selected.order} items · Approx. {money(selected.order * 22)}
              </p>
            </div>
          )}

          {selected.status === "reservada" && (
            <div style={{ background: "var(--warning-bg)", borderRadius: 16, padding: 20, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24 }}>📅</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--warning)" }}>Mesa reservada</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Esperando llegó del cliente</p>
              </div>
            </div>
          )}

          {selected.status === "libre" && (
            <div style={{ background: "var(--success-bg)", borderRadius: 16, padding: 20, display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 24 }}>✨</span>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--success)" }}>Mesa disponible</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Lista para recibir clientes</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};