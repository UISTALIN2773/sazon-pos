// ══════════════════════════════════════════════════════════════════════
// SazónPOS — Point of Sale Page
// ══════════════════════════════════════════════════════════════════════

const POSPage = ({ onSale }) => {
  const [order, setOrder] = React.useState([]);
  const [category, setCategory] = React.useState("Todos");
  const [search, setSearch] = React.useState("");
  const [method, setMethod] = React.useState("Efectivo");
  const [cashInput, setCashInput] = React.useState("");
  const [qrConfirmed, setQrConfirmed] = React.useState(false);
  const [orderType, setOrderType] = React.useState("Salón");
  const [selectedTable, setSelectedTable] = React.useState(null);
  const [showReceipt, setShowReceipt] = React.useState(null);
  const [discount, setDiscount] = React.useState(null);
  const [couponInput, setCouponInput] = React.useState("");
  const [couponError, setCouponError] = React.useState("");
  const [orderNotes, setOrderNotes] = React.useState("");
  const [showNotes, setShowNotes] = React.useState(false);
  const searchRef = React.useRef(null);

  // Keyboard shortcuts
  React.useEffect(() => {
    const clearHandler = () => { clearOrder(); };
    const searchHandler = () => { searchRef.current?.focus(); };
    window.addEventListener("pos-clear-order", clearHandler);
    window.addEventListener("pos-focus-search", searchHandler);
    return () => {
      window.removeEventListener("pos-clear-order", clearHandler);
      window.removeEventListener("pos-focus-search", searchHandler);
    };
  }, []);

  const filtered = React.useMemo(() => {
    let result = MENU;
    if (category !== "Todos") result = result.filter(m => m.cat === category);
    if (search) result = result.filter(m =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.desc.toLowerCase().includes(search.toLowerCase())
    );
    return result;
  }, [category, search]);

  const addItem = React.useCallback((item) => {
    setOrder(prev => {
      const found = prev.find(p => p.id === item.id);
      if (found) return prev.map(p => p.id === item.id ? { ...p, qty: p.qty + 1 } : p);
      return [...prev, { ...item, qty: 1 }];
    });
  }, []);

  const decItem = React.useCallback((id) => {
    setOrder(prev => prev.map(p => p.id === id ? { ...p, qty: p.qty - 1 } : p).filter(p => p.qty > 0));
  }, []);

  const removeItem = React.useCallback((id) => setOrder(prev => prev.filter(p => p.id !== id)), []);
  const clearOrder = React.useCallback(() => {
    setOrder([]); setCashInput(""); setQrConfirmed(false);
    setDiscount(null); setCouponInput(""); setCouponError("");
    setOrderNotes(""); setShowNotes(false);
  }, []);

  const applyCoupon = React.useCallback(() => {
    const code = couponInput.trim().toUpperCase();
    const coupon = COUPONS[code];
    if (coupon) {
      setDiscount({ code, ...coupon });
      setCouponError("");
    } else {
      setCouponError("Cupón no válido");
      setTimeout(() => setCouponError(""), 2000);
    }
  }, [couponInput]);

  const removeDiscount = React.useCallback(() => {
    setDiscount(null);
    setCouponInput("");
  }, []);

  const subtotal = React.useMemo(() => order.reduce((s, p) => s + p.price * p.qty, 0), [order]);
  const discountAmount = React.useMemo(() => {
    if (!discount) return 0;
    if (discount.type === "percent") return subtotal * (discount.value / 100);
    return Math.min(discount.value, subtotal);
  }, [subtotal, discount]);
  const afterDiscount = subtotal - discountAmount;
  const isDelivery = orderType === "Delivery";
  const deliveryFee = isDelivery ? (afterDiscount >= DELIVERY_CONFIG.freeDeliveryThreshold ? 0 : DELIVERY_CONFIG.fee) : 0;
  const surcharge = isDelivery && afterDiscount < DELIVERY_CONFIG.minimumOrder && afterDiscount > 0 ? DELIVERY_CONFIG.surcharge : 0;
  const igv = afterDiscount * 0.18;
  const total = afterDiscount + igv + deliveryFee + surcharge;
  const received = parseFloat(cashInput || "0");
  const vuelto = received - total;
  const readyToCharge = order.length > 0 && ((method === "Efectivo" && received >= total && total > 0) || (method !== "Efectivo" && qrConfirmed));
  const totalItems = order.reduce((s, p) => s + p.qty, 0);

  const cobrar = () => {
    if (!readyToCharge) return;
    const ticket = {
      id: Date.now(), items: [...order], subtotal, discountAmount, discount: discount ? discount.code : null,
      deliveryFee, surcharge, igv, total, method, type: orderType, table: selectedTable,
      time: new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }),
      notes: orderNotes,
    };
    onSale(ticket);
    setShowReceipt(ticket);
    clearOrder();
  };

  return (
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

      {/* Menu Area */}
      <div style={{ flex: 1, overflowY: "auto", padding: 32 }}>

        {/* Top Controls */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div className="segmented">
            {["Salón", "Para Llevar", "Delivery"].map(type => (
              <button key={type}
                onClick={() => { setOrderType(type); if (type !== "Salón") setSelectedTable(null); }}
                className={`segmented-item ${orderType === type ? "active" : ""}`}>
                {type === "Salón" ? <Icons.store size={16} /> : type === "Para Llevar" ? <Icons.package size={16} /> : <Icons.truck size={16} />}
                {type}
              </button>
            ))}
          </div>
          {orderType === "Salón" && (
            <select value={selectedTable || ""} onChange={e => setSelectedTable(e.target.value || null)}
              className="form-select" style={{ width: "auto", padding: "10px 16px", fontSize: 13 }}>
              <option value="">Mesa...</option>
              {TABLES.filter(t => t.status === "libre").map(t => (
                <option key={t.id} value={t.id}>Mesa {t.id} ({t.capacity}p)</option>
              ))}
            </select>
          )}
          <div style={{ flex: 1 }} />
          <div style={{ position: "relative", width: 288 }}>
            <Icons.search size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
            <input ref={searchRef} type="text" placeholder="Buscar plato... (Ctrl+F)" value={search} onChange={e => setSearch(e.target.value)}
              className="form-input" style={{ paddingLeft: 42, paddingRight: 36, fontSize: 13 }} />
            {search && (
              <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-faint)", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
                <Icons.x size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Categories */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setCategory(c.id)}
              className={`btn ${category === c.id ? "" : "btn-secondary"}`}
              style={category === c.id ? { background: "var(--text-primary)", color: "white", boxShadow: "var(--shadow-md)" } : {}}>
              {c.emoji} {c.id}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16, paddingBottom: 32 }}>
          {filtered.map((item, index) => (
            <button key={item.id} onClick={() => addItem(item)}
              className="product-card animate-fade-up"
              style={{ animationDelay: `${index * 0.03}s`, opacity: 0 }}>
              {item.popular ? (
                <div className="product-card-popular"><Icons.star size={10} /> Popular</div>
              ) : (
                <div className="product-card-add"><Icons.plus size={16} /></div>
              )}
              <div className="product-card-emoji">
                {item.image ? (
                  <img src={item.image} alt={item.name} loading="lazy"
                    onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                ) : null}
                <span style={{ display: item.image ? "none" : "flex" }}>{item.emoji}</span>
              </div>
              <div className="product-card-name">{item.name}</div>
              <div className="product-card-desc">{item.desc}</div>
              <div className="product-card-footer">
                <span className="product-card-price mono">{money(item.price)}</span>
                <div className="product-card-rating">
                  <Icons.star size={11} style={{ color: "#F59E0B", fill: "#F59E0B" }} />
                  <span className="mono" style={{ fontSize: 11, color: "#D97706", fontWeight: 600 }}>{item.rating}</span>
                </div>
              </div>
            </button>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1 / -1", padding: 80, textAlign: "center", color: "var(--text-muted)" }}>
              <div style={{ width: 64, height: 64, background: "var(--bg-slate-100)", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <Icons.search size={28} style={{ color: "var(--text-faint)" }} />
              </div>
              <p style={{ fontWeight: 600, color: "var(--text-secondary)" }}>Sin resultados</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>Prueba con otro término</p>
            </div>
          )}
        </div>
      </div>

      {/* ORDER TICKET */}
      <div className="ticket">
        {/* Header */}
        <div className="ticket-header">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: 18, color: "var(--text-primary)" }}>Orden</h2>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2, fontWeight: 500 }}>
                {orderType}{selectedTable ? ` · Mesa ${selectedTable}` : ""} · {totalItems} items
                {isDelivery && <span style={{ marginLeft: 6, color: "var(--info)", fontWeight: 600 }}>+ Envío</span>}
              </p>
            </div>
            {order.length > 0 && (
              <button onClick={clearOrder} style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: "6px 12px", borderRadius: 8, transition: "all 0.15s" }}
                onMouseEnter={e => { e.target.style.color = "var(--error)"; e.target.style.background = "var(--error-bg)"; }}
                onMouseLeave={e => { e.target.style.color = "var(--text-muted)"; e.target.style.background = "none"; }}>
                Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Items */}
        <div className="ticket-items">
          {order.length === 0 ? (
            <div className="ticket-empty">
              <div className="ticket-empty-icon"><Icons.cart size={32} /></div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-muted)" }}>Sin productos</p>
                <p style={{ fontSize: 12, color: "var(--text-faint)", marginTop: 4 }}>Selecciona del menú</p>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {order.map((p, idx) => (
                <div key={p.id} className="ticket-item animate-slide-right" style={{ animationDelay: `${idx * 0.04}s` }}>
                  <div className="ticket-item-emoji">
                    {p.image ? (
                      <img src={p.image} alt={p.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "inherit" }}
                        onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                    ) : null}
                    <span style={{ display: p.image ? "none" : "flex", fontSize: 20 }}>{p.emoji}</span>
                  </div>
                  <div className="ticket-item-info">
                    <div className="ticket-item-name">{p.name}</div>
                    <div className="ticket-item-price mono">{money(p.price)} c/u</div>
                  </div>
                  <div className="ticket-qty-controls">
                    <button className="ticket-qty-btn" onClick={() => decItem(p.id)}><Icons.minus size={12} /></button>
                    <span className="ticket-qty-value mono">{p.qty}</span>
                    <button className="ticket-qty-btn" onClick={() => addItem(p)}><Icons.plus size={12} /></button>
                  </div>
                  <div className="ticket-item-total mono">{money(p.price * p.qty)}</div>
                  <button className="ticket-item-remove" onClick={() => removeItem(p.id)}><Icons.x size={14} /></button>
                </div>
              ))}

              {/* Order Notes */}
              <div className="order-notes-section">
                <button className="order-notes-toggle" onClick={() => setShowNotes(!showNotes)}>
                  <Icons.messageSquare size={14} />
                  {showNotes ? "Ocultar notas" : "Agregar notas"}
                  <Icons.chevronDown size={12} style={{ transform: showNotes ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>
                {showNotes && (
                  <textarea className="order-notes-input" placeholder="Ej: Sin cebolla, poco picante, extra salsa..." value={orderNotes} onChange={e => setOrderNotes(e.target.value)} />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Checkout */}
        <div className="checkout">
          {/* Discount */}
          <div style={{ marginBottom: 12 }}>
            {discount ? (
              <div className="discount-badge">
                <Icons.tag size={14} />
                {discount.label}
                <button className="discount-remove" onClick={removeDiscount}><Icons.x size={12} /></button>
              </div>
            ) : (
              <div className="discount-row">
                <input className="discount-input" placeholder="Cupón" value={couponInput} onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === "Enter" && applyCoupon()} />
                <button className="discount-apply-btn" onClick={applyCoupon}>Aplicar</button>
              </div>
            )}
            {couponError && <p style={{ fontSize: 11, color: "var(--error)", marginTop: 4, fontWeight: 500 }}>{couponError}</p>}
          </div>

          <div className="checkout-row"><span>Subtotal</span><span className="mono">{money(subtotal)}</span></div>
          {discountAmount > 0 && (
            <div className="checkout-row" style={{ color: "var(--success)" }}>
              <span>Descuento ({discount.code})</span><span className="mono">-{money(discountAmount)}</span>
            </div>
          )}
          {isDelivery && (
            <>
              <div className="checkout-row">
                <span>Envío</span>
                <span className={`mono ${deliveryFee === 0 ? "free" : ""}`}>{deliveryFee === 0 ? "Gratis" : money(deliveryFee)}</span>
              </div>
              {surcharge > 0 && (
                <div className="checkout-row" style={{ color: "var(--warning)" }}>
                  <span>Recargo (mínimo {money(DELIVERY_CONFIG.minimumOrder)})</span><span className="mono">+{money(surcharge)}</span>
                </div>
              )}
            </>
          )}
          <div className="checkout-row"><span>IGV (18%)</span><span className="mono">{money(igv)}</span></div>
          <div className="checkout-total">
            <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>Total</span>
            <span className="checkout-total-value mono">{money(total)}</span>
          </div>

          <p className="payment-label" style={{ marginTop: 20 }}>Método de Pago</p>
          <div className="payment-methods">
            {[{ id: "Efectivo", icon: Icons.banknote }, { id: "Plin", icon: Icons.qr }, { id: "Yape", icon: Icons.zap }].map(m => (
              <button key={m.id} onClick={() => { setMethod(m.id); setCashInput(""); setQrConfirmed(false); }}
                className={`payment-method-btn ${method === m.id ? "active" : ""}`}>
                <m.icon size={14} /> {m.id}
              </button>
            ))}
          </div>

          <div style={{ minHeight: 80 }}>
            {method === "Efectivo" && (
              <div className="animate-fade-up" style={{ background: "var(--bg-white)", padding: 14, borderRadius: 12, border: "1px solid var(--border-light)" }}>
                <div className="cash-input-wrapper">
                  <span className="cash-input-prefix">S/</span>
                  <input type="number" value={cashInput} onChange={e => setCashInput(e.target.value)} placeholder="0.00" className="cash-input" />
                </div>
                {cashInput !== "" && (
                  <div className={`cash-change ${vuelto >= 0 ? "positive" : "negative"}`}>
                    <span>{vuelto >= 0 ? "Vuelto" : "Faltante"}</span>
                    <span className="cash-change-value mono">{money(Math.abs(vuelto))}</span>
                  </div>
                )}
              </div>
            )}
            {(method === "Plin" || method === "Yape") && (
              <div className="animate-fade-up qr-panel" style={{ position: "relative" }}>
                <QRPattern size={120} />
                {!qrConfirmed ? (
                  <button onClick={() => setQrConfirmed(true)} className="qr-simulate-btn">Simular pago ({method})</button>
                ) : (
                  <div className="qr-confirmed animate-bounce-in"><Icons.check size={16} /> Pago confirmado</div>
                )}
              </div>
            )}
          </div>

          <button onClick={cobrar} disabled={!readyToCharge} className="btn btn-primary" style={{ width: "100%", marginTop: 20, padding: "16px 0", fontSize: 14 }}>
            {readyToCharge ? <><Icons.check size={18} /> Cobrar {money(total)}</> : "Agrega productos para cobrar"}
          </button>
        </div>
      </div>

      {/* Receipt Modal */}
      {showReceipt && <ReceiptModal ticket={showReceipt} onClose={() => setShowReceipt(null)} />}
    </div>
  );
};