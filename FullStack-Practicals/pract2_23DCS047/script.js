const weatherData = {
  "Rajkot": "25°C, Sunny",
  "Ahmamdabad": "18°C, Cloudy",
  "Mumbai": "30°C, Clear",
  "Surat": "22°C, Rainy",
  "Goa": "28°C, Partly Cloudy"
};

document.getElementById('getWeatherBtn').addEventListener('click', () => {
  const city = document.getElementById('cityInput').value.trim();
  const resultDiv = document.getElementById('weatherResult');

  if (weatherData[city]) {
    resultDiv.textContent = `Weather in ${city}: ${weatherData[city]}`;
  } else {
    resultDiv.textContent = "City not found in our database.";
  }
});
