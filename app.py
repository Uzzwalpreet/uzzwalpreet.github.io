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
        f"timezone=America/Los_Angeles"
        f"&apikey={api_key}"
    )
    response = requests.get(url)
    data = response.json()
    return data


@app.route("/get-weather-test", methods=["GET"])
def get_weather_test():
    return jsonify(
        {
            "data": {
                "timelines": [
                    {
                        "timestep": "1d",
                        "endTime": "2024-10-18T13:00:00Z",
                        "startTime": "2024-10-12T13:00:00Z",
                        "intervals": [
                            {
                                "startTime": "2024-10-12T13:00:00Z",
                                "values": {
                                    "cloudCover": 100,
                                    "humidity": 98,
                                    "moonPhase": 3,
                                    "precipitationProbability": 0,
                                    "precipitationType": 0,
                                    "pressureSeaLevel": 30.05,
                                    "sunriseTime": "2024-10-12T13:55:00Z",
                                    "sunsetTime": "2024-10-13T01:22:00Z",
                                    "temperature": 81.28,
                                    "temperatureApparent": 80.48,
                                    "temperatureMax": 81.28,
                                    "temperatureMin": 56.22,
                                    "uvIndex": 5,
                                    "visibility": 9.94,
                                    "weatherCode": 1001,
                                    "windDirection": 177.02,
                                    "windSpeed": 8.95,
                                },
                            },
                            {
                                "startTime": "2024-10-13T13:00:00Z",
                                "values": {
                                    "cloudCover": 100,
                                    "humidity": 92,
                                    "moonPhase": 3,
                                    "precipitationProbability": 0,
                                    "precipitationType": 0,
                                    "pressureSeaLevel": 30.06,
                                    "sunriseTime": "2024-10-13T13:56:00Z",
                                    "sunsetTime": "2024-10-14T01:21:00Z",
                                    "temperature": 75.2,
                                    "temperatureApparent": 75.2,
                                    "temperatureMax": 75.2,
                                    "temperatureMin": 56.14,
                                    "uvIndex": 5,
                                    "visibility": 9.94,
                                    "weatherCode": 2000,
                                    "windDirection": 174.93,
                                    "windSpeed": 8.45,
                                },
                            },
                            {
                                "startTime": "2024-10-14T13:00:00Z",
                                "values": {
                                    "cloudCover": 100,
                                    "humidity": 94.79,
                                    "moonPhase": 3,
                                    "precipitationProbability": 0,
                                    "precipitationType": 0,
                                    "pressureSeaLevel": 30.09,
                                    "sunriseTime": "2024-10-14T13:57:00Z",
                                    "sunsetTime": "2024-10-15T01:20:00Z",
                                    "temperature": 74.78,
                                    "temperatureApparent": 74.78,
                                    "temperatureMax": 74.78,
                                    "temperatureMin": 55.8,
                                    "uvIndex": 4,
                                    "visibility": 9.94,
                                    "weatherCode": 1000,
                                    "windDirection": 143.1,
                                    "windSpeed": 7.83,
                                },
                            },
                            {
                                "startTime": "2024-10-15T13:00:00Z",
                                "values": {
                                    "cloudCover": 81.25,
                                    "humidity": 93.61,
                                    "moonPhase": 4,
                                    "precipitationProbability": 0,
                                    "precipitationType": 0,
                                    "pressureSeaLevel": 30.04,
                                    "sunriseTime": "2024-10-15T13:57:00Z",
                                    "sunsetTime": "2024-10-16T01:18:00Z",
                                    "temperature": 75.96,
                                    "temperatureApparent": 75.96,
                                    "temperatureMax": 75.96,
                                    "temperatureMin": 57.43,
                                    "uvIndex": 4,
                                    "visibility": 14.58,
                                    "weatherCode": 1000,
                                    "windDirection": 158.3,
                                    "windSpeed": 7.59,
                                },
                            },
                            {
                                "startTime": "2024-10-16T13:00:00Z",
                                "values": {
                                    "cloudCover": 79.56,
                                    "humidity": 79.64,
                                    "moonPhase": 4,
                                    "precipitationProbability": 0,
                                    "precipitationType": 0,
                                    "pressureSeaLevel": 29.97,
                                    "sunriseTime": "2024-10-16T13:58:00Z",
                                    "sunsetTime": "2024-10-17T01:17:00Z",
                                    "temperature": 73.89,
                                    "temperatureApparent": 73.89,
                                    "temperatureMax": 73.89,
                                    "temperatureMin": 61.26,
                                    "uvIndex": 5,
                                    "visibility": 15,
                                    "weatherCode": 1000,
                                    "windDirection": 186.61,
                                    "windSpeed": 9.93,
                                },
                            },
                            {
                                "startTime": "2024-10-17T13:00:00Z",
                                "values": {
                                    "cloudCover": 100,
                                    "humidity": 77.57,
                                    "moonPhase": 4,
                                    "precipitationProbability": 5,
                                    "precipitationType": 0,
                                    "pressureSeaLevel": 29.88,
                                    "sunriseTime": "2024-10-17T13:59:00Z",
                                    "sunsetTime": "2024-10-18T01:16:00Z",
                                    "temperature": 71.4,
                                    "temperatureApparent": 71.4,
                                    "temperatureMax": 71.4,
                                    "temperatureMin": 61.04,
                                    "visibility": 15,
                                    "weatherCode": 1100,
                                    "windDirection": 189.75,
                                    "windSpeed": 10.16,
                                },
                            },
                            {
                                "startTime": "2024-10-18T13:00:00Z",
                                "values": {
                                    "cloudCover": 98.07,
                                    "humidity": 71.37,
                                    "moonPhase": 5,
                                    "precipitationProbability": 5,
                                    "precipitationType": 0,
                                    "pressureSeaLevel": 29.99,
                                    "sunriseTime": "2024-10-18T14:00:00Z",
                                    "sunsetTime": "2024-10-19T01:15:00Z",
                                    "temperature": 74.94,
                                    "temperatureApparent": 74.94,
                                    "temperatureMax": 74.94,
                                    "temperatureMin": 60.72,
                                    "visibility": 15,
                                    "weatherCode": 1000,
                                    "windDirection": 106.24,
                                    "windSpeed": 15.26,
                                },
                            },
                        ],
                    }
                ],
                "warnings": [
                    {
                        "code": 246001,
                        "type": "Time Bounded Field",
                        "message": "The following field is not supported for a time range: 'uvIndex'",
                        "meta": {
                            "field": "uvIndex",
                            "from": "2024-10-12T11:30:00Z",
                            "to": "2024-10-17T18:49:00Z",
                        },
                    }
                ],
            }
        }
    )


if __name__ == "__main__":
    app.run(debug=True, port=5500)
