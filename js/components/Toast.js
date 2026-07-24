// ══════════════════════════════════════════════════════════════════════
// SazónPOS — Toast Component
// ══════════════════════════════════════════════════════════════════════

const Toast = ({ message, type = "success", onClose }) => {
  React.useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, []);

  const config = {
    success: { cls: "toast-success", icon: <Icons.check size={16} /> },
    error:   { cls: "toast-error",   icon: <Icons.x size={16} /> },
    info:    { cls: "toast-info",    icon: <Icons.bell size={16} /> },
  };
  const c = config[type] || config.success;

  return (
    <div className={`toast ${c.cls}`}>
      <span className="toast-icon">{c.icon}</span>
      <span style={{ fontSize: 14, fontWeight: 500, whiteSpace: "nowrap" }}>{message}</span>
    </div>
  );
};