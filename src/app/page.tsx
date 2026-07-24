"use client";
import React, { useState, useMemo, useEffect } from "react";
import { 
  Plus, Minus, Trash2, QrCode, Banknote, Receipt, Download, 
  CheckCircle2, X, ChefHat, Search, Bell, User, LayoutGrid, 
  Store, UtensilsCrossed, Settings, PieChart, ShoppingBag
} from "lucide-react";

// Datos base
const MENU = [
  { id: 1, cat: "Entradas", name: "Causa Limeña", desc: "Papa amarilla, ají amarillo, pollo, palta", price: 18, img: "🥔" },
  { id: 2, cat: "Entradas", name: "Papa a la Huancaína", desc: "Papas con salsa de ají amarillo y queso", price: 15, img: "🧀" },
  { id: 3, cat: "Entradas", name: "Anticuchos de Corazón", desc: "Brochetas de corazón de res a la parrilla", price: 20, img: "🍢" },
  { id: 4, cat: "Fondos", name: "Lomo Saltado", desc: "Lomo de res salteado, papas fritas y arroz", price: 32, img: "🥩" },
  { id: 5, cat: "Fondos", name: "Ají de Gallina", desc: "Pollo deshilachado en crema de ají amarillo", price: 26, img: "🍗" },
  { id: 6, cat: "Fondos", name: "Arroz con Pollo", desc: "Arroz verde con pollo y salsa criolla", price: 24, img: "🍛" },
  { id: 7, cat: "Fondos", name: "Chicharrón de Pescado", desc: "Pescado frito, yuca y salsa criolla", price: 28, img: "🐟" },
  { id: 8, cat: "Fondos", name: "Tallarín Saltado", desc: "Tallarines salteados estilo chifa con carne", price: 25, img: "🍝" },
  { id: 9, cat: "Fondos", name: "Rocoto Relleno", desc: "Rocoto relleno de carne, gratinado", price: 22, img: "🌶️" },
  { id: 10, cat: "Bebidas", name: "Chicha Morada", desc: "Maíz morado, frutas y especias", price: 8, img: "🥤" },
  { id: 11, cat: "Bebidas", name: "Inca Kola", desc: "Gaseosa peruana 500 ml", price: 6, img: "🍾" },
  { id: 12, cat: "Bebidas", name: "Pisco Sour", desc: "Pisco, limón, jarabe de goma, clara", price: 18, img: "🍸" },
  { id: 13, cat: "Postres", name: "Suspiro a la Limeña", desc: "Manjar blanco y merengue al oporto", price: 12, img: "🍮" },
  { id: 14, cat: "Postres", name: "Picarones", desc: "Buñuelos de zapallo y camote, miel de chancaca", price: 10, img: "🍩" },
  { id: 15, cat: "Postres", name: "Mazamorra Morada", desc: "Postre de maíz morado con frutas", price: 9, img: "🥣" },
];

const CATEGORIES = ["Todos", "Entradas", "Fondos", "Bebidas", "Postres"]; 
const money = (n: number) => `S/ ${n.toFixed(2)}`;

// Generador de QR estético
function QRPattern() {
  const seed = 137;
  let s = seed;
  const rand = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  const cells = Array.from({ length: 121 }, () => rand() > 0.52);
  
  return (
    <div className="relative grid grid-cols-11 gap-[2px] w-40 h-40 bg-white p-2 rounded-xl shadow-lg border border-gray-100 overflow-hidden group">
      {cells.map((on, i) => (
        <div key={i} className={`rounded-sm transition-all duration-500 ${on ? "bg-slate-800" : "bg-transparent"}`} />
      ))}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF4F00]/20 to-transparent h-10 w-full animate-scan" />
    </div>
  );
}

export default function EnterprisePOS() {
  const [order, setOrder] = useState<any[]>([]); 
  const [category, setCategory] = useState("Todos"); 
  const [method, setMethod] = useState("Efectivo"); 
  const [cashInput, setCashInput] = useState(""); 
  const [qrConfirmed, setQrConfirmed] = useState(false); 
  const [ventas, setVentas] = useState<any[]>([]); 
  const [flash, setFlash] = useState<any>(null); 
  const [demoMsg, setDemoMsg] = useState(false); 
  
  // Nuevos estados para UX
  const [search, setSearch] = useState("");
  const [orderType, setOrderType] = useState("Salón");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Lógica de filtrado mejorada
  const filtered = useMemo(() => {
    let result = MENU;
    if (category !== "Todos") result = result.filter((m) => m.cat === category);
    if (search) result = result.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));
    return result;
  }, [category, search]);

  // Lógica del carrito
  const addItem = (item: any) => {
    setOrder((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + 1 } : p));
      return [...prev, { ...item, qty: 1 }];
    });
  };
  
  const decItem = (id: number) => {
    setOrder((prev) => prev.map((p) => (p.id === id ? { ...p, qty: p.qty - 1 } : p)).filter((p) => p.qty > 0));
  };
  
  const removeItem = (id: number) => setOrder((prev) => prev.filter((p) => p.id !== id));
  
  const clearOrder = () => {
    setOrder([]); setCashInput(""); setQrConfirmed(false);
  };

  // Cálculos financieros
  const subtotal = useMemo(() => order.reduce((s, p) => s + p.price * p.qty, 0), [order]);
  const total = subtotal;
  const opGravada = total / 1.18;
  const igv = total - opGravada;
  const received = parseFloat(cashInput || "0");
  const vuelto = received - total;
  const readyToCharge = order.length > 0 && ((method === "Efectivo" && received >= total && total > 0) || (method === "QR" && qrConfirmed)); 

  const cobrar = () => {
    if (!readyToCharge) return;
    const ticket = {
      id: Date.now(),
      items: order,
      total,
      method,
      type: orderType,
      time: new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit" }), 
    };
    setVentas((v) => [ticket, ...v]); 
    setFlash(ticket); 
    clearOrder(); 
    setTimeout(() => setFlash(null), 4000); 
  };

  const totalCaja = ventas.reduce((s, v) => s + v.total, 0); 

  return (
    <div className={`min-h-screen bg-[#F8FAFC] text-slate-800 font-sans transition-opacity duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Estilos inyectados para "Cinematografía" */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;700&display=swap');
        body { font-family: 'Inter', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scan {
          0% { transform: translateY(-100%); }
          50% { transform: translateY(300%); }
          100% { transform: translateY(-100%); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fade-up { animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-scan { animation: scan 2.5s cubic-bezier(0.4, 0, 0.2, 1) infinite; }
        .animate-slide-right { animation: slideInRight 0.3s ease-out forwards; }
        
        /* Scrollbar styling */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="flex h-screen overflow-hidden">
        
        {/* SIDEBAR MOCKUP (Visión Empresarial) */}
        <aside className="w-20 lg:w-64 bg-slate-900 text-slate-300 flex flex-col justify-between py-6 transition-all duration-300 z-20">
          <div>
            <div className="flex items-center justify-center lg:justify-start lg:px-6 mb-10 text-white">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF4F00] to-[#E63900] flex items-center justify-center shadow-lg shadow-[#FF4F00]/30">
                <ChefHat size={22} className="text-white" />
              </div>
              <span className="hidden lg:block ml-3 font-bold text-xl tracking-tight">Sazón<span className="text-[#FF4F00]">POS</span></span>
            </div>
            <nav className="space-y-2 px-3">
              {[
                { icon: LayoutGrid, label: "Punto de Venta", active: true },
                { icon: UtensilsCrossed, label: "Mesas" },
                { icon: ShoppingBag, label: "Delivery" },
                { icon: PieChart, label: "Reportes" },
                { icon: Settings, label: "Configuración" },
              ].map((item, i) => (
                <button key={i} className={`w-full flex items-center justify-center lg:justify-start px-3 py-3 rounded-xl transition-all ${item.active ? "bg-[#FF4F00]/10 text-[#FF4F00] font-medium" : "hover:bg-slate-800 hover:text-white"}`}>
                  <item.icon size={20} />
                  <span className="hidden lg:block ml-3 text-sm">{item.label}</span>
                </button>
              ))}
            </nav>
          </div>
          <div className="px-4">
            <div className="bg-slate-800 rounded-xl p-3 flex items-center justify-center lg:justify-start cursor-pointer hover:bg-slate-700 transition-colors">
              <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-white"><User size={16}/></div>
              <div className="hidden lg:block ml-3">
                <p className="text-sm text-white font-medium">Admin Demo</p>
                <p className="text-xs text-slate-400">Caja Principal</p>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col h-full bg-[#F8FAFC] relative">
          
          {/* Topbar */}
          <header className="h-20 bg-white border-b border-slate-200 px-6 flex items-center justify-between z-10 shrink-0">
            <div className="flex items-center bg-slate-100 rounded-full px-4 py-2.5 w-72 border border-slate-200 focus-within:border-[#FF4F00] focus-within:bg-white focus-within:shadow-sm focus-within:ring-2 ring-[#FF4F00]/20 transition-all">
              <Search size={18} className="text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar plato o bebida..." 
                className="bg-transparent border-none outline-none ml-2 text-sm w-full text-slate-700 placeholder-slate-400"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Caja Actual</p>
                <p className="font-mono text-xl font-bold text-emerald-600">{money(totalCaja)}</p>
              </div>
              <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors bg-slate-100 rounded-full">
                <Bell size={20} />
                <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </button>
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            
            {/* Menu Area */}
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
              
              {/* Order Types */}
              <div className="flex gap-3 mb-8">
                {["Salón", "Para Llevar", "Delivery"].map(type => (
                  <button 
                    key={type}
                    onClick={() => setOrderType(type)}
                    className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-sm flex items-center gap-2 ${orderType === type ? "bg-slate-900 text-white shadow-slate-900/20 translate-y-[-2px]" : "bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"}`}
                  >
                    {type === "Salón" ? <Store size={16}/> : type === "Para Llevar" ? <ShoppingBag size={16}/> : <UtensilsCrossed size={16}/>}
                    {type}
                  </button>
                ))}
              </div>

              {/* Categories */}
              <div className="flex gap-2 overflow-x-auto pb-4 mb-6 hide-scrollbar">
                {CATEGORIES.map((c) => ( 
                  <button
                    key={c}
                    onClick={() => setCategory(c)} 
                    className={`px-5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                      category === c
                        ? "bg-[#FF4F00] text-white shadow-lg shadow-[#FF4F00]/30 scale-105" 
                        : "bg-white text-slate-600 border border-slate-200 hover:border-[#FF4F00]/50 hover:text-[#FF4F00]"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Products Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 pb-20">
                {filtered.map((item, index) => (
                  <button
                    key={item.id} 
                    onClick={() => addItem(item)} 
                    style={{ animationDelay: `${index * 0.05}s` }}
                    className="animate-fade-up opacity-0 flex flex-col text-left bg-white rounded-2xl p-4 border border-slate-200 hover:border-[#FF4F00] hover:shadow-xl hover:shadow-[#FF4F00]/10 transition-all duration-300 group hover:-translate-y-1 relative overflow-hidden"
                  >
                    <div className="text-4xl mb-3 bg-slate-50 w-16 h-16 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform duration-300">{item.img}</div>
                    <div className="flex items-start justify-between gap-2 w-full">
                      <h3 className="font-semibold text-slate-800 leading-tight">{item.name}</h3>
                    </div>
                    <p className="text-xs text-slate-500 mt-1.5 leading-snug line-clamp-2 flex-1">{item.desc}</p>
                    <div className="flex items-center justify-between w-full mt-4">
                       <p className="font-mono text-[#FF4F00] font-bold text-lg">{money(item.price)}</p>
                       <span className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-[#FF4F00] group-hover:text-white flex items-center justify-center transition-colors">
                        <Plus size={16} />
                      </span>
                    </div>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <div className="col-span-full py-12 text-center text-slate-400">
                    <Search size={40} className="mx-auto mb-4 opacity-50" />
                    <p>No se encontraron resultados para "{search}"</p>
                  </div>
                )}
              </div>
            </div>

            {/* ORDER TICKET (Right Sidebar) */}
            <div className="w-[380px] bg-white border-l border-slate-200 flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.02)] z-10">
              
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div>
                  <h2 className="font-bold text-xl text-slate-800">Orden Actual</h2>
                  <p className="text-xs text-slate-500 font-medium">{orderType} • Mesa --</p>
                </div>
                {order.length > 0 && ( 
                  <button onClick={clearOrder} className="text-xs font-medium text-red-500 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-full transition-colors flex items-center gap-1">
                    <Trash2 size={14} /> Vaciar
                  </button> 
                )}
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {order.length === 0 ? ( 
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                    <Receipt size={48} className="opacity-20" />
                    <p className="text-sm font-medium">La orden está vacía</p>
                  </div> 
                ) : (
                  order.map((p) => (
                    <div key={p.id} className="animate-slide-right flex items-center justify-between group p-3 -mx-3 rounded-xl hover:bg-slate-50 transition-colors">
                      <div className="flex-1 pr-3">
                        <p className="font-medium text-slate-800 leading-tight text-sm">{p.name}</p>
                        <p className="text-slate-500 text-xs font-mono mt-0.5">{money(p.price)} c/u</p>
                      </div>
                      <div className="flex items-center bg-white border border-slate-200 rounded-lg shadow-sm">
                        <button onClick={() => decItem(p.id)} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-[#FF4F00] hover:bg-[#FF4F00]/10 rounded-l-lg transition-colors"><Minus size={14} /></button>
                        <span className="w-6 text-center font-mono text-sm font-semibold text-slate-800">{p.qty}</span>
                        <button onClick={() => addItem(p)} className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-[#FF4F00] hover:bg-[#FF4F00]/10 rounded-r-lg transition-colors"><Plus size={14} /></button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Checkout Section */}
              <div className="bg-slate-50 p-6 border-t border-slate-200">
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-slate-500 text-sm"><span>Op. Gravada</span><span className="font-mono">{money(opGravada)}</span></div>
                  <div className="flex justify-between text-slate-500 text-sm"><span>IGV (18%)</span><span className="font-mono">{money(igv)}</span></div>
                  <div className="flex justify-between text-slate-800 font-bold text-lg pt-2 border-t border-slate-200 border-dashed mt-2">
                    <span>Total a Pagar</span>
                    <span className="font-mono text-[#FF4F00] text-2xl">{money(total)}</span>
                  </div>
                </div>

                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Método de Pago</p>
                
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <button onClick={() => { setMethod("Efectivo"); setQrConfirmed(false); }} className={`py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 border transition-all ${method === "Efectivo" ? "bg-slate-900 text-white border-slate-900 shadow-md" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>
                    <Banknote size={16} /> Efectivo
                  </button>
                  <button onClick={() => { setMethod("QR"); setCashInput(""); }} className={`py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 border transition-all ${method === "QR" ? "bg-slate-900 text-white border-slate-900 shadow-md" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"}`}>
                    <QrCode size={16} /> Digital
                  </button>
                </div>

                {/* Sub-paneles de pago con animaciones */}
                <div className="min-h-[100px]">
                  {method === "Efectivo" && (
                    <div className="animate-fade-up bg-white p-3 rounded-xl border border-slate-200">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono">S/</span>
                        <input type="number" value={cashInput} onChange={(e) => setCashInput(e.target.value)} placeholder="0.00" className="w-full bg-slate-50 border-none rounded-lg pl-8 pr-3 py-2.5 font-mono text-lg font-semibold focus:outline-none focus:ring-2 ring-[#FF4F00]/20 transition-all" />
                      </div>
                      {cashInput !== "" && (
                        <div className={`mt-3 p-2 rounded-lg text-sm font-medium flex justify-between items-center ${vuelto >= 0 ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                          <span>{vuelto >= 0 ? "Vuelto" : "Faltante"}</span>
                          <span className="font-mono text-lg">{money(Math.abs(vuelto))}</span>
                        </div>
                      )}
                    </div>
                  )}
                  {method === "QR" && (
                    <div className="animate-fade-up flex flex-col items-center bg-white p-4 rounded-xl border border-slate-200">
                      <QRPattern />
                      {!qrConfirmed ? (
                        <button onClick={() => setQrConfirmed(true)} className="mt-4 px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium rounded-full transition-colors">
                          Simular Pago (Demo)
                        </button>
                      ) : (
                        <div className="mt-4 flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-full text-sm font-semibold animate-fade-up">
                          <CheckCircle2 size={16} /> Pago exitoso
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={cobrar}
                  disabled={!readyToCharge}
                  className={`w-full mt-4 py-4 rounded-xl text-base font-bold tracking-wide transition-all duration-300 shadow-lg flex items-center justify-center gap-2 ${
                    readyToCharge ? "bg-gradient-to-r from-[#FF4F00] to-[#E63900] text-white hover:shadow-[#FF4F00]/30 hover:-translate-y-0.5" : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                  }`}
                >
                  Cobrar {order.length > 0 ? money(total) : ""}
                </button>
              </div>
            </div>
          </div>

          {/* Flash Messages (Toast Notification Simulator) */}
          {flash && ( 
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded-2xl pl-4 pr-6 py-3 shadow-2xl flex items-center gap-3 animate-fade-up z-50 border border-slate-700">
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <p className="font-semibold text-sm">Venta Registrada</p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">{flash.method} • {money(flash.total)} • {flash.type}</p>
              </div>
            </div>
          )}

          {/* Bottom Demo Banner */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur-md border border-slate-200 px-6 py-2.5 rounded-full shadow-lg flex items-center gap-4 z-40">
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF4F00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#FF4F00]"></span>
            </span>
            <p className="text-sm font-medium text-slate-600">
              Demo Empresarial • Modo Presentación
            </p>
            <div className="w-px h-4 bg-slate-300"></div>
            <button onClick={() => { setDemoMsg(true); setTimeout(() => setDemoMsg(false), 2500); }} className="text-xs font-bold text-[#FF4F00] hover:text-[#E63900] transition-colors relative">
              Descargar Dossier
              {demoMsg && <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap animate-fade-up pointer-events-none">Suscripción requerida</span>}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
