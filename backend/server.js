const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5001;

const TOMORROW_API_KEY = "0cDKVVIq80Vt7tFtrN8vDGr0KPlYohMw";

app.use(cors());
app.use(express.json());

app.get('/weather', async (req, res) => {
  const latitude = req.query.lat;
  const longitude = req.query.lng;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Latitude and longitude are required.' });
  }

  const url = `https://api.tomorrow.io/v4/timelines?location=${latitude},${longitude}&fields=temperature,temperatureApparent,temperatureMin,temperatureMax,windSpeed,windDirection,humidity,pressureSeaLevel,uvIndex,weatherCode,precipitationProbability,precipitationType,sunriseTime,sunsetTime,visibility,moonPhase,cloudCover&units=imperial&timesteps=1d&timezone=America/Los_Angeles&apikey=${TOMORROW_API_KEY}`;

  try {
    const response = await axios.get(url);
    const data = response.data;
    console.log(data);
    res.json(data); 
  } catch (error) {
    console.error("Error fetching data from Tomorrow.io API:");
    res.status(400).json({ error: 'Failed to fetch data from Tomorrow.io API' });
  }
});

app.get('/testweather', async (req, res) => {
    console.log("called");
    const data = {
        "data": {
            "timelines": [
                {
                    "timestep": "1d",
                    "endTime": "2024-11-09T05:00:00-08:00",
                    "startTime": "2024-11-02T06:00:00-07:00",
                    "intervals": [
                        {
                            "startTime": "2024-11-02T06:00:00-07:00",
                            "values": {
                                "cloudCover": 100,
                                "humidity": 92,
                                "moonPhase": 0,
                                "precipitationProbability": 0,
                                "precipitationType": 0,
                                "pressureSeaLevel": 29.99,
                                "sunriseTime": "2024-11-02T14:11:00Z",
                                "sunsetTime": "2024-11-03T01:01:00Z",
                                "temperature": 67.66,
                                "temperatureApparent": 67.66,
                                "temperatureMax": 67.66,
                                "temperatureMin": 52.03,
                                "uvIndex": 2,
                                "visibility": 9.94,
                                "weatherCode": 1001,
                                "windDirection": 163.69,
                                "windSpeed": 8.53
                            }
                        },
                        {
                            "startTime": "2024-11-03T05:00:00-08:00",
                            "values": {
                                "cloudCover": 57.64,
                                "humidity": 79.73,
                                "moonPhase": 1,
                                "precipitationProbability": 0,
                                "precipitationType": 0,
                                "pressureSeaLevel": 30.03,
                                "sunriseTime": "2024-11-03T14:12:00Z",
                                "sunsetTime": "2024-11-04T01:00:00Z",
                                "temperature": 73.14,
                                "temperatureApparent": 73.14,
                                "temperatureMax": 73.14,
                                "temperatureMin": 51.96,
                                "uvIndex": 4,
                                "visibility": 9.94,
                                "weatherCode": 1000,
                                "windDirection": 159.87,
                                "windSpeed": 7.84
                            }
                        },
                        {
                            "startTime": "2024-11-04T05:00:00-08:00",
                            "values": {
                                "cloudCover": 0.78,
                                "humidity": 46.66,
                                "moonPhase": 1,
                                "precipitationProbability": 0,
                                "precipitationType": 0,
                                "pressureSeaLevel": 30.12,
                                "sunriseTime": "2024-11-04T14:12:00Z",
                                "sunsetTime": "2024-11-05T01:00:00Z",
                                "temperature": 75.16,
                                "temperatureApparent": 75.16,
                                "temperatureMax": 75.16,
                                "temperatureMin": 52.37,
                                "uvIndex": 4,
                                "visibility": 9.94,
                                "weatherCode": 1000,
                                "windDirection": 115.88,
                                "windSpeed": 8.43
                            }
                        },
                        {
                            "startTime": "2024-11-05T05:00:00-08:00",
                            "values": {
                                "cloudCover": 100,
                                "humidity": 56,
                                "moonPhase": 1,
                                "precipitationProbability": 0,
                                "precipitationType": 0,
                                "pressureSeaLevel": 30.02,
                                "sunriseTime": "2024-11-05T14:13:00Z",
                                "sunsetTime": "2024-11-06T00:59:00Z",
                                "temperature": 75.79,
                                "temperatureApparent": 75.79,
                                "temperatureMax": 75.79,
                                "temperatureMin": 54.51,
                                "uvIndex": 4,
                                "visibility": 14.58,
                                "weatherCode": 1001,
                                "windDirection": 126.46,
                                "windSpeed": 7.82
                            }
                        },
                        {
                            "startTime": "2024-11-06T05:00:00-08:00",
                            "values": {
                                "cloudCover": 100,
                                "humidity": 46.58,
                                "moonPhase": 1,
                                "precipitationProbability": 0,
                                "precipitationType": 0,
                                "pressureSeaLevel": 30,
                                "sunriseTime": "2024-11-06T14:14:00Z",
                                "sunsetTime": "2024-11-07T00:58:00Z",
                                "temperature": 73.07,
                                "temperatureApparent": 73.07,
                                "temperatureMax": 73.07,
                                "temperatureMin": 58.94,
                                "uvIndex": 3,
                                "visibility": 15,
                                "weatherCode": 1001,
                                "windDirection": 139.38,
                                "windSpeed": 6.38
                            }
                        },
                        {
                            "startTime": "2024-11-07T05:00:00-08:00",
                            "values": {
                                "cloudCover": 5.63,
                                "humidity": 11.06,
                                "moonPhase": 2,
                                "precipitationProbability": 0,
                                "precipitationType": 0,
                                "pressureSeaLevel": 30.09,
                                "sunriseTime": "2024-11-07T14:15:00Z",
                                "sunsetTime": "2024-11-08T00:58:00Z",
                                "temperature": 71.76,
                                "temperatureApparent": 71.76,
                                "temperatureMax": 71.76,
                                "temperatureMin": 57.88,
                                "visibility": 15,
                                "weatherCode": 1000,
                                "windDirection": 125.87,
                                "windSpeed": 5.11
                            }
                        },
                        {
                            "startTime": "2024-11-08T05:00:00-08:00",
                            "values": {
                                "cloudCover": 3.97,
                                "humidity": 16.41,
                                "moonPhase": 2,
                                "precipitationProbability": 0,
                                "precipitationType": 0,
                                "pressureSeaLevel": 30.11,
                                "sunriseTime": "2024-11-08T14:15:00Z",
                                "sunsetTime": "2024-11-09T00:57:00Z",
                                "temperature": 72.48,
                                "temperatureApparent": 72.48,
                                "temperatureMax": 72.48,
                                "temperatureMin": 59.73,
                                "visibility": 15,
                                "weatherCode": 1000,
                                "windDirection": 173.7,
                                "windSpeed": 8.68
                            }
                        },
                        {
                            "startTime": "2024-11-09T05:00:00-08:00",
                            "values": {
                                "cloudCover": 3.97,
                                "humidity": 13.85,
                                "moonPhase": 2,
                                "precipitationProbability": 0,
                                "precipitationType": 0,
                                "pressureSeaLevel": 29.98,
                                "sunriseTime": "2024-11-09T14:16:00Z",
                                "sunsetTime": "2024-11-10T00:57:00Z",
                                "temperature": 60.77,
                                "temperatureApparent": 60.77,
                                "temperatureMax": 60.77,
                                "temperatureMin": 60.77,
                                "visibility": 15,
                                "weatherCode": 1000,
                                "windDirection": 50.01,
                                "windSpeed": 2.7
                            }
                        }
                    ]
                }
            ],
            "warnings": [
                {
                    "code": 246001,
                    "type": "Time Bounded Field",
                    "message": "The following field is not supported for a time range: 'uvIndex'",
                    "meta": {
                        "field": "uvIndex",
                        "from": "2024-11-02T04:30:00-07:00",
                        "to": "2024-11-07T06:31:00-08:00"
                    }
                }
            ]
        }
    }
    return res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
