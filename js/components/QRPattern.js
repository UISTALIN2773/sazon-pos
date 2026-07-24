// ══════════════════════════════════════════════════════════════════════
// SazónPOS — QR Pattern Component
// ══════════════════════════════════════════════════════════════════════

const QRPattern = ({ size = 160 }) => {
  const [cells] = React.useState(() => {
    let seed = 137;
    const rand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    return Array.from({ length: 121 }, () => rand() > 0.52);
  });

  return (
    <div className="qr-panel" style={{ width: size, height: size, padding: 12 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(11, 1fr)", gap: 2, width: "100%", height: "100%" }}>
        {cells.map((on, i) => (
          <div key={i} style={{
            borderRadius: 2,
            background: on ? "var(--text-primary)" : "transparent",
            transition: "all 0.5s"
          }} />
        ))}
      </div>
      <div style={{
        position: "absolute", left: 12, right: 12, height: 2,
        background: "linear-gradient(to right, transparent, rgba(255,79,0,0.4), transparent)",
        animation: "scan 3s ease-in-out infinite"
      }} />
    </div>
  );
};