// ══════════════════════════════════════════════════════════════════════
// SazónPOS — Dashboard Page
// ══════════════════════════════════════════════════════════════════════

const Dashboard = ({ ventas }) => {
  const [range, setRange] = React.useState("hoy");

  const totalHoy = ventas.reduce((s, v) => s + v.total, 0);
  const totalTransacciones = ventas.length;
  const ticketPromedio = totalTransacciones > 0 ? totalHoy / totalTransacciones : 0;
  const digital = ventas.filter(v => v.method !== "Efectivo").reduce((s, v) => s + v.total, 0);
  const efectivo = ventas.filter(v => v.method === "Efectivo").reduce((s, v) => s + v.total, 0);

  // Real hourly data from sales
  const hourlyData = React.useMemo(() => {
    const hours = Array(12).fill(0);
    ventas.forEach(v => {
      const h = parseInt(v.time.split(":")[0]);
      const idx = h - 10;
      if (idx >= 0 && idx < 12) hours[idx] += v.total;
    });
    // If no data, show sample
    if (hours.every(h => h === 0)) return [1200, 800, 1500, 2200, 3500, 4200, 3800, 2800, 1800, 1000, 500, 300];
    return hours;
  }, [ventas]);
  const maxH = Math.max(...hourlyData, 1);

  const topItems = {};
  ventas.forEach(v => v.items.forEach(item => {
    topItems[item.name] = (topItems[item.name] || 0) + item.qty;
  }));
  const topSorted = Object.entries(topItems).sort((a, b) => b[1] - a[1]).slice(0, 5);

  // Peak hour
  const peakHourIdx = hourlyData.indexOf(Math.max(...hourlyData));
  const peakHour = peakHourIdx + 10;

  // Payment breakdown
  const paymentMethods = React.useMemo(() => {
    const methods = {};
    ventas.forEach(v => { methods[v.method] = (methods[v.method] || 0) + v.total; });
    return Object.entries(methods).sort((a, b) => b[1] - a[1]);
  }, [ventas]);

  const stats = [
    { label: "Ventas Hoy", value: money(totalHoy), icon: Icons.dollarSign, light: "var(--success-bg)", color: "var(--success)" },
    { label: "Transacciones", value: totalTransacciones, icon: Icons.receipt, light: "var(--info-bg)", color: "var(--info)" },
    { label: "Ticket Promedio", value: money(ticketPromedio), icon: Icons.trendingUp, light: "#F5F3FF", color: "#7C3AED" },
    { label: "Digital", value: `${totalHoy > 0 ? ((digital / totalHoy) * 100).toFixed(0) : 0}%`, icon: Icons.zap, light: "var(--warning-bg)", color: "var(--warning)" },
  ];

  return (
    <div className="page-container animate-fade-in">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Dashboard</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>Resumen de actividad</p>
        </div>
        <div className="segmented">
          {[{ id: "hoy", label: "Hoy" }, { id: "semana", label: "Semana" }, { id: "mes", label: "Mes" }].map(r => (
            <button key={r.id} onClick={() => setRange(r.id)} className={`segmented-item ${range === r.id ? "active" : ""}`}>{r.label}</button>
          ))}
        </div>
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
            {ventas.length > 0 && (
              <span style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>
                Pico: <span className="mono" style={{ fontWeight: 700, color: "var(--brand)" }}>{peakHour}:00</span>
              </span>
            )}
          </div>
          <div className="card-body">
            <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 180 }}>
              {hourlyData.map((h, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <span className="mono" style={{ fontSize: 10, color: "var(--text-muted)", fontWeight: 500 }}>
                    {ventas.length > 0 ? money(h) : Math.round(h)}
                  </span>
                  <div style={{
                    width: "100%", borderRadius: 12, minHeight: 4,
                    background: i === peakHourIdx ? "linear-gradient(to top, var(--brand), #FF8A5C)" : "linear-gradient(to top, #CBD5E1, #E2E8F0)",
                    height: `${(h / maxH) * 100}%`,
                    transition: "height 0.7s var(--ease-out)",
                    transformOrigin: "bottom",
                    opacity: h > 0 ? 1 : 0.3,
                  }} />
                  <span className="mono" style={{ fontSize: 10, color: i === peakHourIdx ? "var(--brand)" : "var(--text-muted)", fontWeight: i === peakHourIdx ? 700 : 400 }}>{i + 10}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Items + Payment */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="card animate-fade-up" style={{ animationDelay: "0.4s", flex: 1 }}>
            <div className="card-header">
              <h3 style={{ fontWeight: 700, color: "var(--text-primary)" }}>Más Vendidos</h3>
            </div>
            <div className="card-body">
              {topSorted.length === 0 ? (
                <div style={{ height: 120, display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-faint)", fontSize: 13 }}>Sin ventas aún</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {topSorted.map(([name, qty], i) => (
                    <div key={name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{
                        width: 24, height: 24, borderRadius: 8,
                        background: "linear-gradient(135deg, var(--brand), var(--brand-hover))",
                        color: "white", fontSize: 10, fontWeight: 700,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 2px 6px rgba(255,79,0,0.2)"
                      }} className="mono">{i + 1}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 12, fontWeight: 600, color: "var(--text-primary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</p>
                        <div style={{ width: "100%", background: "var(--bg-slate-100)", borderRadius: 100, height: 4, marginTop: 4, overflow: "hidden" }}>
                          <div style={{
                            background: "linear-gradient(to right, var(--brand), #FF8A5C)",
                            height: "100%", borderRadius: 100,
                            width: `${(qty / topSorted[0][1]) * 100}%`,
                          }} />
                        </div>
                      </div>
                      <span className="mono" style={{ fontSize: 12, fontWeight: 700, color: "var(--text-secondary)" }}>{qty}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="card animate-fade-up" style={{ animationDelay: "0.45s" }}>
            <div className="card-header">
              <h3 style={{ fontWeight: 700, color: "var(--text-primary)" }}>Por Método</h3>
            </div>
            <div className="card-body">
              {paymentMethods.length === 0 ? (
                <div style={{ padding: 12, textAlign: "center", color: "var(--text-faint)", fontSize: 12 }}>Sin datos</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {paymentMethods.map(([method, amount]) => (
                    <div key={method} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className={`badge ${method === "Efectivo" ? "badge-success" : method === "Plin" ? "badge-info" : "badge-warning"}`}>{method}</span>
                      </div>
                      <span className="mono" style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>{money(amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="card animate-fade-up" style={{ animationDelay: "0.5s" }}>
        <div className="card-header">
          <h3 style={{ fontWeight: 700, color: "var(--text-primary)" }}>Últimas Transacciones</h3>
        </div>
        {ventas.length === 0 ? (
          <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)", fontSize: 14 }}>No hay transacciones registradas hoy</div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Hora</th>
                <th>Tipo</th>
                <th>Items</th>
                <th>Método</th>
                <th>Notas</th>
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
                  <td style={{ maxWidth: 150, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 12, color: "var(--text-muted)" }}>
                    {v.notes || "—"}
                  </td>
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