// ══════════════════════════════════════════════════════════════════════
// SazónPOS — Delivery Page
// ══════════════════════════════════════════════════════════════════════

const DeliveryPage = () => {
  const [orders] = React.useState(DELIVERY_ORDERS);

  const statusConfig = {
    pendiente:  { bg: "var(--warning-bg)", text: "var(--warning)", icon: "🕐", label: "Pendiente" },
    preparando: { bg: "var(--info-bg)",    text: "var(--info)",    icon: "👨‍🍳", label: "Preparando" },
    enviado:    { bg: "#F5F3FF",           text: "#7C3AED",       icon: "🛵", label: "Enviado" },
    entregado:  { bg: "var(--success-bg)", text: "var(--success)", icon: "✅", label: "Entregado" },
  };

  return (
    <div className="page-container animate-fade-in">
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Delivery</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>
          {orders.filter(o => o.status !== "entregado").length} pedidos activos
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}>
        {orders.map((order, i) => {
          const sc = statusConfig[order.status];
          return (
            <div key={order.id} className="delivery-card card animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className={`delivery-card-status-bar ${order.status}`}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span>{sc.icon}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: sc.text }}>{sc.label}</span>
                </div>
                <span className="mono" style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>{order.time}</span>
              </div>
              <div className="card-body">
                <div style={{ marginBottom: 12 }}>
                  <h3 style={{ fontWeight: 700, color: "var(--text-primary)" }}>{order.client}</h3>
                  <p className="mono" style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>{order.phone}</p>
                </div>
                <div style={{ background: "var(--bg-slate-50)", borderRadius: 12, padding: 12, marginBottom: 16 }}>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4, fontWeight: 600 }}>Dirección</p>
                  <p style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>{order.address}</p>
                </div>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 16 }}>{order.items}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: "1px solid var(--border-subtle)" }}>
                  {order.rider ? (
                    <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 20, height: 20, background: "var(--bg-slate-200)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>🛵</span>
                      {order.rider}
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, color: "var(--text-faint)" }}>Sin repartidor</span>
                  )}
                  <span className="mono" style={{ fontWeight: 700, color: "var(--brand)", fontSize: 18 }}>{money(order.total)}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};