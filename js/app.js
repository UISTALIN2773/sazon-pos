// ══════════════════════════════════════════════════════════════════════
// SazónPOS — Main Application
// ══════════════════════════════════════════════════════════════════════

const App = () => {
  const [page, setPage] = React.useState("pos");
  const [ventas, setVentas] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("sazon_ventas")) || []; } catch { return []; }
  });
  const [toast, setToast] = React.useState(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(() => {
    try { return localStorage.getItem("sazon_sidebar") === "true"; } catch { return false; }
  });
  const [notifications, setNotifications] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem("sazon_notifications")) || []; } catch { return []; }
  });
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(new Date());
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  // Persist state
  React.useEffect(() => { localStorage.setItem("sazon_ventas", JSON.stringify(ventas)); }, [ventas]);
  React.useEffect(() => { localStorage.setItem("sazon_sidebar", String(sidebarCollapsed)); }, [sidebarCollapsed]);
  React.useEffect(() => { localStorage.setItem("sazon_notifications", JSON.stringify(notifications)); }, [notifications]);

  // Clock
  React.useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Online status
  React.useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  React.useEffect(() => { setIsLoaded(true); }, []);

  const addNotification = React.useCallback((title, desc, icon = "💰") => {
    const n = { id: Date.now(), title, desc, icon, time: new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }), read: false };
    setNotifications(prev => [n, ...prev].slice(0, 20));
  }, []);

  const markAllRead = React.useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const showToast = React.useCallback((message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  }, []);

  const handleSale = React.useCallback((ticket) => {
    setVentas(prev => [ticket, ...prev]);
    showToast(`Venta registrada · ${money(ticket.total)}`);
    addNotification("Nueva venta", `${ticket.method} · ${money(ticket.total)} · ${ticket.items.length} items`, "💰");
  }, [showToast, addNotification]);

  const handleTableChange = React.useCallback((tableId, newStatus) => {
    addNotification("Mesa actualizada", `Mesa ${tableId} → ${newStatus}`, "🪑");
  }, [addNotification]);

  const handleDeliveryUpdate = React.useCallback((orderId, newStatus) => {
    addNotification("Delivery actualizado", `Pedido #${orderId} → ${newStatus}`, "🛵");
  }, [addNotification]);

  const handleNewDelivery = React.useCallback((order) => {
    addNotification("Nuevo delivery", `${order.client} · ${money(order.total)}`, "📱");
  }, [addNotification]);

  const clearAllData = React.useCallback(() => {
    localStorage.removeItem("sazon_ventas");
    localStorage.removeItem("sazon_notifications");
    localStorage.removeItem("sazon_sidebar");
    setVentas([]);
    setNotifications([]);
    showToast("Datos limpiados", "info");
  }, [showToast]);

  const totalCaja = ventas.reduce((s, v) => s + v.total, 0);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Keyboard shortcuts
  React.useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        setShowNotifications(false);
      }
      if (e.key === "F4") {
        e.preventDefault();
        // Clear order dispatched via custom event
        window.dispatchEvent(new CustomEvent("pos-clear-order"));
      }
      if (e.ctrlKey && e.key === "f") {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent("pos-focus-search"));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

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
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
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

              {/* Notifications */}
              <div style={{ position: "relative" }}>
                <button className="topbar-bell" onClick={() => { setShowNotifications(!showNotifications); if (!showNotifications) markAllRead(); }}>
                  <Icons.bell size={18} />
                  {unreadCount > 0 && (
                    <span className="topbar-bell-badge">{Math.min(unreadCount, 9)}</span>
                  )}
                </button>
                {showNotifications && (
                  <div className="notification-dropdown animate-fade-up">
                    <div className="notification-dropdown-header">
                      <span style={{ fontWeight: 700, fontSize: 14, color: "var(--text-primary)" }}>Notificaciones</span>
                      {notifications.length > 0 && (
                        <button onClick={() => setNotifications([])} style={{ fontSize: 12, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
                          Limpiar
                        </button>
                      )}
                    </div>
                    <div className="notification-dropdown-list">
                      {notifications.length === 0 ? (
                        <div className="notification-empty">Sin notificaciones</div>
                      ) : (
                        notifications.slice(0, 8).map(n => (
                          <div key={n.id} className="notification-item">
                            <div className="notification-item-icon" style={{ background: "var(--bg-slate-50)" }}>{n.icon}</div>
                            <div className="notification-item-text">
                              <div className="notification-item-title">{n.title}</div>
                              <div className="notification-item-desc">{n.desc}</div>
                              <div className="notification-item-time">{n.time}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          <div style={{ flex: 1, overflow: "hidden", display: "flex" }}>
            {page === "dashboard" && <div style={{ flex: 1, overflowY: "auto" }}><Dashboard ventas={ventas} /></div>}
            {page === "pos" && <POSPage onSale={handleSale} />}
            {page === "tables" && <div style={{ flex: 1, overflowY: "auto" }}><TablesPage onTableChange={handleTableChange} /></div>}
            {page === "delivery" && <div style={{ flex: 1, overflowY: "auto" }}><DeliveryPage onDeliveryUpdate={handleDeliveryUpdate} onNewDelivery={handleNewDelivery} /></div>}
            {page === "history" && <div style={{ flex: 1, overflowY: "auto" }}><HistoryPage ventas={ventas} /></div>}
            {page === "settings" && <div style={{ flex: 1, overflowY: "auto" }}><SettingsPage onClearData={clearAllData} /></div>}
          </div>
        </main>

        {/* Bottom Bar */}
        <div className="bottom-bar">
          <div className="bottom-bar-section">
            <div className="bottom-bar-item">
              <div className="bottom-bar-dot" style={{ background: isOnline ? "#34D399" : "#F87171", boxShadow: isOnline ? "0 0 6px rgba(52,211,153,0.4)" : "0 0 6px rgba(248,113,113,0.4)" }}></div>
              {isOnline ? "En línea" : "Sin conexión"}
            </div>
            <div className="bottom-bar-item">
              <Icons.clock size={12} />
              <span className="mono">{currentTime.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
            </div>
          </div>
          <div className="bottom-bar-section">
            <div className="bottom-bar-item">
              <Icons.keyboard size={12} />
              <span className="bottom-bar-kbd">F4</span> Limpiar
              <span className="bottom-bar-kbd">Ctrl+F</span> Buscar
              <span className="bottom-bar-kbd">Esc</span> Cerrar
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div className="toast-container">
        {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      </div>
    </div>
  );
};

// Mount
ReactDOM.createRoot(document.getElementById("root")).render(<App />);