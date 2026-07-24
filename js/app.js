// ══════════════════════════════════════════════════════════════════════
// SazónPOS — Main Application
// ══════════════════════════════════════════════════════════════════════

const App = () => {
  const [page, setPage] = React.useState("pos");
  const [ventas, setVentas] = React.useState([]);
  const [toast, setToast] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  React.useEffect(() => { setIsLoaded(true); }, []);

  const showToast = React.useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const handleSale = React.useCallback((ticket) => {
    setVentas(prev => [ticket, ...prev]);
    showToast(`Venta registrada · ${money(ticket.total)}`);
  }, [showToast]);

  const totalCaja = ventas.reduce((s, v) => s + v.total, 0);

  const iconMap = {
    dashboard: Icons.home,
    pos: Icons.grid,
    tables: Icons.store,
    delivery: Icons.truck,
    history: Icons.receipt,
    settings: Icons.settings,
  };

  return (
    <div className="app-layout" style={{ opacity: isLoaded ? 1 : 0, transition: "opacity 0.7s" }}>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div>
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              <Icons.utensils size={20} strokeWidth={2} />
            </div>
            {!sidebarCollapsed && (
              <div className="sidebar-logo-text">
                <span>Sazón</span><span>POS</span>
              </div>
            )}
          </div>

          <nav className="sidebar-nav">
            {NAV_ITEMS.map(item => {
              const NavIcon = iconMap[item.id];
              return (
                <button key={item.id} onClick={() => setPage(item.id)}
                  className={`sidebar-nav-item ${page === item.id ? "active" : ""}`}>
                  <NavIcon size={20} strokeWidth={page === item.id ? 2 : 1.75} />
                  {!sidebarCollapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-footer">
          <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="sidebar-collapse-btn">
            <Icons.chevronLeft size={18} />
          </button>
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">AD</div>
            {!sidebarCollapsed && (
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">Admin Demo</div>
                <div className="sidebar-user-role">Caja Principal</div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h2 className="topbar-title">
            {NAV_ITEMS.find(n => n.id === page)?.label}
          </h2>
          <div className="topbar-right">
            <div className="topbar-cash">
              <div className="topbar-cash-label">Caja Actual</div>
              <div className="topbar-cash-value mono">{money(totalCaja)}</div>
            </div>
            <div className="topbar-divider" />
            <button className="topbar-bell">
              <Icons.bell size={18} />
              {ventas.length > 0 && (
                <span className="topbar-bell-badge">{Math.min(ventas.length, 9)}</span>
              )}
            </button>
          </div>
        </header>

        <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
          {page === "dashboard" && <div style={{ flex: 1, overflowY: "auto" }}><Dashboard ventas={ventas} /></div>}
          {page === "pos" && <POSPage onSale={handleSale} />}
          {page === "tables" && <div style={{ flex: 1, overflowY: "auto" }}><TablesPage /></div>}
          {page === "delivery" && <div style={{ flex: 1, overflowY: "auto" }}><DeliveryPage /></div>}
          {page === "history" && <div style={{ flex: 1, overflowY: "auto" }}><HistoryPage ventas={ventas} /></div>}
          {page === "settings" && <div style={{ flex: 1, overflowY: "auto" }}><SettingsPage /></div>}
        </div>
      </main>

      {/* Toast */}
      <div className="toast-container">
        {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
};

// Mount
ReactDOM.createRoot(document.getElementById("root")).render(<App />);