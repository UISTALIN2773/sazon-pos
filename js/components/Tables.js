// ══════════════════════════════════════════════════════════════════════
// SazónPOS — Tables Page
// ══════════════════════════════════════════════════════════════════════

const TablesPage = () => {
  const [tables] = React.useState(TABLES);
  const statusLabels = { libre: "Disponible", ocupada: "Ocupada", reservada: "Reservada" };

  return (
    <div className="page-container animate-fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Gestión de Mesas</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>
            {tables.filter(t => t.status === "libre").length} disponibles de {tables.length}
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        {tables.map((table, i) => (
          <button key={table.id}
            className={`table-card ${table.status} animate-fade-up`}
            style={{ animationDelay: `${i * 0.04}s` }}>
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
    </div>
  );
};