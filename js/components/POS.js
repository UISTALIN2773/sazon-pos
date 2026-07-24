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

  React.useEffect(() => {
    const clearHandler = () => clearOrder();
    const searchHandler = () => searchRef.current?.focus();
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

  const removeDiscount = React.useCallback(() => { setDiscount(null); setCouponInput(""); }, []);

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

      {/* ═══ MENU AREA ═══ */}
      <div style={{ flex: 1, overflowY: "auto", padding: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
          <div className="segmented">
            {["Salón", "Para Llevar", "Delivery"].map(type => (
              <button key={type} onClick={() => { setOrderType(type); if (type !== "Salón") setSelectedTable(null); }}
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

        <div style={{ display: "flex", gap: 8, marginBottom: 32 }}>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setCategory(c.id)}
              className={`btn ${category === c.id ? "" : "btn-secondary"}`}
              style={category === c.id ? { background: "var(--text-primary)", color: "white", boxShadow: "var(--shadow-md)" } : {}}>
              {c.emoji} {c.id}
            </button>
          ))}
        </div>

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

      {/* ═══ ORDER TICKET ═══ */}
      <div className="ticket">

        {/* Header */}
        <div className="ticket-header">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: 17, color: "var(--text-primary)" }}>Orden</h2>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-muted)", background: "var(--bg-slate-100)", padding: "3px 8px", borderRadius: 6 }}>
                  {orderType}
                </span>
                {selectedTable && (
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--brand)", background: "var(--brand-light)", padding: "3px 8px", borderRadius: 6 }}>
                    Mesa {selectedTable}
                  </span>
                )}
                {isDelivery && (
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--info)", background: "var(--info-bg)", padding: "3px 8px", borderRadius: 6 }}>
                    + Envío
                  </span>
                )}
                <span className="mono" style={{ fontSize: 11, color: "var(--text-faint)" }}>
                  {totalItems} {totalItems === 1 ? "item" : "items"}
                </span>
              </div>
            </div>
            {order.length > 0 && (
              <button onClick={clearOrder}
                style={{ fontSize: 12, fontWeight: 600, color: "var(--text-muted)", background: "var(--bg-slate-100)", border: "none", cursor: "pointer", padding: "6px 12px", borderRadius: 8, transition: "all 0.15s", display: "flex", alignItems: "center", gap: 4 }}
                onMouseEnter={e => { e.target.style.color = "var(--error)"; e.target.style.background = "var(--error-bg)"; }}
                onMouseLeave={e => { e.target.style.color = "var(--text-muted)"; e.target.style.background = "var(--bg-slate-100)"; }}>
                <Icons.trash size={12} /> Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Items List */}
        <div className="ticket-items">
          {order.length === 0 ? (
            <div className="ticket-empty">
              <div style={{ width: 88, height: 88, borderRadius: 24, background: "linear-gradient(135deg, var(--bg-slate-50), var(--bg-slate-100))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icons.cart size={36} style={{ color: "var(--text-faint)" }} />
              </div>
              <div style={{ textAlign: "center" }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-secondary)", marginBottom: 4 }}>Sin productos</p>
                <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.5 }}>Selecciona platos del menú<br />para agregar a la orden</p>
              </div>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {order.map((p, idx) => (
                <div key={p.id} className="ticket-item animate-slide-right" style={{ animationDelay: `${idx * 0.04}s` }}>
                  {/* Image */}
                  <div className="ticket-item-emoji">
                    {p.image ? (
                      <img src={p.image} alt={p.name} loading="lazy"
                        onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                    ) : null}
                    <span style={{ display: p.image ? "none" : "flex", fontSize: 22 }}>{p.emoji}</span>
                  </div>

                  {/* Name + Price per unit */}
                  <div className="ticket-item-info">
                    <div className="ticket-item-name">{p.name}</div>
                    <div className="ticket-item-price mono">{money(p.price)} × {p.qty}</div>
                  </div>

                  {/* Qty Controls */}
                  <div className="ticket-qty-controls">
                    <button className="ticket-qty-btn" onClick={() => decItem(p.id)}>
                      <Icons.minus size={13} />
                    </button>
                    <span className="ticket-qty-value mono">{p.qty}</span>
                    <button className="ticket-qty-btn" onClick={() => addItem(p)}>
                      <Icons.plus size={13} />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="ticket-item-total mono">{money(p.price * p.qty)}</div>

                  {/* Remove */}
                  <button className="ticket-item-remove" onClick={() => removeItem(p.id)}>
                    <Icons.x size={14} />
                  </button>
                </div>
              ))}

              {/* Notes Toggle */}
              <div style={{ paddingTop: 12, marginTop: 8, borderTop: "1px dashed var(--border-light)" }}>
                <button onClick={() => setShowNotes(!showNotes)}
                  style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, color: orderNotes ? "var(--brand)" : "var(--text-muted)", background: orderNotes ? "var(--brand-light)" : "none", border: "none", cursor: "pointer", padding: "6px 10px", borderRadius: 8, width: "100%", transition: "all 0.15s" }}>
                  <Icons.messageSquare size={13} />
                  {orderNotes ? "Nota agregada" : "Agregar nota"}
                  <Icons.chevronDown size={12} style={{ marginLeft: "auto", transform: showNotes ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>
                {showNotes && (
                  <textarea
                    placeholder="Ej: Sin cebolla, poco picante..."
                    value={orderNotes}
                    onChange={e => setOrderNotes(e.target.value)}
                    style={{ width: "100%", marginTop: 8, padding: "10px 12px", border: "1px solid var(--border-light)", borderRadius: 10, fontSize: 12, color: "var(--text-primary)", resize: "vertical", minHeight: 56, fontFamily: "inherit", transition: "border-color 0.15s" }}
                    onFocus={e => e.target.style.borderColor = "var(--brand)"}
                    onBlur={e => e.target.style.borderColor = "var(--border-light)"}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* ═══ CHECKOUT ═══ */}
        <div className="checkout">

          {/* Coupon */}
          <div style={{ marginBottom: 16 }}>
            {discount ? (
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "var(--success-bg)", borderRadius: 10, marginBottom: 0 }}>
                <Icons.tag size={14} style={{ color: "var(--success)" }} />
                <span style={{ fontSize: 12, fontWeight: 600, color: "var(--success)", flex: 1 }}>{discount.label}</span>
                <button onClick={removeDiscount} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--success)", padding: 2, display: "flex", opacity: 0.7 }}>
                  <Icons.x size={14} />
                </button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  placeholder="Cupón"
                  value={couponInput}
                  onChange={e => setCouponInput(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === "Enter" && applyCoupon()}
                  style={{ flex: 1, padding: "9px 12px", border: "1px solid var(--border-light)", borderRadius: 10, fontSize: 12, fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", textTransform: "uppercase", letterSpacing: "0.05em", transition: "all 0.15s" }}
                  onFocus={e => e.target.style.borderColor = "var(--brand)"}
                  onBlur={e => e.target.style.borderColor = "var(--border-light)"}
                />
                <button onClick={applyCoupon}
                  style={{ padding: "9px 14px", background: "var(--text-primary)", color: "white", border: "none", borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s", whiteSpace: "nowrap" }}>
                  Aplicar
                </button>
              </div>
            )}
            {couponError && <p style={{ fontSize: 11, color: "var(--error)", marginTop: 6, fontWeight: 500 }}>{couponError}</p>}
          </div>

          {/* Totals */}
          <div style={{ background: "var(--bg-slate-50)", borderRadius: 12, padding: 14, marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
              <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
              <span className="mono" style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{money(subtotal)}</span>
            </div>
            {discountAmount > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8, color: "var(--success)" }}>
                <span>Descuento</span>
                <span className="mono" style={{ fontWeight: 600 }}>-{money(discountAmount)}</span>
              </div>
            )}
            {isDelivery && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8 }}>
                <span style={{ color: "var(--text-muted)" }}>Envío</span>
                <span className={`mono ${deliveryFee === 0 ? "" : ""}`} style={{ fontWeight: 600, color: deliveryFee === 0 ? "var(--success)" : "var(--text-secondary)" }}>
                  {deliveryFee === 0 ? "Gratis" : money(deliveryFee)}
                </span>
              </div>
            )}
            {surcharge > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 8, color: "var(--warning)" }}>
                <span>Recargo</span>
                <span className="mono" style={{ fontWeight: 600 }}>+{money(surcharge)}</span>
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, paddingTop: 8, borderTop: "1px solid var(--border-light)" }}>
              <span style={{ color: "var(--text-muted)" }}>IGV (18%)</span>
              <span className="mono" style={{ fontWeight: 600, color: "var(--text-secondary)" }}>{money(igv)}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, marginTop: 8, borderTop: "2px solid var(--border-light)" }}>
              <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>Total</span>
              <span className="mono" style={{ fontSize: 26, fontWeight: 800, color: "var(--brand)", letterSpacing: "-0.02em" }}>{money(total)}</span>
            </div>
          </div>

          {/* Payment Methods */}
          <div style={{ marginBottom: 16 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Método de Pago</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
              {[{ id: "Efectivo", icon: Icons.banknote, color: "#059669" }, { id: "Plin", icon: Icons.qr, color: "#2563EB" }, { id: "Yape", icon: Icons.zap, color: "#7C3AED" }].map(m => (
                <button key={m.id} onClick={() => { setMethod(m.id); setCashInput(""); setQrConfirmed(false); }}
                  style={{
                    padding: "10px 0", borderRadius: 12, fontSize: 12, fontWeight: 600,
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                    border: method === m.id ? `2px solid ${m.color}` : "2px solid var(--border-light)",
                    background: method === m.id ? `${m.color}08` : "var(--bg-white)",
                    color: method === m.id ? m.color : "var(--text-secondary)",
                    cursor: "pointer", transition: "all 0.15s",
                    boxShadow: method === m.id ? `0 4px 12px ${m.color}15` : "none",
                  }}>
                  <m.icon size={18} />
                  {m.id}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Input */}
          <div style={{ minHeight: 80, marginBottom: 16 }}>
            {method === "Efectivo" && (
              <div style={{ background: "var(--bg-white)", padding: 14, borderRadius: 14, border: "1px solid var(--border-light)" }}>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, color: "var(--text-muted)" }}>S/</span>
                  <input type="number" value={cashInput} onChange={e => setCashInput(e.target.value)} placeholder="0.00"
                    style={{ width: "100%", background: "var(--bg-slate-50)", border: "1px solid transparent", borderRadius: 10, padding: "12px 12px 12px 40px", fontFamily: "'JetBrains Mono', monospace", fontSize: 18, fontWeight: 700, color: "var(--text-primary)", transition: "all 0.15s" }}
                    onFocus={e => { e.target.style.borderColor = "var(--brand)"; e.target.style.boxShadow = "0 0 0 3px rgba(255,79,0,0.1)"; }}
                    onBlur={e => { e.target.style.borderColor = "transparent"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
                {cashInput !== "" && (
                  <div style={{ marginTop: 10, padding: "10px 12px", borderRadius: 10, fontSize: 13, fontWeight: 600, display: "flex", justifyContent: "space-between", alignItems: "center", background: vuelto >= 0 ? "var(--success-bg)" : "var(--error-bg)", color: vuelto >= 0 ? "var(--success)" : "var(--error)" }}>
                    <span>{vuelto >= 0 ? "Vuelto" : "Faltante"}</span>
                    <span className="mono" style={{ fontSize: 17, fontWeight: 800 }}>{money(Math.abs(vuelto))}</span>
                  </div>
                )}
              </div>
            )}
            {(method === "Plin" || method === "Yape") && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", background: "var(--bg-white)", padding: 16, borderRadius: 14, border: "1px solid var(--border-light)" }}>
                <QRPattern size={120} />
                {!qrConfirmed ? (
                  <button onClick={() => setQrConfirmed(true)}
                    style={{ marginTop: 12, padding: "8px 20px", background: "var(--bg-slate-100)", color: "var(--text-secondary)", fontSize: 12, fontWeight: 600, borderRadius: 10, cursor: "pointer", border: "none", transition: "all 0.15s" }}>
                    Simular pago ({method})
                  </button>
                ) : (
                  <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 6, color: "var(--success)", background: "var(--success-bg)", padding: "8px 20px", borderRadius: 10, fontSize: 13, fontWeight: 600 }}>
                    <Icons.check size={16} /> Pago confirmado
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Charge Button */}
          <button onClick={cobrar} disabled={!readyToCharge}
            className="btn btn-primary"
            style={{ width: "100%", padding: "15px 0", fontSize: 14, fontWeight: 700, borderRadius: 14 }}>
            {readyToCharge ? <><Icons.check size={18} /> Cobrar {money(total)}</> : "Agrega productos para cobrar"}
          </button>
        </div>
      </div>

      {showReceipt && <ReceiptModal ticket={showReceipt} onClose={() => setShowReceipt(null)} />}
    </div>
  );
};