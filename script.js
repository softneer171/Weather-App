const form = document.getElementById("search-form");
const cityInput = document.getElementById("city-input");

const  message = document.getElementById("message");
const  weather = document.getElementById("weather");


const  cityName = document.getElementById("city-name");
const  temperature = document.getElementById("temperature");
const  condition = document.getElementById("condition");
const  humidity = document.getElementById("humidity");
const  wind = document.getElementById("wind");
const  weatherIcon = document.getElementById("weather-icon");

async function getCityCoordinates(city){
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
     
    const response = await fetch(url);
    const data = await response.json();

    if(!data.results){
        throw new Error("City not found!");
    }

    return data.results[0];
}

async function getWeather(latitude, longitude){
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=auto`;

    const response = await fetch(url);
    const data = await response.json();

    return data.current;

}
function getWeatherIcon(code, isDay) {
    if (code === 0) {
        return isDay ? "☀️" : "🌙";
    } else if (code === 1 || code === 2) {
        return "🌤️";
    } else if (code === 3) {
        return "☁️";
    } else if (code >= 45 && code <= 48) {
        return "🌫️";
    } else if (code >= 51 && code <= 67) {
        return "🌧️";
    } else if (code >= 71 && code <= 77) {
        return "❄️";
    } else if (code >= 80 && code <= 82) {
        return "🌦️";
    } else if (code >= 95) {
        return "⛈️";
    }

    return "🌡️";
}

function getWeatherCondition(code) {
    if (code === 0) {
        return "Clear sky";
    } else if (code === 1) {
        return "Mainly clear";
    } else if (code === 2) {
        return "Partly cloudy";
    } else if (code === 3) {
        return "Overcast";
    } else if (code >= 45 && code <= 48) {
        return "Foggy";
    } else if (code >= 51 && code <= 67) {
        return "Rainy";
    } else if (code >= 71 && code <= 77) {
        return "Snowy";
    } else if (code >= 80 && code <= 82) {
        return "Rain showers";
    } else if (code >= 95) {
        return "Thunderstorm";
    }

    return "Variable conditions";
}

form.addEventListener("submit", async function (event){
     event.preventDefault();
    const city = cityInput.value.trim();

     if(!city){
    message.textContent = "Please enter a city name.";
    return;
     }

    try {
    message.textContent = "Loading weather...";
    weather.hidden = true;

    const location = await getCityCoordinates(city);

    const current = await getWeather(
        location.latitude,
        location.longitude
    );

    cityName.textContent = `${location.name}, ${location.country}`;

    temperature.textContent = `${current.temperature_2m}°C`;

    humidity.textContent = `Humidity: ${current.relative_humidity_2m}%`;

    wind.textContent = `Wind speed: ${current.wind_speed_10m} km/h`;

  condition.textContent =
    `${getWeatherCondition(current.weather_code)} , Feels like: ${current.apparent_temperature}°C`;

    weatherIcon.textContent = getWeatherIcon(
    current.weather_code,
    current.is_day
);
    weather.hidden = false;
    message.textContent = "";
    }  catch (error) {
    weather.hidden = true;
    message.textContent =
        error.message === "City not found!"
            ? "City not found. Please try another city."
            : "Unable to load weather. Check your internet and try again.";

    console.error(error);
}
});