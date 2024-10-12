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


@app.route("/get-weather-test", methods=["GET"])
def get_weather_test():
    return jsonify(
        {
            "data": {
                "timelines": [
                    {
                        "endTime": "2024-10-15T13:00:00Z",
                        "intervals": [
                            {
                                "startTime": "2024-10-09T13:00:00Z",
                                "values": {
                                    "cloudCover": 100,
                                    "humidity": 98,
                                    "pressureSeaLevel": 1015.27,
                                    "temperature": 27.5,
                                    "temperatureApparent": 27.56,
                                    "temperatureMax": 27.5,
                                    "temperatureMin": 15.99,
                                    "uvIndex": 5,
                                    "visibility": 16,
                                    "weatherCode": 1001,
                                    "windSpeed": 3.19,
                                },
                            },
                            {
                                "startTime": "2024-10-10T13:00:00Z",
                                "values": {
                                    "cloudCover": 100,
                                    "humidity": 92.04,
                                    "pressureSeaLevel": 1016,
                                    "temperature": 25.89,
                                    "temperatureApparent": 25.89,
                                    "temperatureMax": 25.89,
                                    "temperatureMin": 13.36,
                                    "uvIndex": 5,
                                    "visibility": 16,
                                    "weatherCode": 1001,
                                    "windSpeed": 3.75,
                                },
                            },
                            {
                                "startTime": "2024-10-11T13:00:00Z",
                                "values": {
                                    "cloudCover": 100,
                                    "humidity": 91.68,
                                    "pressureSeaLevel": 1017.05,
                                    "temperature": 29.06,
                                    "temperatureApparent": 27.79,
                                    "temperatureMax": 29.06,
                                    "temperatureMin": 12.72,
                                    "uvIndex": 5,
                                    "visibility": 16,
                                    "weatherCode": 1001,
                                    "windSpeed": 4,
                                },
                            },
                            {
                                "startTime": "2024-10-12T13:00:00Z",
                                "values": {
                                    "cloudCover": 100,
                                    "humidity": 61.76,
                                    "pressureSeaLevel": 1018.13,
                                    "temperature": 28.92,
                                    "temperatureApparent": 27.7,
                                    "temperatureMax": 28.92,
                                    "temperatureMin": 17.63,
                                    "uvIndex": 5,
                                    "visibility": 24.14,
                                    "weatherCode": 1000,
                                    "windSpeed": 4.05,
                                },
                            },
                            {
                                "startTime": "2024-10-13T13:00:00Z",
                                "values": {
                                    "cloudCover": 0,
                                    "humidity": 77.37,
                                    "pressureSeaLevel": 1015.98,
                                    "temperature": 25.44,
                                    "temperatureApparent": 25.44,
                                    "temperatureMax": 25.44,
                                    "temperatureMin": 17.42,
                                    "uvIndex": 5,
                                    "visibility": 24.14,
                                    "weatherCode": 1000,
                                    "windSpeed": 4.19,
                                },
                            },
                            {
                                "startTime": "2024-10-14T13:00:00Z",
                                "values": {
                                    "cloudCover": 4.81,
                                    "humidity": 78.62,
                                    "pressureSeaLevel": 1017.92,
                                    "temperature": 24.41,
                                    "temperatureApparent": 24.41,
                                    "temperatureMax": 24.41,
                                    "temperatureMin": 17.2,
                                    "visibility": 24.14,
                                    "weatherCode": 1000,
                                    "windSpeed": 3.86,
                                },
                            },
                            {
                                "startTime": "2024-10-15T13:00:00Z",
                                "values": {
                                    "cloudCover": 99.83,
                                    "humidity": 80.44,
                                    "pressureSeaLevel": 1017.01,
                                    "temperature": 24.36,
                                    "temperatureApparent": 24.36,
                                    "temperatureMax": 24.36,
                                    "temperatureMin": 16.99,
                                    "visibility": 24.14,
                                    "weatherCode": 1001,
                                    "windSpeed": 3.25,
                                },
                            },
                        ],
                        "startTime": "2024-10-09T13:00:00Z",
                        "timestep": "1d",
                    }
                ],
                "warnings": [
                    {
                        "code": 246001,
                        "message": "The following field is not supported for a time range: 'uvIndex'",
                        "meta": {
                            "field": "uvIndex",
                            "from": "2024-10-09T11:30:00Z",
                            "to": "2024-10-14T18:51:00Z",
                        },
                        "type": "Time Bounded Field",
                    }
                ],
            }
        }
    )


if __name__ == "__main__":
    app.run(debug=True, port=5500)
