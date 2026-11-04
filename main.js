// DOM Elements
const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.getElementById("cityInput");
const clearSearchBtn = document.getElementById("clearSearchBtn");
const locationBtn = document.getElementById("locationBtn");
const historyDropdown = document.getElementById("historyDropdown");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

const errorDisplay = document.getElementById("errorDisplay");
const errorMessage = document.getElementById("errorMessage");
const loadingContainer = document.getElementById("loadingContainer");
const welcomeCard = document.getElementById("welcomeCard");
const weatherDashboard = document.getElementById("weatherDashboard");
const mobileTabs = document.getElementById("mobileTabs");
const tabBtns = document.querySelectorAll(".tab-btn");
const quickCities = document.getElementById("quickCities");

const unitToggle = document.getElementById("unitToggle");
const btnCelsius = document.getElementById("btnCelsius");
const btnFahrenheit = document.getElementById("btnFahrenheit");

const cityDisplay = document.getElementById("cityDisplay");
const dateDisplay = document.getElementById("dateDisplay");
const weatherEmoji = document.getElementById("weatherEmoji");
const tempDisplay = document.getElementById("tempDisplay");
const descDisplay = document.getElementById("descDisplay");
const feelsLikeDisplay = document.getElementById("feelsLikeDisplay");
const humidityDisplay = document.getElementById("humidityDisplay");
const windDisplay = document.getElementById("windDisplay");

const hourlyTimeline = document.getElementById("hourlyTimeline");
const dailyList = document.getElementById("dailyList");

// Application State
let currentUnit = "C"; // C or F
let currentWeatherData = null; // Stores currently fetched weather response
let searchHistory = [];
let currentMobileView = "all"; // all, current, hourly, daily

// Init Application
document.addEventListener("DOMContentLoaded", () => {
    loadSearchHistory();
    setupEventListeners();
    autoLoadInitialWeather();
});

// Event Listeners Setup
function setupEventListeners() {
    // Form submission
    weatherForm.addEventListener("submit", async event => {
        event.preventDefault();
        const city = cityInput.value.trim();
        if (city) {
            await fetchAndDisplay(city);
            cityInput.blur();
        }
    });

    // Clear Search Input Button
    clearSearchBtn.addEventListener("click", () => {
        cityInput.value = "";
        clearSearchBtn.classList.remove("visible");
        cityInput.focus();
    });

    // GPS Location Button
    if (locationBtn) {
        locationBtn.addEventListener("click", () => {
            getUserLocation();
        });
    }

    // Toggle Clear button visibility based on input value
    cityInput.addEventListener("input", () => {
        if (cityInput.value.length > 0) {
            clearSearchBtn.classList.add("visible");
        } else {
            clearSearchBtn.classList.remove("visible");
        }
    });

    // Show history on input focus or click if history exists
    cityInput.addEventListener("focus", () => {
        if (searchHistory.length > 0) {
            historyDropdown.classList.add("show");
        }
    });

    cityInput.addEventListener("click", (e) => {
        e.stopPropagation();
        if (searchHistory.length > 0) {
            historyDropdown.classList.add("show");
        }
    });

    // Hide history dropdown when clicking outside
    document.addEventListener("click", (event) => {
        if (!weatherForm.contains(event.target) && !historyDropdown.contains(event.target)) {
            historyDropdown.classList.remove("show");
        }
    });

    // Clear History Button
    clearHistoryBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        clearAllHistory();
    });

    // Quick City Chips in Welcome Card
    if (quickCities) {
        quickCities.addEventListener("click", (e) => {
            const chip = e.target.closest(".chip-btn");
            if (chip && chip.dataset.city) {
                cityInput.value = chip.dataset.city;
                clearSearchBtn.classList.add("visible");
                fetchAndDisplay(chip.dataset.city);
            }
        });
    }

    // Mobile Navigation Tabs
    tabBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            const tab = btn.dataset.tab;
            setMobileView(tab);
        });
    });

    // Handle screen resize to reset mobile view when entering desktop mode
    window.addEventListener("resize", () => {
        if (window.innerWidth > 850) {
            weatherDashboard.classList.remove("view-current", "view-hourly", "view-daily");
            weatherDashboard.classList.add("view-all");
        } else {
            setMobileView(currentMobileView);
        }
    });

    // Temperature Unit Toggles
    btnCelsius.addEventListener("click", () => {
        if (currentUnit !== "C") {
            currentUnit = "C";
            updateUnitToggleUI();
            if (currentWeatherData) renderWeatherData();
        }
    });

    btnFahrenheit.addEventListener("click", () => {
        if (currentUnit !== "F") {
            currentUnit = "F";
            updateUnitToggleUI();
            if (currentWeatherData) renderWeatherData();
        }
    });
}

// Mobile View Switcher
function setMobileView(tab) {
    currentMobileView = tab;
    tabBtns.forEach(b => {
        b.classList.toggle("active", b.dataset.tab === tab);
    });

    weatherDashboard.classList.remove("view-all", "view-current", "view-hourly", "view-daily");
    weatherDashboard.classList.add(`view-${tab}`);
}

// Auto-load last searched city on startup
function autoLoadInitialWeather() {
    try {
        const lastCity = localStorage.getItem("atmosphere_last_city");
        if (lastCity) {
            cityInput.value = lastCity;
            clearSearchBtn.classList.add("visible");
            fetchAndDisplay(lastCity);
        } else if (searchHistory.length > 0) {
            cityInput.value = searchHistory[0];
            clearSearchBtn.classList.add("visible");
            fetchAndDisplay(searchHistory[0]);
        }
    } catch (e) {
        console.warn("Could not auto-load initial weather", e);
    }
}

// Geolocation Handler
function getUserLocation() {
    if (!navigator.geolocation) {
        displayError("Geolocation is not supported by your browser.");
        return;
    }

    if (locationBtn) locationBtn.classList.add("locating");
    showLoading();
    hideError();

    navigator.geolocation.getCurrentPosition(
        async (position) => {
            if (locationBtn) locationBtn.classList.remove("locating");
            const { latitude, longitude } = position.coords;
            try {
                const weatherData = await getWeatherByCoords(latitude, longitude);
                currentWeatherData = weatherData;
                renderWeatherData();
                addCityToHistory(weatherData.cityName);
                localStorage.setItem("atmosphere_last_city", weatherData.cityName);
                cityInput.value = weatherData.cityName;
                clearSearchBtn.classList.add("visible");
                showDashboard();
            } catch (err) {
                console.error(err);
                displayError(err.message || "Could not retrieve weather for your location.");
            }
        },
        (error) => {
            if (locationBtn) locationBtn.classList.remove("locating");
            let msg = "Could not obtain your location. Please enter a city manually.";
            if (error.code === error.PERMISSION_DENIED) {
                msg = "Location access was denied. Please allow location permissions or enter a city.";
            } else if (error.code === error.TIMEOUT) {
                msg = "Location request timed out. Please try again or search manually.";
            }
            displayError(msg);
        },
        { timeout: 10000, enableHighAccuracy: false }
    );
}

// Fetch Weather by Latitude & Longitude
async function getWeatherByCoords(latitude, longitude) {
    let resolvedCityName = "Your Location";

    try {
        // Reverse geocoding via free client-side API
        const revUrl = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`;
        const revResponse = await fetch(revUrl);
        if (revResponse.ok) {
            const revData = await revResponse.json();
            const place = revData.city || revData.locality || revData.principalSubdivision;
            const country = revData.countryCode || revData.countryName;
            if (place && country) {
                resolvedCityName = `${place}, ${country}`;
            } else if (place) {
                resolvedCityName = place;
            }
        }
    } catch {
        resolvedCityName = "Your Location";
    }

    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;
    const response = await fetch(weatherUrl);
    if (!response.ok) {
        throw new Error("Could not retrieve forecast information.");
    }

    const data = await response.json();
    return { ...data, cityName: resolvedCityName };
}

// Unit Toggle Switch CSS Switch
function updateUnitToggleUI() {
    if (currentUnit === "C") {
        btnCelsius.classList.add("active");
        btnFahrenheit.classList.remove("active");
    } else {
        btnFahrenheit.classList.add("active");
        btnCelsius.classList.remove("active");
    }
}

// Core Orchestrator: Fetch & Display weather
async function fetchAndDisplay(city) {
    showLoading();
    hideError();
    
    try {
        const weatherData = await getWeatherData(city);
        currentWeatherData = weatherData;
        
        renderWeatherData();
        addCityToHistory(weatherData.cityName);
        localStorage.setItem("atmosphere_last_city", weatherData.cityName);
        
        showDashboard();
    } catch (error) {
        console.error(error);
        displayError(error.message || "An unexpected error occurred");
    }
}

// Weather Data fetching logic (Geocoding -> Forecast API)
async function getWeatherData(city) {
    const parts = city.split(",");
    const cityNameSearch = parts[0].trim();
    const modifier = parts[1] ? parts[1].trim().toLowerCase() : null;

    // 1. Geocoding API: Get list of potential matches
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cityNameSearch)}&count=10&language=en&format=json`;
    
    const geoResponse = await fetch(geoUrl);
    if (!geoResponse.ok) {
        throw new Error("Could not connect to geocoding service.");
    }
    
    const geoData = await geoResponse.json();
    if (!geoData.results || geoData.results.length === 0) {
        throw new Error(`Could not find location "${cityNameSearch}". Please verify spelling.`);
    }
    
    // Find matching result based on country or state modifier
    let selectedResult = geoData.results[0]; // Default fallback to first result
    
    if (modifier) {
        const found = geoData.results.find(res => {
            const countryCode = res.country_code ? res.country_code.toLowerCase() : "";
            const countryName = res.country ? res.country.toLowerCase() : "";
            const admin1 = res.admin1 ? res.admin1.toLowerCase() : "";
            
            return countryCode === modifier ||
                   countryName === modifier ||
                   countryName.startsWith(modifier) ||
                   admin1 === modifier ||
                   admin1.startsWith(modifier) ||
                   admin1.includes(modifier);
        });
        if (found) {
            selectedResult = found;
        }
    }
    
    const { latitude, longitude } = selectedResult;
    
    // Format descriptive city name (e.g. London, GB)
    const cityParts = [selectedResult.name];
    if (selectedResult.country_code) {
        cityParts.push(selectedResult.country_code);
    } else if (selectedResult.country) {
        cityParts.push(selectedResult.country);
    }
    const cityName = cityParts.join(", ");

    // 2. Weather API: Fetch forecast, hourly and daily data
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`;

    const response = await fetch(weatherUrl);
    if (!response.ok) {
        throw new Error("Could not retrieve forecast information.");
    }

    const data = await response.json();
    return { ...data, cityName };
}

// Master Render Method
function renderWeatherData() {
    if (!currentWeatherData) return;
    
    const { cityName, current, hourly, daily } = currentWeatherData;
    
    // Set dynamic body class
    document.body.className = getWeatherClass(current.weather_code);
    
    // 1. Render Current Weather
    cityDisplay.textContent = cityName;
    dateDisplay.textContent = formatCurrentDate();
    weatherEmoji.textContent = getWeatherEmoji(current.weather_code);
    descDisplay.textContent = getWeatherDesc(current.weather_code);
    
    // Set temperatures based on unit state
    const tempVal = convertTemp(current.temperature_2m);
    tempDisplay.textContent = `${tempVal.toFixed(0)}°${currentUnit}`;
    
    const feelsLikeVal = convertTemp(current.apparent_temperature);
    feelsLikeDisplay.textContent = `${feelsLikeVal.toFixed(0)}°${currentUnit}`;
    
    humidityDisplay.textContent = `${current.relative_humidity_2m}%`;
    windDisplay.textContent = formatWindSpeed(current.wind_speed_10m);
    
    // 2. Render Hourly Forecast (Next 24 Hours)
    renderHourly(hourly);
    
    // 3. Render 7-Day Forecast
    renderDaily(daily);
}

// Render Hourly timeline
function renderHourly(hourlyData) {
    hourlyTimeline.innerHTML = "";
    
    const currentHourISO = new Date();
    currentHourISO.setMinutes(0, 0, 0);
    const tzOffset = currentHourISO.getTimezoneOffset() * 60000;
    const localISOTime = new Date(currentHourISO.getTime() - tzOffset).toISOString().slice(0, 13);
    
    let startIndex = hourlyData.time.findIndex(timeStr => timeStr.startsWith(localISOTime));
    if (startIndex === -1) startIndex = 0; // fallback
    
    // Display next 24 hours
    for (let i = startIndex; i < startIndex + 24 && i < hourlyData.time.length; i++) {
        const timeStr = hourlyData.time[i];
        const temp = hourlyData.temperature_2m[i];
        const code = hourlyData.weather_code[i];
        
        const card = document.createElement("div");
        card.classList.add("hourly-item-card");
        
        // Time Label
        const timeLabel = document.createElement("span");
        timeLabel.classList.add("hourly-time");
        if (i === startIndex) {
            timeLabel.textContent = "Now";
            timeLabel.style.fontWeight = "700";
            timeLabel.style.color = "var(--accent-color)";
        } else {
            timeLabel.textContent = formatHourlyTime(timeStr);
        }
        
        // Weather Emoji
        const emoji = document.createElement("span");
        emoji.classList.add("hourly-emoji");
        emoji.textContent = getWeatherEmoji(code);
        
        // Temp
        const tempLabel = document.createElement("span");
        tempLabel.classList.add("hourly-temp");
        const convertedTemp = convertTemp(temp);
        tempLabel.textContent = `${convertedTemp.toFixed(0)}°`;
        
        card.appendChild(timeLabel);
        card.appendChild(emoji);
        card.appendChild(tempLabel);
        hourlyTimeline.appendChild(card);
    }
}

// Render Daily 7-day items
function renderDaily(dailyData) {
    dailyList.innerHTML = "";
    
    for (let i = 0; i < dailyData.time.length; i++) {
        const dateStr = dailyData.time[i];
        const code = dailyData.weather_code[i];
        const maxTemp = dailyData.temperature_2m_max[i];
        const minTemp = dailyData.temperature_2m_min[i];
        
        const item = document.createElement("div");
        item.classList.add("daily-item-card");
        
        // Day Name
        const dayLabel = document.createElement("span");
        dayLabel.classList.add("daily-day");
        dayLabel.textContent = formatDailyDay(dateStr, i === 0);
        
        // Emoji
        const emoji = document.createElement("span");
        emoji.classList.add("daily-emoji");
        emoji.textContent = getWeatherEmoji(code);
        
        // Description
        const descLabel = document.createElement("span");
        descLabel.classList.add("daily-desc");
        descLabel.textContent = getWeatherDesc(code);
        
        // Temp Min/Max Container
        const rangeContainer = document.createElement("div");
        rangeContainer.classList.add("daily-temp-range");
        
        const maxSpan = document.createElement("span");
        maxSpan.classList.add("daily-temp-max");
        const maxVal = convertTemp(maxTemp);
        maxSpan.textContent = `${maxVal.toFixed(0)}°`;
        
        const minSpan = document.createElement("span");
        minSpan.classList.add("daily-temp-min");
        const minVal = convertTemp(minTemp);
        minSpan.textContent = `${minVal.toFixed(0)}°`;
        
        rangeContainer.appendChild(maxSpan);
        rangeContainer.appendChild(minSpan);
        
        item.appendChild(dayLabel);
        item.appendChild(emoji);
        item.appendChild(descLabel);
        item.appendChild(rangeContainer);
        
        dailyList.appendChild(item);
    }
}

// Search History Handlers
function loadSearchHistory() {
    try {
        const saved = localStorage.getItem("atmosphere_history");
        searchHistory = saved ? JSON.parse(saved) : [];
        renderHistoryDropdown();
    } catch (e) {
        console.error("Failed to parse history", e);
        searchHistory = [];
    }
}

function saveSearchHistory() {
    localStorage.setItem("atmosphere_history", JSON.stringify(searchHistory));
    renderHistoryDropdown();
}

function addCityToHistory(cityName) {
    searchHistory = searchHistory.filter(c => c.toLowerCase() !== cityName.toLowerCase());
    searchHistory.unshift(cityName);
    if (searchHistory.length > 5) {
        searchHistory.pop();
    }
    saveSearchHistory();
}

function removeCityFromHistory(cityName, event) {
    event.stopPropagation();
    searchHistory = searchHistory.filter(c => c.toLowerCase() !== cityName.toLowerCase());
    saveSearchHistory();
    if (searchHistory.length === 0) {
        historyDropdown.classList.remove("show");
    }
}

function clearAllHistory() {
    searchHistory = [];
    saveSearchHistory();
    historyDropdown.classList.remove("show");
}

function renderHistoryDropdown() {
    historyList.innerHTML = "";
    
    if (searchHistory.length === 0) {
        return;
    }
    
    searchHistory.forEach(city => {
        const item = document.createElement("div");
        item.classList.add("history-item");
        
        const left = document.createElement("div");
        left.classList.add("history-item-left");
        
        const icon = document.createElement("span");
        icon.classList.add("material-symbols-rounded", "history-item-icon");
        icon.textContent = "history";
        
        const text = document.createElement("span");
        text.textContent = city;
        
        left.appendChild(icon);
        left.appendChild(text);
        
        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.classList.add("delete-history-item");
        
        const closeIcon = document.createElement("span");
        closeIcon.classList.add("material-symbols-rounded");
        closeIcon.textContent = "close";
        closeIcon.style.fontSize = "1rem";
        
        deleteBtn.appendChild(closeIcon);
        deleteBtn.addEventListener("click", (e) => removeCityFromHistory(city, e));
        
        item.appendChild(left);
        item.appendChild(deleteBtn);
        
        item.addEventListener("click", () => {
            cityInput.value = city;
            clearSearchBtn.classList.add("visible");
            fetchAndDisplay(city);
            historyDropdown.classList.remove("show");
        });
        
        historyList.appendChild(item);
    });
}

// Temperature conversions (input is always Celsius from Open-Meteo)
function convertTemp(tempC) {
    if (currentUnit === "C") {
        return tempC;
    } else {
        return (tempC * 9/5) + 32;
    }
}

// Wind speed conversion and formatting
function formatWindSpeed(speedKmh) {
    if (currentUnit === "C") {
        return `${speedKmh.toFixed(0)} km/h`;
    } else {
        const speedMph = speedKmh * 0.621371;
        return `${speedMph.toFixed(0)} mph`;
    }
}

// Date Formatter helpers
function formatCurrentDate() {
    const options = { weekday: 'long', month: 'short', day: 'numeric' };
    return new Date().toLocaleDateString('en-US', options);
}

function formatHourlyTime(isoString) {
    const date = new Date(isoString);
    let hour = date.getHours();
    const ampm = hour >= 12 ? 'PM' : 'AM';
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${hour} ${ampm}`;
}

function formatDailyDay(isoString, isTodayIndex) {
    if (isTodayIndex) return "Today";
    const date = new Date(isoString + 'T00:00:00');
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days[date.getDay()];
}

// UI State Switchers
function showLoading() {
    loadingContainer.style.display = "flex";
    welcomeCard.style.display = "none";
    weatherDashboard.style.opacity = "0.3";
    weatherDashboard.style.pointerEvents = "none";
}

function showDashboard() {
    loadingContainer.style.display = "none";
    welcomeCard.style.display = "none";
    weatherDashboard.style.display = "grid";
    weatherDashboard.style.opacity = "1";
    weatherDashboard.style.pointerEvents = "auto";
    setMobileView(currentMobileView);
}

function displayError(message) {
    errorMessage.textContent = message;
    errorDisplay.style.display = "flex";
    
    loadingContainer.style.display = "none";
    welcomeCard.style.display = "none";
    weatherDashboard.style.display = "none";
}

function hideError() {
    errorDisplay.style.display = "none";
}

// WMO Weather interpretation mappings
function getWeatherDesc(code) {
    const descriptions = {
        0: "Clear sky",
        1: "Mainly clear", 
        2: "Partly cloudy", 
        3: "Overcast",
        45: "Fog", 
        48: "Depositing rime fog",
        51: "Light drizzle", 
        53: "Moderate drizzle", 
        55: "Dense drizzle",
        56: "Light freezing drizzle",
        57: "Dense freezing drizzle",
        61: "Slight rain", 
        63: "Moderate rain", 
        65: "Heavy rain",
        66: "Light freezing rain",
        67: "Heavy freezing rain",
        71: "Slight snow fall", 
        73: "Moderate snow fall", 
        75: "Heavy snow fall",
        77: "Snow grains",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        85: "Slight snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm with slight hail", 
        99: "Thunderstorm with heavy hail"
    };
    return descriptions[code] || "Overcast";
}

function getWeatherEmoji(code) {
    if (code === 0) return "☀️";
    if (code === 1) return "🌤️";
    if (code === 2) return "⛅";
    if (code === 3) return "☁️";
    if (code === 45 || code === 48) return "🌫️";
    if (code >= 51 && code <= 57) return "🌦️";
    if (code >= 61 && code <= 67) return "🌧️";
    if (code >= 71 && code <= 77) return "❄️";
    if (code >= 80 && code <= 82) return "🌧️";
    if (code >= 85 && code <= 86) return "🌨️";
    if (code >= 95) return "⛈️";
    return "❓";
}

function getWeatherClass(code) {
    if (code === 0) return "bg-clear";
    if (code >= 1 && code <= 3) return "bg-cloudy";
    if (code === 45 || code === 48) return "bg-cloudy";
    if (code >= 51 && code <= 67) return "bg-rainy";
    if (code >= 71 && code <= 77) return "bg-snowy";
    if (code >= 80 && code <= 82) return "bg-rainy";
    if (code >= 85 && code <= 86) return "bg-snowy";
    if (code >= 95) return "bg-thunder";
    return "";
}
