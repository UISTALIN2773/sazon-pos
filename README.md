# SazónPOS — Sistema de Gestión para Restaurantes

Sistema completo de punto de venta para restaurantes peruanos. Demo empresarial interactiva con interfaz modular y profesional.

## Estructura del Proyecto

```
sazon-pos/
├── index.html                 # Entry point
├── css/
│   └── styles.css             # Design system & global styles
├── js/
│   ├── data.js                # Menu, tables, categories data
│   ├── icons.js               # SVG icon components
│   ├── app.js                 # Main app & state management
│   └── components/
│       ├── QRPattern.js       # QR code generator
│       ├── Toast.js           # Toast notifications
│       ├── ReceiptModal.js    # Receipt modal
│       ├── Dashboard.js       # Dashboard page
│       ├── POS.js             # Point of Sale page
│       ├── Tables.js          # Table management
│       ├── Delivery.js        # Delivery tracking
│       ├── History.js         # Sales history
│       └── Settings.js        # System settings
└── README.md
```

## Demo

Abre `index.html` en tu navegador para ver la demo completa.

## Características

- **Punto de Venta** — Menú interactivo con búsqueda y filtros por categoría
- **Dashboard** — Métricas de ventas, gráficos y platos más vendidos
- **Gestión de Mesas** — 12 mesas con estados (libre/ocupada/reservada)
- **Delivery** — Seguimiento de pedidos con estados
- **Historial de Ventas** — Registro completo con filtros por método de pago
- **Múltiples Métodos de Pago** — Efectivo, Plin, Yape (billeteras digitales)
- **Cálculo Automático de IGV** — 18% incluido
- **Generación de Tickets** — Recibo visual con detalle completo
- **Interfaz Responsiva** — Sidebar colapsable, diseño adaptable
- **Animaciones Suaves** — Transiciones y micro-interacciones profesionales

## Design System

- **CSS Variables** — Tokens de color, espaciado, sombras, radios
- **Componentes modulares** — Cada página es un componente independiente
- **Tipografía** — Inter (UI) + JetBrains Mono (números)
- **Accesibilidad** — `prefers-reduced-motion` support

## Stack

- React 18 (via CDN)
- Babel Standalone (JSX)
- CSS Custom Properties (Design Tokens)
- Google Fonts

## Licencia

MIT