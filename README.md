# 🚀 LATAMCOINS

**El pulso de las crypto latinas**

Una plataforma de tracking de criptomonedas estilo CoinMarketCap, enfocada EXCLUSIVAMENTE en tokens latinoamericanos, con estética cyberpunk/Matrix y efectos glassmorphism premium.

## 🎯 Características

- **Tracking en tiempo real** de tokens latinoamericanos
- **Diseño cyberpunk/Matrix** con efectos glassmorphism
- **Interfaz responsive** optimizada para móvil y desktop
- **Gráficos interactivos** con Recharts
- **Animaciones fluidas** con Framer Motion
- **Efectos visuales** Matrix rain y partículas
- **PWA ready** para instalación en dispositivos móviles

## 🛠️ Stack Tecnológico

### Frontend
- **Next.js 14** con App Router
- **TypeScript** para tipado estático
- **TailwindCSS** para estilos
- **Framer Motion** para animaciones
- **Recharts** para gráficos
- **Lucide React** para iconos

### Blockchain/APIs
- **Solana Web3.js** para blockchain
- **DexScreener API** para datos de precios
- **Pump.fun API** para tokens
- **WebSocket** para datos en tiempo real

### Efectos Visuales
- **Three.js** para partículas 3D
- **Canvas API** para Matrix rain
- **CSS Custom Properties** para temas dinámicos

## 📦 Instalación

1. **Clona el repositorio**
```bash
git clone https://github.com/latamcoins/latamcoins.git
cd latamcoins
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura las variables de entorno**
```bash
cp .env.example .env.local
# Edita .env.local con tus API keys
```

4. **Ejecuta en modo desarrollo**
```bash
npm run dev
```

5. **Abre en el navegador**
```
http://localhost:3000
```

## 🎨 Diseño

### Paleta de Colores
- **Verde Matrix**: `#00ff41`, `#008f11`
- **Negro profundo**: `#0a0e27`, `#000000`
- **Púrpura neón**: `#a855f7`, `#d946ef`
- **Cyan eléctrico**: `#06b6d4`, `#00ffff`

### Efectos Visuales
- **Glassmorphism**: Transparencias y blur
- **Neon glow**: Efectos de brillo
- **Matrix rain**: Lluvia de código de fondo
- **Partículas**: Efectos de partículas flotantes
- **Animaciones**: Transiciones suaves y fluidas

## 📊 Tokens Soportados

Actualmente tracking de 5 tokens latinoamericanos:

1. **HOLDER (DOGGY)** - Pump.fun
2. **MAD COIN (MAD)** - Pump.fun
3. **Quira (QRA)** - Pump.fun
4. **HUMO (HUMO)** - Pump.fun
5. **Darrkito Strategic Reserve (Darrkito)** - Pump.fun

## 🚀 Deployment

### Vercel (Recomendado)

1. **Conecta tu repositorio a Vercel**
2. **Configura las variables de entorno**
3. **Deploy automático**

```bash
# Instala Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Configuración de Vercel

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "regions": ["gru1"]
}
```

## 📱 PWA

La aplicación está configurada como PWA (Progressive Web App):

- **Manifest.json** para instalación
- **Service Worker** para cache
- **Offline support** básico
- **Responsive design** optimizado

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar servidor de producción
npm start

# Linting
npm run lint

# Type checking
npm run type-check
```

## 📁 Estructura del Proyecto

```
latamcoins/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Página de inicio
│   │   ├── token/[symbol]/    # Páginas de tokens
│   │   └── globals.css        # Estilos globales
│   ├── components/            # Componentes React
│   │   ├── layout/            # Header, Footer, etc.
│   │   ├── dashboard/         # Componentes del dashboard
│   │   ├── token-detail/      # Componentes de detalle
│   │   ├── effects/           # Efectos visuales
│   │   └── ui/                # Componentes base
│   ├── lib/                   # Utilidades y configuraciones
│   │   ├── constants/         # Constantes y datos
│   │   ├── utils/             # Funciones utilitarias
│   │   └── hooks/             # Custom hooks
│   └── types/                 # Tipos de TypeScript
├── public/                    # Archivos estáticos
│   └── tokens/                # Logos de tokens
├── styles/                    # Estilos adicionales
├── next.config.js             # Configuración de Next.js
├── tailwind.config.ts         # Configuración de Tailwind
├── tsconfig.json              # Configuración de TypeScript
└── package.json               # Dependencias y scripts
```

## 🎯 Roadmap

### Fase 1 - MVP ✅
- [x] Setup Next.js + TypeScript + TailwindCSS
- [x] MatrixRain background component
- [x] Header con logo LATAMCOINS
- [x] Dashboard con tabla de 5 tokens
- [x] Datos mock funcionales
- [x] Vista detallada básica con gráfico
- [x] Glassmorphism styling
- [x] Responsive mobile
- [x] Deploy en Vercel

### Fase 2 - Integración Real
- [ ] Integración API real (DexScreener)
- [ ] WebSocket precios real-time
- [ ] TickerBar con scroll
- [ ] Búsqueda de tokens
- [ ] Sorting en tabla
- [ ] Timeframe selector en gráfico
- [ ] Efectos avanzados (partículas, glitch)

### Fase 3 - Funcionalidades Avanzadas
- [ ] Más tokens (10+)
- [ ] Página Analytics
- [ ] Favoritos (localStorage)
- [ ] Alertas de precio
- [ ] Comparador de tokens
- [ ] API pública LATAMCOINS

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Website**: [latamcoins.com](https://latamcoins.com)
- **Twitter**: [@latamcoins](https://twitter.com/latamcoins)
- **Discord**: [discord.gg/latamcoins](https://discord.gg/latamcoins)
- **GitHub**: [github.com/latamcoins](https://github.com/latamcoins)

---

**LATAMCOINS** - El pulso de las crypto latinas 🚀✨🔥