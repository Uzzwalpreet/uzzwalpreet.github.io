// Add States to Form
const states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware', 'District Of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming']
const statesID = ['AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'DC', 'FL', 'GA', 'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY']
const state = document.getElementById('state');
for (i = 0; i < states.length; i++) {
    const newStateElement = document.createElement('option');
    newStateElement.innerHTML = states[i];
    newStateElement.setAttribute('id', statesID[i]);
    state.appendChild(newStateElement);
}

// to clear & disbale input box when auto-detect location is enabled
const autodetectLocation = document.getElementById('autodetect-location');
autodetectLocation.addEventListener('change', function(e) {
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
    try {
        response = await fetch('http://127.0.0.1:5000/get-weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 'latitude': lat, 'longitutde': log }),  // Send lat/long as JSON
        });

        if (!response.ok) {
            console.log("Error when calling the webServer, method: app.js.webServerCall");
        }

        const data = await response.json();
        console.log('Success::', data)
        return data;
    } catch (error) {
        console.error('Error:', error);
    }
}
// Form Submission, extracting data
function formSubmitted(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const formDataJson = Object.fromEntries(formData);
    console.log(formDataJson) // TO BE REMOVED
    let json; 
    let lat;
    let log;
    if (formData.get('autodetect-location')) {
        json = autoDetectIp()
        json = JSON.parse(json);
        const latlog = json.loc.split(',');
        lat = latlog[0];
        log = latlog[1];
    } else {
        const streetId = formData.get('street');
        const city = formData.get('city');
        const state = formData.get('state');
        json = geocodingApi(streetId, city, state);
        json = JSON.parse(json);
        lat = json.results[0].geometry.location.lat;
        log = json.results[0].geometry.location.lng;
    }
    webServerCall(lat, log).then(result => {
        if (result) {
            console.log("Weather Data:", result);  // Log the data
            // You can now access the specific values you want from the JSON object
            const temperature = result.data.timelines[0].intervals[0].values.temperature;  // Example to access temperature
            console.log("Temperature:", temperature);
        } else {
            console.log("No data returned");
        }
    }).catch(error => {
        console.error("Error:", error);
    });
}