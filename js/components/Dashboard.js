// ══════════════════════════════════════════════════════════════════════
// SazónPOS — Dashboard Page
// ══════════════════════════════════════════════════════════════════════

const Dashboard = ({ ventas }) => {
  const totalHoy = ventas.reduce((s, v) => s + v.total, 0);
  const totalTransacciones = ventas.length;
  const ticketPromedio = totalTransacciones > 0 ? totalHoy / totalTransacciones : 0;
  const digital = ventas.filter(v => v.method !== "Efectivo").reduce((s, v) => s + v.total, 0);
  const hourlyData = [12, 8, 15, 22, 35, 42, 38, 28, 18, 10, 5, 3];
  const maxH = Math.max(...hourlyData);

  const topItems = {};
  ventas.forEach(v => v.items.forEach(item => {
    topItems[item.name] = (topItems[item.name] || 0) + item.qty;
  }));
  const topSorted = Object.entries(topItems).sort((a, b) => b[1] - a[1]).slice(0, 5);

  const stats = [
    { label: "Ventas Hoy", value: money(totalHoy), icon: Icons.dollarSign, light: "var(--success-bg)", color: "var(--success)" },
    { label: "Transacciones", value: totalTransacciones, icon: Icons.receipt, light: "var(--info-bg)", color: "var(--info)" },
    { label: "Ticket Promedio", value: money(ticketPromedio), icon: Icons.trendingUp, light: "#F5F3FF", color: "#7C3AED" },
    { label: "Digital", value: `${totalHoy > 0 ? ((digital / totalHoy) * 100).toFixed(0) : 0}%`, icon: Icons.zap, light: "var(--warning-bg)", color: "var(--warning)" },
  ];

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Dashboard</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>Resumen de actividad de hoy</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20, marginBottom: 32 }}>
        {stats.map((stat, i) => (
          <div key={i} className="stat-card animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <div className="stat-card-icon" style={{ background: stat.light, color: stat.color }}>
                <stat.icon size={22} />
              </div>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", background: "var(--bg-slate-50)", padding: "4px 10px", borderRadius: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Hoy
              </span>
            </div>
            <div className="stat-card-value animate-count mono">{stat.value}</div>
            <div className="stat-card-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 32 }}>
        {/* Bar Chart */}
        <div className="card animate-fade-up" style={{ animationDelay: "0.3s" }}>
          <div className="card-header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h3 style={{ fontWeight: 700, color: "var(--text-primary)" }}>Ventas por Hora</h3>
            <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>Últimas 12 horas</span>
          </div>
          <div className="card-body">
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 180 }}>
              {hourlyData.map((h, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <span className="mono" style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500 }}>{h}</span>
                  <div style={{
                    width: "100%", borderRadius: 12, minHeight: 4,
                    background: "linear-gradient(to top, var(--brand), #FF8A5C)",
                    height: `${(h / maxH) * 100}%`,
                    transition: "height 0.7s var(--ease-out)",
                    transformOrigin: "bottom"
                  }} />
                  <span className="mono" style={{ fontSize: 10, color: "var(--text-muted)" }}>{i + 10}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Items */}
        <div className="card animate-fade-up" style={{ animationDelay: "0.4s" }}>
          <div className="card-header">
            <h3 style={{ fontWeight: 700, color: "var(--text-primary)" }}>Más Vendidos</h3>
          </div>
          <div className="card-body">
            {topSorted.length === 0 ? (
              <div style={{ height: 180, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-faint)", fontSize: 14 }}>
                Sin ventas aún
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {topSorted.map(([name, qty], i) => (
                  <div key={name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{
                      width: 28, height: 28, borderRadius: 12,
                      background: "linear-gradient(135deg, var(--brand), var(--brand-hover))",
                      color: "white", fontSize: 11, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      boxShadow: "0 2px 8px rgba(255,79,0,0.2)"
                    }} className="mono">{i + 1}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</p>
                      <div style={{ width: "100%", background: "var(--bg-slate-100)", borderRadius: 100, height: 6, marginTop: 6, overflow: "hidden" }}>
                        <div style={{
                          background: "linear-gradient(to right, var(--brand), #FF8A5C)",
                          height: "100%", borderRadius: 100,
                          width: `${(qty / topSorted[0][1]) * 100}%`,
                          transition: "width 0.7s var(--ease-out)"
                        }} />
                      </div>
                    </div>
                    <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: "var(--text-secondary)" }}>{qty}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card animate-fade-up" style={{ animationDelay: "0.5s" }}>
        <div className="card-header">
          <h3 style={{ fontWeight: 700, color: "var(--text-primary)" }}>Últimas Transacciones</h3>
        </div>
        {ventas.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>
            No hay transacciones registradas hoy
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Hora</th>
                <th>Tipo</th>
                <th>Items</th>
                <th>Método</th>
                <th className="text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {ventas.slice(0, 8).map((v) => (
                <tr key={v.id}>
                  <td className="mono" style={{ fontWeight: 500, color: "var(--text-secondary)" }}>{v.time}</td>
                  <td><span className="badge badge-neutral">{v.type}</span></td>
                  <td style={{ color: "var(--text-secondary)" }}>{v.items.reduce((s, i) => s + i.qty, 0)} items</td>
                  <td><span className={`badge ${v.method === "Efectivo" ? "badge-success" : "badge-info"}`}>{v.method}</span></td>
                  <td className="text-right mono" style={{ fontWeight: 700, color: "var(--text-primary)" }}>{money(v.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};