const apiKey ="ac5f5cd39d3bf2bc89503f26a71206d2";
const searchButton = document.getElementById('searchButton');
const cityInput = document.getElementById('cityInput');
const cityName = document.getElementById('cityName');
const weatherIcon = document.getElementById('weatherIcon');
const currentTemp = document.getElementById('currentTemp');
const currentDescription = document.getElementById('currentDescription');
const currentHumidity = document.getElementById('currentHumidity');
const currentWind = document.getElementById('currentWind');
const currentDate = document.getElementById('currentDate');
const forecastCards = document.getElementById('forecastCards');


searchButton.addEventListener('click', getWeather);


async function getWeather() {
  const city = cityInput.value.trim();
  
  if (!city) {
    alert('Please enter a city name.');
    return;
  }
  
  const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  try {
    
    const currentWeatherResponse = await fetch(currentWeatherURL);
    const currentWeatherData = await currentWeatherResponse.json();

    if (currentWeatherData.cod === '404') {
      alert('City not found.');
      return;
    }

    
    const { name, weather, main, wind, dt } = currentWeatherData;
    cityName.textContent = `${name}, ${currentWeatherData.sys.country}`;
    weatherIcon.src = `https://openweathermap.org/img/wn/${weather[0].icon}.png`;
    currentTemp.textContent = `Temperature: ${main.temp.toFixed(1)}°C`;
    currentDescription.textContent = `Condition: ${weather[0].description}`;
    currentHumidity.textContent = `Humidity: ${main.humidity}%`;
    currentWind.textContent = `Wind Speed: ${wind.speed} m/s`;
    currentDate.textContent = `Date: ${new Date(dt * 1000).toLocaleDateString()}`;

    
    const forecastResponse = await fetch(forecastURL);
    const forecastData = await forecastResponse.json();

    
    const dailyForecast = forecastData.list.filter((item, index) => index % 8 === 0); // Every 8th data point is a new day

    forecastCards.innerHTML = '';  // Clear previous cards

    dailyForecast.forEach(day => {
      const { dt, weather, main } = day;
      const forecastCard = document.createElement('div');
      forecastCard.classList.add('forecast-card');
      forecastCard.innerHTML = `
        <img src="https://openweathermap.org/img/wn/${weather[0].icon}.png" alt="${weather[0].description}">
        <h4>${new Date(dt * 1000).toLocaleDateString()}</h4>
        <p>Temp: ${main.temp.toFixed(1)}°C</p>
        <p>${weather[0].description}</p>
      `;
      forecastCards.appendChild(forecastCard);
    });
  } catch (error) {
    console.error('Error fetching weather data:', error);
  }
}
