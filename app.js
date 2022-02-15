const location_el = document.querySelector("#location");
const country_el = document.querySelector("#country");
const temp_el = document.querySelector("#temp");
const weather_info_el = document.querySelector("#weather_info");
const extra_weather_info_el = document.querySelector("#extra_weather_info");
const feel_el = document.querySelector("#feel_temp");
const humidity_el = document.querySelector("#humidity");
const pressure_el = document.querySelector("#pressure");
const wind_speed_el = document.querySelector("#wind_speed");

let latitude = 0;
let longitude = 0;

if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getPosition,showError);
}
else {
    console.log("Browser doesnt support geolocation");
}

function getPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    fetchData(latitude,longitude)
    .then(response=> {
        console.log('Fetched data');
        console.log(response);
        showResults(response);
    })
    .catch(e => {
        console.error(e);
    });
}

function showError(error){
    console.error(error);
}

async function fetchData(lat,lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=28ba3c4fd515a70413e08a16f1aaec57`);
    const data = await response.json();
    return data;
} 

function showResults(data) {
    location_el.textContent = data.name;
    
   
    country_el.textContent = data.sys.country;

    temp_el.textContent = toCelsius(data.main.temp);
    weather_info_el.textContent = data.weather[0].main;
    extra_weather_info_el.textContent = data.weather[0].description;

    feel_el.textContent = toCelsius(data.main.feels_like);
}

function toCelsius(val) {
    return Math.floor((parseFloat(val)-273.15));

}