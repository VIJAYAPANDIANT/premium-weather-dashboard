<h1 align="center">🌦️ Atmosphere - Premium Weather Dashboard</h1>

<h3 align="center">A sleek, responsive, and single-page weather analytics dashboard built with vanilla web technologies</h3>

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
</p>

**Atmosphere** is a state-of-the-art weather forecasting dashboard that provides real-time atmospheric data, hourly predictions, and 7-day insights in a gorgeous, glassmorphic layout. The application utilizes the Open-Meteo APIs for live, keyless, and accurate updates.

---

## 🚀 Key Features

*   **Sleek Glassmorphism UI**: Beautiful, premium layout utilizing Outfit typography, Material Symbols Rounded, frosty transparency, and glowing box-shadow depth.
*   **Dynamic Weather Themes**: The atmospheric background gradient changes dynamically depending on the retrieved weather conditions (Clear, Cloudy, Rainy, Snowy, or Thunderstorm).
*   **Hourly & Daily Forecasts**:
    *   **Hourly (24h)**: An elegant, horizontally scrollable timeline showing immediate temperature and weather emoji fluctuations.
    *   **7-Day Daily List**: Compact list rows comparing day, weather description, and maximum/minimum temperature bands.
*   **Smart Query Suffix Filter**: Allows looking up cities with specific administrative or country codes (e.g. `"Miami, FL"`, `"Chennai, IN"`, or `"Paris, Texas"`), automatically resolving the most relevant location.
*   **Unified Unit Switching**: Switch between metric and imperial systems (`°C` and `km/h` vs. `°F` and `mph`) instantly across all sections with a single header toggle.
*   **Search History & Cache**: Saves your 5 most recent search queries in `localStorage` for rapid selection and retrieval, featuring individual deletion and clear-all operations.
*   **One-Page Layout Optimization**: Configured to display all modules cleanly on a single screen without clipping or cropping, automatically shifting to a scrollable block on small viewports.

---

## 🛠️ Technology Stack

*   **HTML5**: Defines the structured boxes, unit switch toggles, error sections, and layout containers.
*   **Vanilla CSS3**: Builds the glassmorphic styling system using variables, gradients, backdrop-filters, custom scrollbar tracks, and CSS grid/flexbox.
*   **JavaScript (ES6+)**: Handles geocoding array matching, unit math conversions, history state loops, and DOM builders.

---

## 🌐 API Integrations

The project utilizes open, free, and robust endpoints from [Open-Meteo](https://open-meteo.com/):

1.  **[Geocoding API](https://geocoding-api.open-meteo.com/v1/search)**: Converts queries into latitude/longitude pairs and returns detailed country codes and names.
2.  **[Forecast API](https://api.open-meteo.com/v1/forecast)**: Pulls hourly and daily arrays based on coordinate coordinates.

---

## 📂 Project Structure

```text
├── index.html   # Main dashboard entry containing search, toggles, loading, and grid panels
├── style.css    # Premium style rules, fonts, weather classes, and layout media queries
├── main.js      # Core script managing API loops, unit conversions, history caching, and renders
└── preview.png  # High-definition mockup preview of the redesigned interface
```

---

## 💻 Local Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/VIJAYAPANDIANT/premium-weather-dashboard.git
    ```
2.  **Navigate to the directory:**
    ```bash
    cd premium-weather-dashboard
    ```
3.  **Run the application:**
    *   Simply double-click `index.html` to open it in your browser.
    *   Alternatively, serve it locally using standard tools like VS Code's **Live Server** extension.

---

Developed with ❤️ using Vanilla Web Technologies.
