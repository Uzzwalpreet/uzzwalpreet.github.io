from datetime import datetime, timedelta

import requests
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def index():
    return send_file("index.html")


@app.route("/get-weather", methods=["GET"])
def get_weather():
    # data = request.get_json()
    latitude = request.args.get("lat")
    longitutde = request.args.get("lng")
    print(latitude)
    print(longitutde)
    api_key = "0cDKVVIq80Vt7tFtrN8vDGr0KPlYohMw"
    base_url = "https://api.tomorrow.io/v4/timelines"
    url = (
        f"https://api.tomorrow.io/v4/timelines?"
        f"location={latitude}%2C{longitutde}"
        f"&fields=temperature"
        f"&fields=temperatureApparent"
        f"&fields=temperatureMin"
        f"&fields=temperatureMax"
        f"&fields=windSpeed"
        f"&fields=windDirection"
        f"&fields=humidity"
        f"&fields=pressureSeaLevel"
        f"&fields=uvIndex"
        f"&fields=weatherCode"
        f"&fields=precipitationProbability"
        f"&fields=precipitationType"
        f"&fields=sunriseTime"
        f"&fields=sunsetTime"
        f"&fields=visibility"
        f"&fields=moonPhase"
        f"&fields=cloudCover"
        f"&units=imperial"
        f"&timesteps=1d"
        f"&weatherCode"
        f"&apikey={api_key}"
    )
    response = requests.get(url)
    data = response.json()
    return data


if __name__ == "__main__":
    app.run(debug=True, port=5000)
