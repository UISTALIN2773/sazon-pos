// ══════════════════════════════════════════════════════════════════════
// SazónPOS — Settings Page
// ══════════════════════════════════════════════════════════════════════

const SettingsPage = () => {
  const [igvEnabled, setIgvEnabled] = React.useState(true);

  return (
    <div className="page-container animate-fade-in" style={{ maxWidth: 768 }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>Configuración</h1>
        <p style={{ color: "var(--text-muted)", fontSize: 14, marginTop: 4 }}>Personaliza tu sistema POS</p>
      </div>

      {/* Restaurant Info */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-header">
          <h3 style={{ fontWeight: 700, color: "var(--text-primary)" }}>Información del Restaurante</h3>
        </div>
        <div className="card-body">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input defaultValue="Sazón Peru" className="form-input" />
            </div>
            <div className="form-group">
              <label className="form-label">RUC</label>
              <input defaultValue="20512345678" className="form-input mono" />
            </div>
            <div className="form-group" style={{ gridColumn: "1 / -1" }}>
              <label className="form-label">Dirección</label>
              <input defaultValue="Av. Javier Prado Este 4200, Santiago de Surco, Lima" className="form-input" />
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
              <select className="form-select">
                <option>Thermal 80mm</option>
                <option>Thermal 58mm</option>
                <option>Matrix</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Puerto</label>
              <input defaultValue="COM3" className="form-input mono" />
            </div>
          </div>
        </div>
      </div>

      {/* IGV */}
      <div className="card" style={{ marginBottom: 32 }}>
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

      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button className="btn btn-primary" style={{ padding: "12px 32px" }}>
          Guardar Cambios
        </button>
      </div>
    </div>
  );
};