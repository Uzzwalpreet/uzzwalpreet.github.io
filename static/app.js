//Const Values
const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District Of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
const statesID = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
const weatherCodeText = new Map();
weatherCodeText.set(4201, ['Heavy Rain', '/static/weathercodes/rain_heavy.svg']); 
weatherCodeText.set(4001, ['Rain', '/static/weathercodes/rain.svg']);
weatherCodeText.set(4200, ['Light Rain', '/static/weathercodes/rain_light.svg']);
weatherCodeText.set(6201, ['Heavy Freazing Rain', '/static/weathercodes/freezing_rain_heavy.svg']);
weatherCodeText.set(6001, ['Freazing Rain', '/static/weathercodes/freezing_rain.svg']);
weatherCodeText.set(6200, ['Light Freazing Rain', '/static/weathercodes/freezing_rain_light.svg']);
weatherCodeText.set(6000, ['Freazing Drizzle', '/static/weathercodes/freezing_drizzle.svg']);
weatherCodeText.set(4000, ['Drizzle', '/static/weathercodes/drizzle.svg']);
weatherCodeText.set(7101, ['Heavy Ice Pellets', '/static/weathercodes/ice_pellets_heavy.svg']);
weatherCodeText.set(7000, ['Ice Pellets', '/static/weathercodes/ice_pellets.svg']);
weatherCodeText.set(7102, ['Light Ice Pellets', '/static/weathercodes/ice_pellets_light.svg']);
weatherCodeText.set(5101, ['Heavy Snow', '/static/weathercodes/snow_heavy.svg']);
weatherCodeText.set(5000, ['Snow', '/static/weathercodes/snow.svg']);
weatherCodeText.set(5100, ['Light Snow', '/static/weathercodes/snow_light.svg']);
weatherCodeText.set(5001, ['Flurries', '/static/weathercodes/flurries.svg']);
weatherCodeText.set(8000, ['Thunderstorm', '/static/weathercodes/tstorm.svg']);
weatherCodeText.set(2100, ['Light Fog', '/static/weathercodes/fog_light.svg']);
weatherCodeText.set(2000, ['Fog', '/static/weathercodes/fog.svg']);
weatherCodeText.set(1001, ['Cloudy', '/static/weathercodes/cloudy.svg']);
weatherCodeText.set(1102, ['Mostly Cloudy', '/static/weathercodes/mostly_cloudy.svg']);
weatherCodeText.set(1101, ['Partly Cloudy', '/static/weathercodes/partly_cloudy_day.svg']);
weatherCodeText.set(1100, ['Mostly Clear', '/static/weathercodes/mostly_clear_day.svg']);
weatherCodeText.set(1000, ['Clear', '/static/weathercodes/clear_day.svg']);
weartherCodeImg = new Map()

const state = document.getElementById('state');
for (i = 0; i < states.length; i++) {
    const newStateElement = document.createElement('option');
    newStateElement.innerHTML = states[i];
    newStateElement.setAttribute('id', statesID[i]);
    state.appendChild(newStateElement);
}

// to clear & disbale input box when auto-detect location is enabled
const autodetectLocation = document.getElementById('autodetect-location');
autodetectLocation.addEventListener('change', disableFilds);

function disableFilds(e) {
    const checked = e.target.checked;
    const streetId = document.getElementById('street');
    const cityId = document.getElementById('city');
    const stateId = document.getElementById('state');
    
    streetId.value = "";
    cityId.value = "";
    stateId.value = "";

    streetId.disabled = checked;
    cityId.disabled = checked;
    stateId.disabled = checked;
}

// clear button functionality
document.getElementById('clear-btn').addEventListener('click', function(e) {
    e.preventDefault(); 
    console.log("Clear button clicked, but form is not reset.");
    document.getElementById('street').value = '';  
    document.getElementById('city').value = '';
    document.getElementById('state').value = '';
    document.getElementById('autodetect-location').checked = false;
    document.getElementById('street').disabled = false;
    document.getElementById('city').disabled = false;
    document.getElementById('state').disabled = false;
    document.querySelector('.card').style.display = 'none';
});
function autoDetectIp() {
    const token = "3ce693acafe8d1";
    const apiURL = "https://ipinfo.io/?token=3ce693acafe8d1"
    const xhr = new XMLHttpRequest();
    xhr.open("GET", apiURL, false);
    xhr.send();
    if (xhr.status === 200) {
        return xhr.responseText;
    } else {
        console.log("Network Error - ipinfo.io");
    }
}

function geocodingApi(street, city, state) {
    const apiKey = "AIzaSyC3CkllDKmcg7dPSQR1kYBd-b85SBMLVbo";
    street = street.replace(/ /g, "+");
    city = city.replace(/ /g, "+");
    state = statesID[states.indexOf(state)];
    const url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + street + city + state + "&key=" + apiKey;
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    if (xhr.status === 200) {
        return xhr.responseText;
    } else {
        console.log("Network Error - geocodingAPI");
    }

}

async function webServerCall(lat, log) {
    let response;
    let data;
    let url = `/get-weather?lat=${lat}&lng=${log}`;
    try {
        response = await fetch(url)
        data = await response.json();
        return data;
    } catch(error) {
        console.error('Error:', error);
    }
}
// TODO: ADD TRY CATCH for any failuer say api call exhausted
function extractValues(data, newAddress) {
    let cloudCoverArr = []
    let humidityArr = []
    let pressureArr = []
    let windSpeedArr = []
    let visibilityArr = []
    let uvIndexArr = [] 
    let weatherCodeArr = []
    let temepratureArr = []
    let startTimeArr = []
    let intervals = data.data.timelines[0].intervals
    for (i = 0; i < intervals.length; i++) {
        let values = intervals[i].values
        cloudCoverArr.push(values.cloudCover)
        humidityArr.push(values.humidity)
        pressureArr.push(values.pressureSeaLevel)
        windSpeedArr.push(values.windSpeed)
        visibilityArr.push(values.visibility)
        uvIndexArr.push(values.uvIndex)
        weatherCodeArr.push(values.weatherCode)
        temepratureArr.push(values.temperature)
        startTimeArr.push(values.startTime)
    }
    // call to put values in DOM
    searchResultsDOM(humidityArr, pressureArr, windSpeedArr, visibilityArr, cloudCoverArr, uvIndexArr, temepratureArr, weatherCodeArr, newAddress);
}
function searchResultsDOM(humidityArr, pressureArr, windSpeedArr, visibilityArr, cloudCoverArr, uvIndexArr, temepratureArr, weatherCodeArr, newAddress) {
    document.getElementById('card-address').textContent = newAddress;
    document.querySelector('#temperature-now').textContent = temepratureArr[0];
    document.getElementById('weather-now-text').textContent = weatherCodeText.get(weatherCodeArr[0])[0];
    document.getElementById('weather-now').src = weatherCodeText.get(weatherCodeArr[0])[1];
    document.querySelector('.card').style.display = 'block';
    console.log(weatherCodeText.get(weatherCodeArr[0]))
}
// Form Submission, extracting data
async function formSubmitted(e) {
    e.preventDefault();
    let form = e.target;
    let formData = new FormData(form);
    let formDataJson = Object.fromEntries(formData);
    console.log(formDataJson) // TO BE REMOVED
    let json; 
    let lat;
    let log;
    let newAddress;
    if (formData.get('autodetect-location')) {
        console.log("Call to Ipinfo")
        json = autoDetectIp()
        json = JSON.parse(json);
        console.log("Ipinfo data", json)
        let city = json.city
        let region = json.region
        let country = json.country
        newAddress = city + ', ' + region + ', ' + country
        let latlog = json.loc.split(',');
        lat = latlog[0];
        log = latlog[1];
    } else {
        console.log("Call to Geocode API")
        let streetId = formData.get('street');
        let city = formData.get('city');
        let state = formData.get('state');
        newAddress = street + ', ' + city + ', ' + state
        json = geocodingApi(streetId, city, state);
        json = JSON.parse(json);
        lat = json.results[0].geometry.location.lat;
        log = json.results[0].geometry.location.lng;
    }
    let data = await webServerCall(lat, log)
    extractValues(data, newAddress);
}