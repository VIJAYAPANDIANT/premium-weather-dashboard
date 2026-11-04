<div align="center">

  # 🌦️ Atmosphere
  ### Premium Glassmorphic Weather Dashboard & Atmospheric Intelligence Suite

  <p align="center">
    A sleek, zero-dependency, keyless weather analytics application engineered with vanilla web technologies. Delivers real-time atmospheric metrics, a 24-hour hourly trajectory, 7-day extended forecasts, and dynamic ambient theming across all mobile and desktop viewports.
  </p>

  <p align="center">
    <a href="https://vijayapandiant.github.io/premium-weather-dashboard/"><img src="https://img.shields.io/badge/Live%20Demo-Online-brightgreen?style=for-the-badge&logo=google-chrome&logoColor=white" alt="Live Demo" /></a>
    <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
    <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript (ES6+)" />
    <img src="https://img.shields.io/badge/Open--Meteo-Free%20API-38bdf8?style=for-the-badge&logo=icloud&logoColor=white" alt="Open-Meteo API" />
    <img src="https://img.shields.io/badge/Mobile--First-Responsive-8b5cf6?style=for-the-badge&logo=responsive&logoColor=white" alt="Responsive Design" />
  </p>

  <p align="center">
    <a href="#-key-features">Key Features</a> •
    <a href="#-live-demo">Live Demo</a> •
    <a href="#-technology-stack">Tech Stack</a> •
    <a href="#-mobile-first-experience">Mobile Experience</a> •
    <a href="#-architecture--data-flow">Data Flow</a> •
    <a href="#-getting-started">Getting Started</a> •
    <a href="#-api-reference">API Reference</a> •
    <a href="#-author--license">License</a>
  </p>

</div>

---

## 🌟 Overview

**Atmosphere** is a modern, high-performance single-page weather dashboard designed to balance visual elegance with comprehensive atmospheric reporting. Built with pure vanilla technologies without heavyweight frameworks or bundlers, Atmosphere delivers instant load times, zero API-key dependencies, and fluid responsiveness from ultra-wide monitors down to compact mobile phones.

---

## 🚀 Key Features

### 🎨 Premium Glassmorphism & Atmospheric Theming
- **Frosty Frosted Glass Design**: Layered translucent surfaces built using CSS `backdrop-filter: blur(16px)`, specular edge borders, and ambient glow shadows.
- **Dynamic Weather-Adaptive Backgrounds**: Background gradients automatically shift between 5 custom palettes reflecting live conditions: `Clear`, `Cloudy`, `Rainy`, `Snowy`, and `Thunderstorm`.
- **Typography & Icons**: Powered by Google Fonts **Outfit** and fluid **Material Symbols Rounded** iconography.

### 📱 Mobile-First Architecture & View Segment Tabs
- **Native Viewport Optimization**: Leverages `100dvh` dynamic height and `viewport-fit=cover` with `env(safe-area-inset-*)` support for devices with notches or dynamic islands.
- **Mobile Navigation Switcher**: On screens `≤ 850px`, a dedicated segmented tab navigation bar empowers users to switch instantly:
  - 🌐 **All**: Continuous scroll showing the full dashboard.
  - 🌤️ **Current**: Compact view focusing on immediate temperature, conditions, and core metrics.
  - ⏱️ **Hourly**: Expands the 24-hour timeline view.
  - 📅 **7-Day**: Focuses on extended daily forecast projections.
- **Momentum Touch Navigation**: `-webkit-overflow-scrolling: touch` combined with `overscroll-behavior-x: contain` prevents rubber-band page gestures while smoothly swiping through hourly forecasts.

### 📍 Smart Geolocation & Global Search
- **1-Tap GPS Location**: Instant device positioning via the HTML5 Geolocation API with reverse geocoding to retrieve your local forecast in a single click.
- **Smart Query Suffix Matching**: Handles nuanced queries such as `"Miami, FL"`, `"Chennai, IN"`, or `"Paris, Texas"`, prioritizing matching state and country ISO codes.
- **Quick Destination Chips**: One-tap popular location chips on the welcome panel (London, New York, Tokyo, Chennai, Paris) for immediate exploration.
- **Auto-Restore on Boot**: Saves and reloads your last queried city from `localStorage` upon reopening.

### 📊 Comprehensive Weather Analytics
- **Live Atmosphere Metrics**: Immediate real-time temperature, condition emoji, WMO description, "Feels Like" thermal index, relative humidity percentage, and wind speed.
- **24-Hour Predictive Timeline**: Continuous horizontal timeline highlighting the immediate next 24 hours with dynamic temperature labels and weather icons.
- **7-Day Extended Forecast**: Daily minimum/maximum thermal bands, conditions, and localized day labels.
- **Unified Unit Switching**: Single-click toggling between Metric (`°C`, `km/h`) and Imperial (`°F`, `mph`) units with instant re-calculation across all sections.
- **Search History Manager**: Caches up to 5 recent queries with individual deletion or bulk clearing capabilities.

---

## 📱 Mobile-First Experience

Atmosphere is built from the ground up to ensure 100% visibility on mobile devices without clipping, cutoff text, or locked scrolling:

| View Mode | Target Screen | Experience |
| :--- | :--- | :--- |
| **Desktop Layout** | `> 850px` | Synchronized two-column grid displaying all panels concurrently without vertical page scrolling. |
| **All Mode (Mobile)** | `≤ 850px` | Proportional vertical stack with optimized margins, compact metrics, and smooth touch scrolling. |
| **Current Mode** | `≤ 850px` | Zero-scroll focus mode showcasing city name, weather emoji, temperature, and 3-column metric chips. |
| **Hourly Mode** | `≤ 850px` | Focused 24-hour horizontal timeline with native inertia swiping. |
| **7-Day Mode** | `≤ 850px` | Clear list view comparing daily weather variations and thermal ranges. |

---

## 🌐 Architecture & Data Flow

Atmosphere uses an asynchronous, keyless data pipeline communicating directly with free, high-availability endpoints from [Open-Meteo](https://open-meteo.com/):

```
 ┌────────────────┐         ┌────────────────────────┐         ┌───────────────────────┐
 │  User Search   │───────▶ │ Open-Meteo Geocoding   │───────▶ │ Resolve Lat / Lon     │
 │  or GPS Loc    │         │ /v1/search             │         │ & Country / State     │
 └────────────────┘         └────────────────────────┘         └──────────┬────────────┘
                                                                          │
 ┌────────────────┐         ┌────────────────────────┐                    │
 │ DOM Render &   │◀─────── │ Open-Meteo Forecast    │◀───────────────────┘
 │ Dynamic Theme  │         │ /v1/forecast           │
 └────────────────┘         └────────────────────────┘
```

1. **Geocoding Resolution**:
   - Query parsed for admin/state modifiers.
   - Evaluates up to 10 candidates to match administrative boundaries accurately.
2. **Forecast Ingestion**:
   - Coordinates queried for live conditions (`temperature_2m`, `relative_humidity_2m`, `apparent_temperature`, `weather_code`, `wind_speed_10m`).
   - Hourly arrays fetched for the subsequent 24-hour window from the current client hour.
   - Daily arrays fetched for 7-day min/max temperatures and WMO condition codes.
3. **Client-Side Synthesis**:
   - Temperatures normalized to selected unit (°C or °F).
   - WMO weather codes translated into descriptive conditions and emojis.
   - Dynamic body class applied to morph background gradient smoothly.

---

## 🛠️ Technology Stack

| Layer | Technologies | Purpose |
| :--- | :--- | :--- |
| **Markup** | HTML5 Semantic Elements | Accessible document outline, forms, safe-area viewport configurations |
| **Styling** | Vanilla CSS3 | Modern variables, glassmorphic filters, CSS grid/flexbox, keyframe animations |
| **Scripting** | Modern JavaScript (ES6+) | Async/await fetch pipelines, Geolocation API, DOM synthesis, LocalStorage state |
| **Typography** | Google Fonts `Outfit` | Clean, modern geometrical sans-serif typography |
| **Icons** | Material Symbols Rounded | High-resolution scalable vector icons |
| **Weather APIs** | Open-Meteo APIs | Keyless Geocoding, reverse geocoding, and global forecast telemetry |

---

## 📂 Project Structure

```text
premium-weather-dashboard/
├── index.html       # Application entry point with semantic cards & navigation tabs
├── style.css        # Glassmorphic design system, media queries & dynamic theme rules
├── main.js          # Core orchestrator: API ingestion, unit math, geolocation & state
└── README.md        # Comprehensive technical documentation & project guide
```

---

## 💻 Getting Started

### Prerequisites
Atmosphere runs in any modern web browser (Chrome, Safari, Firefox, Edge, Brave). No package managers, build steps, or API keys are required.

### Local Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/VIJAYAPANDIANT/premium-weather-dashboard.git
   ```

2. **Navigate to the directory:**
   ```bash
   cd premium-weather-dashboard
   ```

3. **Run the dashboard:**
   - **Direct Browser**: Double-click `index.html` to open it locally.
   - **VS Code**: Right-click `index.html` and select **"Open with Live Server"**.
   - **Node.js**:
     ```bash
     npx serve . -l 5000
     ```
   - **Python**:
     ```bash
     python -m http.server 5000
     ```

### Testing on Your Mobile Device Over Local Wi-Fi

1. Start a local server on your computer:
   ```bash
   npx serve . -l 5000
   ```
2. Find your PC's local IP address (`ipconfig` on Windows or `ifconfig` on macOS/Linux).
3. Connect your mobile phone to the same Wi-Fi network and open:
   ```text
   http://<YOUR_PC_IP>:5000
   ```

---

## 🌐 API Reference

Atmosphere utilizes open, free, and robust endpoints from **[Open-Meteo](https://open-meteo.com/)**:

### 1. Geocoding Search
- **Endpoint**: `GET https://geocoding-api.open-meteo.com/v1/search`
- **Parameters**:
  - `name`: Target city name string (e.g., `"London"`, `"Tokyo"`)
  - `count`: Maximum candidate results (`10`)
  - `language`: Response language code (`en`)
  - `format`: Response format (`json`)

### 2. Comprehensive Forecast
- **Endpoint**: `GET https://api.open-meteo.com/v1/forecast`
- **Parameters**:
  - `latitude`, `longitude`: Coordinate floating points
  - `current`: `temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m`
  - `hourly`: `temperature_2m,weather_code`
  - `daily`: `weather_code,temperature_2m_max,temperature_2m_min`
  - `timezone`: `auto` (resolves to target location's local time)

---

## 🤝 Contributing

Contributions, feedback, and suggestions are welcome!

1. Fork the Project (`https://github.com/VIJAYAPANDIANT/premium-weather-dashboard/fork`)
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Vijayapandian T**  
- GitHub: [@VIJAYAPANDIANT](https://github.com/VIJAYAPANDIANT)  
- Email: vijayapandian112007@gmail.com  

<div align="center">
  <sub>Built with ❤️ using Vanilla Web Technologies & Open-Meteo.</sub>
</div>
