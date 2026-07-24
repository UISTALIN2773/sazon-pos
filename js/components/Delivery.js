// ══════════════════════════════════════════════════════════════════════
// SazónPOS — Delivery Page
// ══════════════════════════════════════════════════════════════════════

const DeliveryPage = ({ onDeliveryUpdate, onNewDelivery }) => {
  const [orders, setOrders] = React.useState(DELIVERY_ORDERS);
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({ client: "", phone: "", address: "", notes: "" });
  const [formItems, setFormItems] = React.useState([{ name: "", qty: 1, price: 0 }]);

  const statusConfig = {
    pendiente:  { bg: "var(--warning-bg)", text: "var(--warning)", icon: "🕐", label: "Pendiente", next: "preparando", nextLabel: "Preparar" },
    preparando: { bg: "var(--info-bg)",    text: "var(--info)",    icon: "👨‍🍳", label: "Preparando", next: "enviado", nextLabel: "Enviar" },
    enviado:    { bg: "#F5F3FF",           text: "#7C3AED",       icon: "🛵", label: "Enviado", next: "entregado", nextLabel: "Entregar" },
    entregado:  { bg: "var(--success-bg)", text: "var(--success)", icon: "✅", label: "Entregado", next: null, nextLabel: null },
  };

  const riders = DELIVERY_CONFIG.riders;

  const addFormItem = () => setFormItems(prev => [...prev, { name: "", qty: 1, price: 0 }]);
  const removeFormItem = (i) => setFormItems(prev => prev.filter((_, idx) => idx !== i));
  const updateFormItem = (i, field, value) => {
    setFormItems(prev => prev.map((item, idx) => idx === i ? { ...item, [field]: value } : item));
  };

  const formSubtotal = formItems.reduce((s, item) => s + (item.price * item.qty), 0);
  const formFee = formSubtotal >= DELIVERY_CONFIG.freeDeliveryThreshold ? 0 : DELIVERY_CONFIG.fee;
  const formSurcharge = formSubtotal < DELIVERY_CONFIG.minimumOrder && formSubtotal > 0 ? DELIVERY_CONFIG.surcharge : 0;
  const formTotal = formSubtotal + formFee + formSurcharge;

  const createOrder = () => {
    if (!form.client || !form.address || formItems.some(i => !i.name || i.price <= 0)) return;
    const newOrder = {
      id: Date.now(),
      client: form.client,
      phone: form.phone,
      address: form.address,
      items: formItems.filter(i => i.name && i.price > 0),
      subtotal: formSubtotal,
      deliveryFee: formFee,
      surcharge: formSurcharge,
      total: formTotal,
      status: "pendiente",
      time: new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
      rider: null,
      notes: form.notes,
    };
    setOrders(prev => [newOrder, ...prev]);
    onNewDelivery(newOrder);
    setShowForm(false);
    setForm({ client: "", phone: "", address: "", notes: "" });
    setFormItems([{ name: "", qty: 1, price: 0 }]);
  };

  const advanceStatus = (orderId) => {
    setOrders(prev => prev.map(o => {
      if (o.id !== orderId) return o;
      const sc = statusConfig[o.status];
      if (!sc.next) return o;
      const updates = { status: sc.next };
      if (sc.next === "enviado" && !o.rider) updates.rider = riders[Math.floor(Math.random() * riders.length)];
      return { ...o, ...updates };
    }));
    const order = orders.find(o => o.id === orderId);
    if (order) {
      const sc = statusConfig[order.status];
      if (sc.next) onDeliveryUpdate(orderId, sc.next);
    }
  };

  return (
    <div className="page-container animate-fade-in">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Delivery</h1>
          <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>
            {orders.filter(o => o.status !== "entregado").length} pedidos activos
          </p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          <Icons.plus size={16} /> Nuevo Pedido
        </button>
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
                <div style={{ background: "var(--bg-slate-50)", borderRadius: 12, padding: 12, marginBottom: 12 }}>
                  <p style={{ fontSize: 11, color: "var(--text-muted)", marginBottom: 4, fontWeight: 600 }}>Dirección</p>
                  <p style={{ fontSize: 13, color: "var(--text-primary)", fontWeight: 500 }}>{order.address}</p>
                </div>

                {/* Items list */}
                <div style={{ marginBottom: 12 }}>
                  {order.items.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "var(--text-secondary)", padding: "3px 0" }}>
                      <span>{item.qty}x {item.name}</span>
                      <span className="mono" style={{ fontWeight: 500 }}>{money(item.price * item.qty)}</span>
                    </div>
                  ))}
                </div>

                {/* Price Breakdown */}
                <div className="delivery-breakdown">
                  <div className="delivery-breakdown-row">
                    <span>Subtotal</span><span className="mono">{money(order.subtotal)}</span>
                  </div>
                  <div className="delivery-breakdown-row">
                    <span>Envío</span>
                    <span className={`mono ${order.deliveryFee === 0 ? "free" : ""}`}>
                      {order.deliveryFee === 0 ? "Gratis" : money(order.deliveryFee)}
                    </span>
                  </div>
                  {order.surcharge > 0 && (
                    <div className="delivery-breakdown-row" style={{ color: "var(--warning)" }}>
                      <span>Recargo</span><span className="mono">+{money(order.surcharge)}</span>
                    </div>
                  )}
                  <div className="delivery-breakdown-row total">
                    <span>Total</span><span className="mono" style={{ color: "var(--brand)" }}>{money(order.total)}</span>
                  </div>
                </div>

                {order.notes && (
                  <div style={{ marginTop: 8, padding: "8px 10px", background: "#FFFBEB", borderRadius: 8, fontSize: 12, color: "var(--warning)", display: "flex", alignItems: "center", gap: 6 }}>
                    <Icons.messageSquare size={12} /> {order.notes}
                  </div>
                )}

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border-subtle)" }}>
                  {order.rider ? (
                    <span style={{ fontSize: 12, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ width: 20, height: 20, background: "var(--bg-slate-200)", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10 }}>🛵</span>
                      {order.rider}
                    </span>
                  ) : (
                    <span style={{ fontSize: 12, color: "var(--text-faint)" }}>Sin repartidor</span>
                  )}
                </div>

                {/* Action Buttons */}
                {sc.next && (
                  <div className="delivery-actions">
                    <button className="delivery-action-btn primary" onClick={() => advanceStatus(order.id)}>
                      <Icons.arrowRight size={14} /> {sc.nextLabel}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Order Form Modal */}
      {showForm && (
        <div className="delivery-form-overlay" onClick={() => setShowForm(false)}>
          <div className="delivery-form" onClick={e => e.stopPropagation()}>
            <div className="delivery-form-header">
              <h3 style={{ fontWeight: 700, fontSize: 18, color: "var(--text-primary)" }}>Nuevo Pedido Delivery</h3>
              <button onClick={() => setShowForm(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>
                <Icons.x size={20} />
              </button>
            </div>
            <div className="delivery-form-body">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
                <div className="form-group">
                  <label className="form-label">Cliente *</label>
                  <input className="form-input" placeholder="Nombre completo" value={form.client} onChange={e => setForm({ ...form, client: e.target.value })} />
                </div>
                <div className="form-group">
                  <label className="form-label">Teléfono</label>
                  <input className="form-input mono" placeholder="+51 999 000 000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Dirección *</label>
                <input className="form-input" placeholder="Av.某某 123, Distrito" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>

              {/* Items */}
              <div className="form-group">
                <label className="form-label">Productos</label>
                {formItems.map((item, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                    <input className="form-input" placeholder="Plato" style={{ flex: 2 }} value={item.name} onChange={e => updateFormItem(i, "name", e.target.value)} />
                    <input className="form-input mono" type="number" placeholder="Cant." style={{ flex: 0.5, textAlign: "center" }} value={item.qty} onChange={e => updateFormItem(i, "qty", parseInt(e.target.value) || 1)} />
                    <input className="form-input mono" type="number" placeholder="Precio" style={{ flex: 1 }} value={item.price || ""} onChange={e => updateFormItem(i, "price", parseFloat(e.target.value) || 0)} />
                    {formItems.length > 1 && (
                      <button onClick={() => removeFormItem(i)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-faint)", padding: 8 }}>
                        <Icons.x size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={addFormItem} style={{ fontSize: 12, color: "var(--brand)", fontWeight: 600, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4, padding: "4px 0" }}>
                  <Icons.plus size={14} /> Agregar producto
                </button>
              </div>

              <div className="form-group">
                <label className="form-label">Notas</label>
                <textarea className="order-notes-input" placeholder="Instrucciones especiales..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>

              {/* Preview */}
              {formSubtotal > 0 && (
                <div className="delivery-breakdown" style={{ marginTop: 8 }}>
                  <div className="delivery-breakdown-row"><span>Subtotal</span><span className="mono">{money(formSubtotal)}</span></div>
                  <div className="delivery-breakdown-row">
                    <span>Envío {formSubtotal >= DELIVERY_CONFIG.freeDeliveryThreshold && "(Gratis por encima de " + money(DELIVERY_CONFIG.freeDeliveryThreshold) + ")"}</span>
                    <span className={`mono ${formFee === 0 ? "free" : ""}`}>{formFee === 0 ? "Gratis" : money(formFee)}</span>
                  </div>
                  {formSurcharge > 0 && <div className="delivery-breakdown-row" style={{ color: "var(--warning)" }}><span>Recargo</span><span className="mono">+{money(formSurcharge)}</span></div>}
                  <div className="delivery-breakdown-row total"><span>Total</span><span className="mono" style={{ color: "var(--brand)" }}>{money(formTotal)}</span></div>
                </div>
              )}
            </div>
            <div className="delivery-form-footer">
              <button className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={createOrder} disabled={!form.client || !form.address || formItems.some(i => !i.name || i.price <= 0)}>
                <Icons.check size={16} /> Crear Pedido
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};