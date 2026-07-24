// ══════════════════════════════════════════════════════════════════════
// SazónPOS — Data Constants
// ══════════════════════════════════════════════════════════════════════

const MENU = [
  { id: 1, cat: "Entradas", name: "Causa Limeña", desc: "Papa amarilla, ají amarillo, pollo, palta", price: 18, emoji: "🥔", rating: 4.8, popular: true },
  { id: 2, cat: "Entradas", name: "Papa a la Huancaína", desc: "Papas con salsa de ají amarillo y queso", price: 15, emoji: "🧀", rating: 4.6 },
  { id: 3, cat: "Entradas", name: "Anticuchos de Corazón", desc: "Brochetas de corazón de res a la parrilla", price: 20, emoji: "🍢", rating: 4.9, popular: true },
  { id: 4, cat: "Entradas", name: "Tiradito", desc: "Pescado crudo en salsa de ají amarillo", price: 22, emoji: "🐟", rating: 4.7 },
  { id: 5, cat: "Entradas", name: "Solterito", desc: "Ensalada de frijoles, queso, choclo, tomate", price: 14, emoji: "🥗", rating: 4.5 },
  { id: 6, cat: "Fondos", name: "Lomo Saltado", desc: "Lomo de res salteado, papas fritas y arroz", price: 32, emoji: "🥩", rating: 4.9, popular: true },
  { id: 7, cat: "Fondos", name: "Ají de Gallina", desc: "Pollo deshilachado en crema de ají amarillo", price: 26, emoji: "🍗", rating: 4.7 },
  { id: 8, cat: "Fondos", name: "Arroz con Pollo", desc: "Arroz verde con pollo y salsa criolla", price: 24, emoji: "🍛", rating: 4.6 },
  { id: 9, cat: "Fondos", name: "Chicharrón de Pescado", desc: "Pescado frito, yuca y salsa criolla", price: 28, emoji: "🐡", rating: 4.8 },
  { id: 10, cat: "Fondos", name: "Tallarín Saltado", desc: "Tallarines salteados estilo chifa con carne", price: 25, emoji: "🍝", rating: 4.5 },
  { id: 11, cat: "Fondos", name: "Rocoto Relleno", desc: "Rocoto relleno de carne, gratinado", price: 22, emoji: "🌶️", rating: 4.4 },
  { id: 12, cat: "Fondos", name: "Ceviche Mixto", desc: "Pescado, calamar, langostinos, leche de tigre", price: 35, emoji: "🦐", rating: 4.9, popular: true },
  { id: 13, cat: "Fondos", name: "Seco de Cordero", desc: "Cordero guisado con cilantro y frejoles", price: 30, emoji: "🍖", rating: 4.7 },
  { id: 14, cat: "Bebidas", name: "Chicha Morada", desc: "Maíz morado, frutas y especias", price: 8, emoji: "🥤", rating: 4.6 },
  { id: 15, cat: "Bebidas", name: "Inca Kola", desc: "Gaseosa peruana 500 ml", price: 6, emoji: "🍾", rating: 4.3 },
  { id: 16, cat: "Bebidas", name: "Pisco Sour", desc: "Pisco, limón, jarabe de goma, clara", price: 18, emoji: "🍸", rating: 4.9, popular: true },
  { id: 17, cat: "Bebidas", name: "Maracuyá Sour", desc: "Pisco, maracuyá, jarabe, clara", price: 20, emoji: "🍹", rating: 4.8 },
  { id: 18, cat: "Bebidas", name: "Agua Mineral", desc: "San Luis 625 ml", price: 4, emoji: "💧", rating: 4.0 },
  { id: 19, cat: "Postres", name: "Suspiro a la Limeña", desc: "Manjar blanco y merengue al oporto", price: 12, emoji: "🍮", rating: 4.8 },
  { id: 20, cat: "Postres", name: "Picarones", desc: "Buñuelos de zapallo y camote, miel de chancaca", price: 10, emoji: "🍩", rating: 4.7 },
  { id: 21, cat: "Postres", name: "Mazamorra Morada", desc: "Postre de maíz morado con frutas", price: 9, emoji: "🥣", rating: 4.5 },
  { id: 22, cat: "Postres", name: "Tres Leches", desc: "Pastel bañado en tres leches", price: 14, emoji: "🍰", rating: 4.9 },
];

const CATEGORIES = [
  { id: "Todos", emoji: "🍽️" },
  { id: "Entradas", emoji: "🥗" },
  { id: "Fondos", emoji: "🍖" },
  { id: "Bebidas", emoji: "🍹" },
  { id: "Postres", emoji: "🍰" },
];

const TABLES = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: `Mesa ${i + 1}`,
  status: i < 3 ? "ocupada" : i < 5 ? "reservada" : "libre",
  capacity: i % 3 === 0 ? 4 : i % 3 === 1 ? 2 : 6,
  order: i < 3 ? Math.floor(Math.random() * 3) + 1 : 0,
}));

const DELIVERY_CONFIG = {
  fee: 5.00,
  minimumOrder: 30,
  surcharge: 3.00,
  freeDeliveryThreshold: 80,
  estimatedTime: "30-45 min",
  riders: ["Juan P.", "Luis M.", "Carlos R.", "Miguel A."],
};

const COUPONS = {
  "SAZON10": { type: "percent", value: 10, label: "10% de descuento" },
  "HAPPY20": { type: "percent", value: 20, label: "20% de descuento" },
  "FIESTA": { type: "fixed", value: 15, label: "S/ 15.00 de descuento" },
  "NUEVO": { type: "percent", value: 25, label: "25% bienvenida" },
};

const DELIVERY_ORDERS = [
  { id: 1, client: "María García", phone: "+51 999 123 456", address: "Av. Javier Prado 1234, Surco", items: [{ name: "Lomo Saltado", qty: 2, price: 32 }, { name: "Chicha Morada", qty: 1, price: 8 }], subtotal: 72, deliveryFee: 0, surcharge: 0, total: 72, status: "entregado", time: "12:30", rider: "Juan P.", notes: "" },
  { id: 2, client: "Carlos Ruiz", phone: "+51 999 789 012", address: "Jr. de la Unión 456, Cercado", items: [{ name: "Ceviche Mixto", qty: 1, price: 35 }, { name: "Pisco Sour", qty: 2, price: 18 }], subtotal: 71, deliveryFee: 0, surcharge: 0, total: 71, status: "enviado", time: "13:15", rider: "Luis M.", notes: "Sin cebolla en el ceviche" },
  { id: 3, client: "Ana Torres", phone: "+51 999 345 678", address: "Calle Los Olivos 789, San Isidro", items: [{ name: "Ají de Gallina", qty: 3, price: 26 }, { name: "Inca Kola", qty: 1, price: 6 }], subtotal: 84, deliveryFee: 0, surcharge: 0, total: 84, status: "preparando", time: "13:45", rider: null, notes: "Extra ají por favor" },
  { id: 4, client: "Pedro Sánchez", phone: "+51 999 901 234", address: "Av. La Marina 321, San Miguel", items: [{ name: "Causa Limeña", qty: 1, price: 18 }, { name: "Tallarín Saltado", qty: 1, price: 25 }], subtotal: 43, deliveryFee: 5, surcharge: 0, total: 48, status: "pendiente", time: "14:00", rider: null, notes: "" },
];

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "pos", label: "Punto de Venta" },
  { id: "tables", label: "Mesas" },
  { id: "delivery", label: "Delivery" },
  { id: "history", label: "Historial" },
  { id: "settings", label: "Configuración" },
];

const money = (n) => `S/ ${n.toFixed(2)}`;