// ══════════════════════════════════════════════════════════════════════
// SazónPOS — Receipt Modal Component
// ══════════════════════════════════════════════════════════════════════

const ReceiptModal = ({ ticket, onClose }) => {
  if (!ticket) return null;

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-content animate-bounce-in" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="receipt-header">
          <div className="receipt-header-icon">
            <Icons.utensils size={26} />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em" }}>SazónPOS</h2>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginTop: 4, fontWeight: 500 }}>
            Restaurante Peruano
          </p>
        </div>

        <div style={{ padding: 24 }}>
          <div className="animate-receipt">

            {/* Ticket Info */}
            <div className="receipt-info">
              <div className="receipt-info-grid">
                <div className="receipt-info-item">
                  <label>Fecha</label>
                  <span className="mono">{new Date().toLocaleDateString("es-PE")}</span>
                </div>
                <div className="receipt-info-item">
                  <label>Hora</label>
                  <span className="mono">{ticket.time}</span>
                </div>
                <div className="receipt-info-item">
                  <label>Tipo</label>
                  <span>{ticket.type}</span>
                </div>
                <div className="receipt-info-item">
                  <label>Método</label>
                  <span>{ticket.method}</span>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="receipt-items">
              {ticket.items.map((item, i) => (
                <div key={i} className="receipt-item">
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{
                      width: 24, height: 24, borderRadius: 8, background: "var(--bg-slate-100)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 11, fontWeight: 700, color: "var(--text-muted)"
                    }} className="mono">{item.qty}x</span>
                    <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text-primary)" }}>
                      {item.name}
                    </span>
                  </div>
                  <span className="mono" style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                    {money(item.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            {/* Notes */}
            {ticket.notes && (
              <div style={{ background: "#FFFBEB", borderRadius: 12, padding: 12, marginBottom: 16, display: "flex", alignItems: "flex-start", gap: 8 }}>
                <Icons.messageSquare size={14} style={{ color: "var(--warning)", marginTop: 2, flexShrink: 0 }} />
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "var(--warning)", textTransform: "uppercase", letterSpacing: "0.05em" }}>Notas</p>
                  <p style={{ fontSize: 13, color: "var(--text-secondary)", marginTop: 2 }}>{ticket.notes}</p>
                </div>
              </div>
            )}

            {/* Totals */}
            <div className="receipt-totals">
              <div className="receipt-total-row">
                <span style={{ color: "var(--text-secondary)" }}>Subtotal</span>
                <span className="mono" style={{ fontWeight: 500, color: "var(--text-secondary)" }}>
                  {money(ticket.subtotal || ticket.total)}
                </span>
              </div>
              {ticket.discountAmount > 0 && (
                <div className="receipt-total-row" style={{ color: "var(--success)" }}>
                  <span>Descuento ({ticket.discount})</span>
                  <span className="mono" style={{ fontWeight: 500 }}>-{money(ticket.discountAmount)}</span>
                </div>
              )}
              {ticket.deliveryFee > 0 && (
                <div className="receipt-total-row">
                  <span style={{ color: "var(--text-secondary)" }}>Envío</span>
                  <span className="mono" style={{ fontWeight: 500, color: "var(--text-secondary)" }}>{money(ticket.deliveryFee)}</span>
                </div>
              )}
              {ticket.deliveryFee === 0 && ticket.type === "Delivery" && (
                <div className="receipt-total-row">
                  <span style={{ color: "var(--text-secondary)" }}>Envío</span>
                  <span style={{ color: "var(--success)", fontWeight: 600, fontSize: 13 }}>Gratis</span>
                </div>
              )}
              {ticket.surcharge > 0 && (
                <div className="receipt-total-row" style={{ color: "var(--warning)" }}>
                  <span>Recargo</span>
                  <span className="mono" style={{ fontWeight: 500 }}>+{money(ticket.surcharge)}</span>
                </div>
              )}
              <div className="receipt-total-row">
                <span style={{ color: "var(--text-secondary)" }}>IGV (18%)</span>
                <span className="mono" style={{ fontWeight: 500, color: "var(--text-secondary)" }}>
                  {money(ticket.igv || (ticket.total - (ticket.subtotal || ticket.total) / 1.18))}
                </span>
              </div>
              <div className="receipt-total-final">
                <span style={{ fontWeight: 700, color: "var(--text-primary)" }}>TOTAL</span>
                <span className="mono" style={{ fontSize: 22, fontWeight: 700, color: "var(--brand)" }}>
                  {money(ticket.total)}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="receipt-footer">
              <p style={{ fontSize: 13, color: "var(--text-muted)", fontWeight: 500 }}>
                ¡Gracias por su preferencia!
              </p>
              <p className="mono" style={{ fontSize: 10, color: "var(--text-faint)", marginTop: 8 }}>
                Ticket #{String(ticket.id).slice(-6)}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: "0 24px 24px", display: "flex", gap: 12 }}>
          <button onClick={onClose} className="btn btn-secondary" style={{ flex: 1, padding: "12px 0" }}>
            Cerrar
          </button>
          <button className="btn btn-primary" style={{ flex: 1, padding: "12px 0" }}
            onClick={() => window.print()}>
            <Icons.printer size={16} /> Imprimir
          </button>
        </div>
      </div>
    </div>
  );
};