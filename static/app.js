//Const Values
const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District Of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']

const statesID = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']

//Precipitation Type
const precipitationType = new Map();

precipitationType.set(0, 'N/A');
precipitationType.set(1, "Rain");
precipitationType.set(2, "Snow"); 
precipitationType.set(3, "Freezing Rain");
precipitationType.set(4, "Ice Pellets");

// 'Weather' Codes - Status and SVG File
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
    var checked = e.target.checked;
    var streetId = document.getElementById('street');
    var cityId = document.getElementById('city');
    var stateId = document.getElementById('state');
    
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
    document.getElementById('street').value = '';  
    document.getElementById('city').value = '';
    document.getElementById('state').value = '';
    document.getElementById('autodetect-location').checked = false;
    document.getElementById('street').disabled = false;
    document.getElementById('city').disabled = false;
    document.getElementById('state').disabled = false;
    document.querySelector('.card').style.display = 'none';
    document.querySelector('.card2').style.display = 'none';
    document.querySelector('.card3Heading').style.display = 'none';
    document.querySelector('.cardBox3').style.display = 'none'
    document.querySelector('#whiteline1').style.display = 'none';
    document.querySelector('#whiteline2').style.display = 'none';
    document.querySelector('.chartHeading').style.display = 'none';
    document.querySelector('.downarrow').style.display = 'none';
    document.querySelector('#chart1').style.display = 'none';
    document.querySelector('.downarrow').style.display = 'none';
    document.querySelector('.uparrow').style.display = 'none';
    document.querySelector('#chart1').style.display = 'none';
    document.querySelector('#chart2').style.display = 'none';
    document.querySelector('.error-handle').style.display = 'none';
});
function autoDetectIp() {
    const apiURL = "https://ipinfo.io/?token=3ce693acafe8d1"
    const xhr = new XMLHttpRequest();
    xhr.open("GET", apiURL, false);
    xhr.send();
    if (xhr.status === 200) {
        return xhr.responseText;
    } else {
        console.log("Network Error - ipinfo.io");
        document.querySelector('.error-handle').style.display = 'flex';
    }
}

function geocodingApi(street, city, state) {
    const apiKey = "AIzaSyC3CkllDKmcg7dPSQR1kYBd-b85SBMLVbo";
    state = statesID[states.indexOf(state)];
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(street)},${encodeURIComponent(city)},${encodeURIComponent(state)}&key=${apiKey}`;
    console.log(url)
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.send();
    if (xhr.status === 200) {
        return xhr.responseText;
    } else {
        console.log("Network Error - geocodingAPI");
        document.querySelector('.error-handle').style.display = 'flex';
    }

}

async function webServerCall(lat, log) {
    let response;
    let data;
    let url = `/get-weather?lat=${lat}&lng=${log}`;
    try {
        response = await fetch(url)
        data = await response.json();
        console.log("Data", data)
        return data;
    } catch(error) {
        console.error('Error:', error);
        document.querySelector('.error-handle').style.display = 'flex';
    }
}
// Array to populate the data
let cloudCoverArr = []
let humidityArr = []
let pressureArr = []
let windSpeedArr = []
let visibilityArr = []
let uvIndexArr = [] 
let weatherCodeArr = []
let temepratureArr = []
let startTimeArr = []
let temperatureMin = []
let temperatureMax = []
let precipitationTypeArr = []
let chanceOfRainArr = []
let sunriseTimeArr = []
let sunsetTimeArr = []
// TODO: ADD TRY CATCH for any failuer say api call exhausted
function extractValues(data, newAddress) {
    let intervals = data.data.timelines[0].intervals
    for (i = 0; i < intervals.length; i++) {
        let values = intervals[i].values
        let startTimeFetch = intervals[i].startTime
        cloudCoverArr[i] = values.cloudCover
        humidityArr[i] = values.humidity
        pressureArr[i] = values.pressureSeaLevel
        windSpeedArr[i] = values.windSpeed
        visibilityArr[i] = values.visibility
        uvIndexArr[i] = values.uvIndex
        weatherCodeArr[i] = values.weatherCode
        temepratureArr[i] = values.temperature
        temperatureMax[i] = values.temperatureMax
        temperatureMin[i] = values.temperatureMin
        startTimeArr[i] = startTimeFetch
        precipitationTypeArr[i] = values.precipitationType
        chanceOfRainArr[i] = values.precipitationProbability
        sunriseTimeArr[i] = values.sunriseTime
        sunsetTimeArr[i] = values.sunsetTime
    }
    // call to put values in DOM
    searchResultsDOM(newAddress);
}
function formatDate(dateString) {
    const date = new Date(dateString);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dayOfWeek = daysOfWeek[date.getUTCDay()]; 
    const day = String(date.getUTCDate()).padStart(2, '0'); 
    const month = months[date.getUTCMonth()]; 
    const year = date.getUTCFullYear(); 
    return `${dayOfWeek}, ${day} ${month} ${year}`;
}
// Return Day Mon
function formatDateChart(dateString) {
    const date = new Date(dateString);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = String(date.getUTCDate()).padStart(2, '0'); 
    const month = months[date.getUTCMonth()]; 
    return `${day} ${month}`;
}
// Return Day
function getDay(dateString) {
    const date = new Date(dateString);
    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const dayOfWeek = daysOfWeek[date.getUTCDay()]; 
    return dayOfWeek;
}
function searchResultsDOM(newAddress) {  
    // card 1 updates
    document.getElementById('card-address').textContent = newAddress;
    document.querySelector('#temperature-now').textContent = temepratureArr[0];
    document.getElementById('weather-now-text').textContent = weatherCodeText.get(weatherCodeArr[0])[0];
    document.getElementById('weather-now').src = weatherCodeText.get(weatherCodeArr[0])[1];
    let weatherValuesToBeUpdated = document.querySelectorAll('.weather-values');
    console.log(weatherValuesToBeUpdated)
    weatherValuesToBeUpdated[0].textContent = humidityArr[0] + '%';
    weatherValuesToBeUpdated[1].textContent = pressureArr[0] + 'inHg';
    weatherValuesToBeUpdated[2].textContent = windSpeedArr[0] + 'mph';
    weatherValuesToBeUpdated[3].textContent = visibilityArr[0] + 'mi';
    weatherValuesToBeUpdated[4].textContent = cloudCoverArr[0] + '%';
    weatherValuesToBeUpdated[5].textContent = uvIndexArr[0];
    document.querySelector('.card').style.display = 'block';
    
    // card 2 updates
    let card2 = document.querySelector('.card2');  
    while (card2.children.length > 1) {
        card2.removeChild(card2.children[1]);
    }

    for (let i = 0; i < startTimeArr.length; i++) {
        const weatherCard2 = document.createElement('div');
        weatherCard2.classList.add('weather-card');
    
        //DATE
        const dateElement = document.createElement('div');
        dateElement.classList.add('date');
        dateElement.textContent = formatDate(startTimeArr[i]);
        weatherCard2.appendChild(dateElement);

        //IMAGE
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('card2Image');
        const imageElement = document.createElement('img');
        imageElement.src = weatherCodeText.get(weatherCodeArr[i])[1];  
        imageContainer.appendChild(imageElement); 

        //IMAGE TEXT
        const statusElement = document.createElement('span');
        statusElement.textContent = weatherCodeText.get(weatherCodeArr[i])[0];
        imageContainer.appendChild(statusElement); 
        weatherCard2.appendChild(imageContainer); 

        //TEMPHIGH
        const tempHighElement = document.createElement('div');
        tempHighElement.classList.add('tempHigh');
        tempHighElement.textContent = temperatureMax[i];
        weatherCard2.appendChild(tempHighElement);

        //TEMPLOW
        const tempLowElement = document.createElement('div');
        tempLowElement.classList.add('tempLow');
        tempLowElement.textContent = temperatureMin[i];
        weatherCard2.appendChild(tempLowElement);

        //WINDSPEED
        const windSpeedElement = document.createElement('div');
        windSpeedElement.classList.add('windSpeed');
        windSpeedElement.textContent = windSpeedArr[i];
        weatherCard2.appendChild(windSpeedElement);

        card2.appendChild(weatherCard2);
    }
    document.querySelector('.card2').style.display = 'block';
}
// Form Submission, extracting data
async function formSubmitted(e) {
    document.querySelector('.error-handle').style.display = 'none';
    e.preventDefault();
    // Form Validation
    let street = document.getElementById('street').value.trim();
    let city = document.getElementById('city').value.trim();
    let state = document.getElementById('state').value.trim();
    let checkbox = document.getElementById('autodetect-location').checked;
    let resultFromAPI, newAddress, lat, lng;
    let isValid = true;

    // Autodetect Functionality
    if (checkbox) {
        resultFromAPI = checkBoxON();
        lat = resultFromAPI.lat;
        lng = resultFromAPI.lng;
        newAddress = resultFromAPI.newAddress;
        console.log("Calling Flask");
        let data = await webServerCall(lat, lng);
        extractValues(data, newAddress);
    } else  { // checking if the fields are correct
        if (street == '') {
            isValid = false;
        }
        else if (city == '') {
            isValid = false;
        }
        else if (state == '') {
            isValid = false;
        }
    }

    if (isValid && !checkbox) {
        console.log('CheckBox Disabled & All Correct Fields');
        resultFromAPI = validFields(street, city, state);
        lat = resultFromAPI.lat;
        lng = resultFromAPI.lng;
        newAddress = resultFromAPI.newAddress;
        console.log("Calling Flask");
        let data = await webServerCall(lat, lng);
        extractValues(data, newAddress);
    }
}

// PART 2
let table = document.querySelector('.card2');
table.addEventListener('click', function(event) {
    let clickedTableRow = event.target;
    let row = clickedTableRow.closest('.weather-card');
    if (row) {
        let allRows = Array.from(document.querySelectorAll('.weather-card'));
        let rowIndex = allRows.indexOf(row);
        let date = row.querySelector('.date').textContent;
        let status = row.querySelector('.card2Image span').textContent;
        cardExpand(rowIndex, date, status)
    }
});

function checkBoxON() {
        json = autoDetectIp()
        json = JSON.parse(json);
        console.log('Result from IpInfo', json);
        let city = json.city
        let region = json.region
        let country = json.country
        let newAddress = city + ', ' + region + ', ' + country
        let latlng = json.loc.split(',');
        let lat = latlng[0];
        let lng = latlng[1];
        return {lat: lat, lng: lng, newAddress: newAddress};
}

function validFields(streetId, city, state) {
    try {
        console.log('Call to GeoCode API')
        let json = geocodingApi(streetId, city, state);
        json = JSON.parse(json);
        if (json.results && json.results.length > 0) {
            let newAddress = json.results[0].formatted_address;
            let lat = json.results[0].geometry.location.lat;
            let lng = json.results[0].geometry.location.lng;
            return {lat: lat, lng: lng, newAddress: newAddress};
        } else {
            throw new Error("No results");
        } 
    } catch (error) {
        document.querySelector('.error-handle').style.display = 'flex';
    }
}

function cardExpand(index, date, status) {
    document.getElementById('card3Date').innerHTML = date;
    document.getElementById('card3Status').innerHTML = status;
    document.getElementById('card3Temp').innerHTML = temperatureMax[index] + '°F/' + temperatureMin[index] + '°F';
    document.querySelector('#card3UpperImg').src = weatherCodeText.get(weatherCodeArr[index])[1];
    document.querySelector('.card').style.display = 'none';
    document.querySelector('.card2').style.display = 'none';
    document.querySelector('.card3Heading').style.display = 'block';
    document.querySelector('.chartHeading').style.display = 'block';
    document.querySelector('.cardBox3').style.display = 'block';
    document.querySelector('#whiteline1').style.display = 'block';
    let card3Types = document.querySelectorAll('.C3Types');
    card3Types[0].querySelector('.C3TypesValue').innerHTML = precipitationType.get(precipitationTypeArr[index]);
    card3Types[1].querySelector('.C3TypesValue').innerHTML = chanceOfRainArr[index] + '%';
    card3Types[2].querySelector('.C3TypesValue').innerHTML = windSpeedArr[index] + ' mph';
    card3Types[3].querySelector('.C3TypesValue').innerHTML = humidityArr[index] + '%';
    card3Types[4].querySelector('.C3TypesValue').innerHTML = visibilityArr[index] + ' mi';
    card3Types[5].querySelector('.C3TypesValue').innerHTML = converTime12Hr(sunriseTimeArr[index]) + '/' + converTime12Hr(sunsetTimeArr[index]);
    document.querySelector('#whiteline2').style.display = 'block';
    document.querySelector('.downarrow').style.display = 'block';
}

function converTime12Hr(time) {
    const utcDate = new Date(time); 
    const options = {timeZone: "America/Los_Angeles", hour12: true, hour: 'numeric', minute: '2-digit'};    
    const laTime = utcDate.toLocaleString("en-US", options);
    return laTime;
}
/* High Chart Functionality */
document.querySelector('.uparrow').addEventListener('click', function() {
    document.querySelector('.downarrow').style.display = 'block';
    document.querySelector('.uparrow').style.display = 'none';
    document.querySelector('#chart1').style.display = 'none';
    document.querySelector('#chart2').style.display = 'none';
});
document.querySelector('.downarrow').addEventListener('click', function() {
    document.querySelector('.downarrow').style.display = 'none';
    document.querySelector('.uparrow').style.display = 'block';
    displayTempChart()});
/* Code for displaying chart 1*/
function displayTempChart() {
    let chartElement = document.getElementById('chart1');
    chartElement.style.display = 'block';
    chartElement.classList.add('show');
    let weekDay = [getDay(startTimeArr[0]), getDay(startTimeArr[1]), getDay(startTimeArr[2]), getDay(startTimeArr[3]), getDay(startTimeArr[4]), getDay(startTimeArr[5])]
    Highcharts.chart('chart1', {
        chart: {
            type: 'arearange'
        },
        title: {
            text: 'Temperature Ranges (Min, Max)'
        },
        xAxis: {
            categories: [formatDateChart(startTimeArr[0]), formatDateChart(startTimeArr[1]), formatDateChart(startTimeArr[2]), formatDateChart(startTimeArr[3]), formatDateChart(startTimeArr[4]), formatDateChart(startTimeArr[5])],
            crosshair: {
                width: 1,
                dashStyle: 'Solid',
                color: 'rgb(189, 189, 189)'
            }
        },
        yAxis: {
            tickInterval: 5,
            title: {
                text: null
            }
        },
        series: [{
            data: temperatureMax.slice(0,6).map((maxTemp, i) => [temperatureMin[i], maxTemp]),
            fillOpacity: 0.5,
            color: 'orange',
            fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, 'rgba(255, 152, 0, 0.6)'], 
                    [1, 'rgba(0, 121, 199, 0.4)']  
                ]
            }, 
            marker: {
                enabled: true,
                radius: 4,
                fillColor: '#5db4ee'
            }
        }],    
        legend: {
            enabled: false
        },
        tooltip: {
            formatter: function() {
                let day = weekDay[this.point.index]
                let dateSplit = this.x.split(' ');
                let flippedDate = `${dateSplit[1]} ${dateSplit[0]}`;
                let blueDot = `<span style="color:#5db4ee;">&#9679;</span>`;
                let dateStyle = `<span style="font-size:10px;">${day}, ${flippedDate}</span>`
                return `${dateStyle}<br/>${blueDot}Temperatures: <b>${this.point.low}°F</b> - <b>${this.point.high}°F</b>`;
            }
        }
    });
}

// Remove the checkbox
window.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('autodetect-location').checked = false;
    document.getElementById('formApplication').reset();
});