// ══════════════════════════════════════════════════════════════════════
// SazónPOS — Settings Page
// ══════════════════════════════════════════════════════════════════════

const SettingsPage = ({ onClearData }) => {
  const [igvEnabled, setIgvEnabled] = React.useState(() => {
    try { return localStorage.getItem("sazon_igv") !== "false"; } catch { return true; }
  });
  const [restaurantName, setRestaurantName] = React.useState(() => {
    try { return localStorage.getItem("sazon_restaurant_name") || "Sazón Peru"; } catch { return "Sazón Peru"; }
  });
  const [ruc, setRuc] = React.useState(() => {
    try { return localStorage.getItem("sazon_ruc") || "20512345678"; } catch { return "20512345678"; }
  });
  const [address, setAddress] = React.useState(() => {
    try { return localStorage.getItem("sazon_address") || "Av. Javier Prado Este 4200, Santiago de Surco, Lima"; } catch { return "Av. Javier Prado Este 4200, Santiago de Surco, Lima"; }
  });
  const [printerType, setPrinterType] = React.useState(() => {
    try { return localStorage.getItem("sazon_printer") || "Thermal 80mm"; } catch { return "Thermal 80mm"; }
  });
  const [printerPort, setPrinterPort] = React.useState(() => {
    try { return localStorage.getItem("sazon_port") || "COM3"; } catch { return "COM3"; }
  });
  const [saved, setSaved] = React.useState(false);
  const [confirmClear, setConfirmClear] = React.useState(false);

  const save = () => {
    localStorage.setItem("sazon_igv", String(igvEnabled));
    localStorage.setItem("sazon_restaurant_name", restaurantName);
    localStorage.setItem("sazon_ruc", ruc);
    localStorage.setItem("sazon_address", address);
    localStorage.setItem("sazon_printer", printerType);
    localStorage.setItem("sazon_port", printerPort);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: 768 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Configuración</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>Personaliza tu sistema POS</p>
      </div>

      {/* Success message */}
      {saved && (
        <div className="settings-success" style={{ marginBottom: 20 }}>
          <Icons.check size={18} /> Cambios guardados correctamente
        </div>
      )}

      {/* Restaurant Info */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h3 style={{ fontWeight: 700, color: "var(--text-primary)" }}>Información del Restaurante</h3>
        </div>
        <div className="card-body">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input className="form-input" value={restaurantName} onChange={e => setRestaurantName(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">RUC</label>
              <input className="form-input mono" value={ruc} onChange={e => setRuc(e.target.value)} />
            </div>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Dirección</label>
              <input className="form-input" value={address} onChange={e => setAddress(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Printer */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h3 style={{ fontWeight: 700, color: "var(--text-primary)" }}>Impresora</h3>
        </div>
        <div className="card-body">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Tipo</label>
              <select className="form-select" value={printerType} onChange={e => setPrinterType(e.target.value)}>
                <option>Thermal 80mm</option>
                <option>Thermal 58mm</option>
                <option>Matrix</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Puerto</label>
              <input className="form-input mono" value={printerPort} onChange={e => setPrinterPort(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* IGV */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h3 style={{ fontWeight: 700, color: "var(--text-primary)" }}>Impuestos</h3>
        </div>
        <div className="card-body">
          <div className="toggle-wrapper" onClick={() => setIgvEnabled(!igvEnabled)}>
            <div className={`toggle-track ${igvEnabled ? "active" : ""}`}>
              <div className="toggle-thumb" />
            </div>
            <div>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>
                Incluir IGV (18%) automáticamente
              </span>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                Se calculará sobre cada venta
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Config */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h3 style={{ fontWeight: 700, color: "var(--text-primary)" }}>Configuración Delivery</h3>
        </div>
        <div className="card-body">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Tarifa de Envío</label>
              <input className="form-input mono" value={DELIVERY_CONFIG.fee} readOnly style={{ opacity: 0.7 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Pedido Mínimo</label>
              <input className="form-input mono" value={DELIVERY_CONFIG.minimumOrder} readOnly style={{ opacity: 0.7 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Envío Gratis Desde</label>
              <input className="form-input mono" value={DELIVERY_CONFIG.freeDeliveryThreshold} readOnly style={{ opacity: 0.7 }} />
            </div>
          </div>
          <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 8 }}>
            Estos valores están predefinidos para la demo. En producción serán editables.
          </p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="card" style={{ marginBottom: 32, border: "1px solid rgba(239, 68, 68, 0.2)" }}>
        <div className="card-header" style={{ background: "var(--error-bg)" }}>
          <h3 style={{ fontWeight: 700, color: "var(--error)" }}>Zona de Peligro</h3>
        </div>
        <div className="card-body">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>Limpiar todos los datos</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>Eliminará ventas, notificaciones y configuración</p>
            </div>
            {confirmClear ? (
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-secondary" onClick={() => setConfirmClear(false)} style={{ padding: "8px 16px" }}>Cancelar</button>
                <button className="btn" onClick={() => { onClearData(); setConfirmClear(false); }}
                  style={{ padding: "8px 16px", background: "var(--error)", color: "white", border: "none" }}>
                  Confirmar
                </button>
              </div>
            ) : (
              <button className="btn" onClick={() => setConfirmClear(true)}
                style={{ padding: "8px 16px", background: "var(--error-bg)", color: "var(--error)", border: "1px solid rgba(239,68,68,0.2)" }}>
                <Icons.trash size={14} /> Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn btn-primary" style={{ padding: "12px 32px" }} onClick={save}>
          <Icons.check size={16} /> Guardar Cambios
        </button>
      </div>
    </div>
  );
};