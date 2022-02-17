const container = document.querySelector(".container");
const geo_error_container = document.querySelector(".geo_error");
const weather_video_el = document.querySelector("#weather_video");
const intro_text = document.querySelector(".geo_error>div p");
const location_el = document.querySelector("#location");
const country_el = document.querySelector("#country");
const temp_el = document.querySelector("#temp");
const weather_info_el = document.querySelector("#weather_info");
const extra_weather_info_el = document.querySelector("#extra_weather_info");
const feel_el = document.querySelector("#feel_temp");
const humidity_el = document.querySelector("#humidity");
const pressure_el = document.querySelector("#pressure");
const wind_speed_el = document.querySelector("#wind_speed");

const weather_videos = 
[
    "day_clear_sky",
    "day_few_clouds",
    "day_many_clouds",
    "day_snow",
    "day_rain",
    "night_clear_sky",
    "night_few_clouds",
    "night_many_clouds",
    "night_rain",
    "night_snow"
]


let latitude = 0;
let longitude = 0;

if(navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getPosition,showError);
}
else {
    console.log("Browser doesnt support geolocation");
}

function getPosition(position) {
    geo_error_container.style.display="none";
    container.style.display = "flex";
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    fetchData(latitude,longitude)
    .then(response=> {
        console.log('Fetched data');
        showResults(response);
    })
    .catch(e => {
        console.error(e);
    });
}

function showError(error){
    switch(error.code) {
        case 1:
            intro_text.textContent = "Sorry, browser needs to know your location for the weather app.If you are in mobile version please activate your location setting";
            break;
        case 2:
            intro_text.textContent = "Sorry,could't take your location,please try again";
            break;
        case 3:
            intro_text.textContent = "Sorry, time allowed to aquire location information was reached before information was obtained,please try again";
    }
}

async function fetchData(lat,lon) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=28ba3c4fd515a70413e08a16f1aaec57`);
    const data = await response.json();
    return data;
} 

function showResults(data) {
    pickVideo(parseInt(data.weather[0].id));
    location_el.textContent = data.name;
    country_el.textContent = data.sys.country;

    temp_el.textContent = toCelsius(data.main.temp);
    weather_info_el.textContent = data.weather[0].main;
    extra_weather_info_el.textContent = data.weather[0].description;

    feel_el.textContent = toCelsius(data.main.feels_like);
    humidity_el.textContent = `${data.main.humidity}%`;
    pressure_el.textContent = `${data.main.pressure}mbar`;
    wind_speed_el.textContent = `${toKm(data.wind.speed)}km/h`
}

function pickVideo(id) {
    const time = new Date().getHours();
    let weather_pick = "";
    
    if(time>=6 && time<=18) {
        if(id<=531) {
            weather_pick = "day_rain";
        }
        else if(id<=622) {
            weather_pick = "day_snow";
        }
        else if(id===800) {
            weather_pick = "day_clear_sky";
        }
        else {
            if(id===801 || id===802) {
                weather_pick = "day_few_clouds";
            }
            else {
                weather_pick = "day_many_clouds";
            }
        }
    }
    else {
        if(id<=531) {
            weather_pick = "night_rain";
        }
        else if(id<=622) {
            weather_pick = "night_snow";
        }
        else if(id===800) {
            weather_pick = "night_clear_sky";
        }
        else {
            if(id===801 || id===802) {
                weather_pick = "night_few_clouds";
            }
            else {
                weather_pick = "night_many_clouds";
            }
        }
    }

    weather_video_el.src = `videos/${weather_videos.find(w=>w===weather_pick)}.mp4`;
    weather_video_el.parentNode.load();
    weather_video_el.parentNode.play();
}

function toCelsius(val) {
    return Math.floor((parseFloat(val)-273.15));
}

function toKm(val) {
    return ((val*18)/5).toFixed(2);
}