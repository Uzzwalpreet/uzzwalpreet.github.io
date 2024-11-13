const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = 5001;
const TOMORROW_API_KEY = "0cDKVVIq80Vt7tFtrN8vDGr0KPlYohMw";
const MONGOCLIENT = "mongodb+srv://uzzwalpreetkaur:FeAJUjwLcoITR2A6@cluster0.8a0nk.mongodb.net/weatherdatabase?retryWrites=true&w=majority&appName=Cluster0";

app.use(cors());
app.use(express.json());

let db;
``
async function connectToDatabase() {
    if (!db) {
        const client = new MongoClient(MONGOCLIENT, { useNewUrlParser: true, useUnifiedTopology: true });        await client.connect();
        db = client.db('weatherdatabase'); 
        console.log("Connected to MongoDB");
    }
    return db;
}

connectToDatabase().catch(error => {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
});

async function saveWeatherData(data) {
    const database = await connectToDatabase();
    const collection = database.collection('weathercollection');
    const result = await collection.insertOne(data);
    return result;
}

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
    console.error("Error fetching data from Tomorrow.io API:", error);
    res.status(400).json({ error: 'Failed to fetch data from Tomorrow.io API' });
  }
});

app.get('/weather-hourly', async (req, res) => {
    console.log("Hourly Call")
    const latitude = req.query.lat;
    const longitude = req.query.lng;
    const startTime = req.query.startTime;
  
    if (!latitude || !longitude) {
      return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }
    const url = `https://api.tomorrow.io/v4/timelines?location=${latitude},${longitude}&fields=temperature,windSpeed,windDirection,humidity,pressureSeaLevel&units=imperial&startTime=${startTime}&timezone=America/Los_Angeles&apikey=${TOMORROW_API_KEY}`;
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

  app.post('/sendToDB', async (req, res) => {
    const { city, state, latitude, longitude } = req.body;
    const weatherData = {
        city,
        state,
        latitude,
        longitude
    };

    try {
        const result = await saveWeatherData(weatherData);
        res.status(200).json({ message: "Data saved successfully!", result });
    } catch (error) {
        console.error("Error saving data to MongoDB:", error);
        res.status(500).json({ message: "Error saving data to the database." });
    }
}); 

app.get('/api/favorites', async (req, res) => {
    try {
      const database = await connectToDatabase();
      const collection = database.collection('weathercollection');
      const favorites = await collection.find({}).toArray();
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });

  app.delete('/api/delete/:id', async (req, res) => {
    const { id } = req.params;
    console.log("Trash can delete")

    try {
        const database = await connectToDatabase();
        const collection = database.collection('weathercollection');
        const result = await collection.deleteOne({ _id: new ObjectId(id) });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'Error: no document with the id found' });
        }
        res.status(200).json({ message: 'Successfully deleted the document from database' });
    } catch (error) {
        console.error("Error in api/favorites/id:", error);
        res.status(500).json({ message: "Error deleting document from the database." });
    }
});

app.get('/api/favorites/check', async (req, res) => {
    const { city, state } = req.query;

    if (!city || !state) {
        return res.status(400).json({ error: "City and state are required" });
    }

    try {
        const database = await connectToDatabase();
        const collection = database.collection('weathercollection');

        const favorites = await collection.find({}).toArray();

        const exists = favorites.some(fav => 
            fav.city.toLowerCase() === city.toLowerCase() &&
            fav.state.toLowerCase() === state.toLowerCase()
        );

        res.status(200).json({ exists });
    } catch (error) {
        console.error("Error checking location in database:", error);
        res.status(500).json({ error: "Error checking location in the database" });
    }
});

app.delete('/api/favorites/delete2', async (req, res) => {
    const { city, state } = req.body;

    if (!city || !state) {
        return res.status(400).json({ error: "City and state are required" });
    }

    try {
        const database = await connectToDatabase();
        const collection = database.collection('weathercollection');
        const favorites = await collection.find({}).toArray();

        const favoriteToDelete = favorites.find(fav =>
            fav.city.toLowerCase() === city.toLowerCase() &&
            fav.state.toLowerCase() === state.toLowerCase()
        );
        if (!favoriteToDelete) {
            return res.status(404).json({ message: "Favorite not found" });
        }
        const result = await collection.deleteOne({ _id: favoriteToDelete._id });

        if (result.deletedCount === 1) {
            res.status(200).json({ message: "Favorite deleted successfully" });
        } else {
            res.status(500).json({ message: "Failed to delete the favorite" });
        }
    } catch (error) {
        console.error("Error deleting favorite from database:", error);
        res.status(500).json({ error: "Error deleting favorite from the database" });
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

app.get('/testweather-hourly', async (req, res) => {
    const data = {
        "data": {
            "timelines": [
                {
                    "timestep": "1h",
                    "endTime": "2024-11-09T06:00:00-08:00",
                    "startTime": "2024-11-04T06:00:00-08:00",
                    "intervals": [
                        {
                            "startTime": "2024-11-04T06:00:00-08:00",
                            "values": {
                                "humidity": 71,
                                "pressureSeaLevel": 30.01,
                                "temperature": 73.18,
                                "windDirection": 231.13,
                                "windSpeed": 7.83
                            }
                        },
                        {
                            "startTime": "2024-11-04T07:00:00-08:00",
                            "values": {
                                "humidity": 71,
                                "pressureSeaLevel": 30,
                                "temperature": 73.4,
                                "windDirection": 232.13,
                                "windSpeed": 9.79
                            }
                        },
                        {
                            "startTime": "2024-11-04T08:00:00-08:00",
                            "values": {
                                "humidity": 69,
                                "pressureSeaLevel": 30.01,
                                "temperature": 73.4,
                                "windDirection": 236.19,
                                "windSpeed": 8.53
                            }
                        },
                        {
                            "startTime": "2024-11-04T09:00:00-08:00",
                            "values": {
                                "humidity": 69,
                                "pressureSeaLevel": 30.01,
                                "temperature": 73.63,
                                "windDirection": 232.63,
                                "windSpeed": 8.25
                            }
                        },
                        {
                            "startTime": "2024-11-04T10:00:00-08:00",
                            "values": {
                                "humidity": 70,
                                "pressureSeaLevel": 30.02,
                                "temperature": 73.63,
                                "windDirection": 245.13,
                                "windSpeed": 8.25
                            }
                        },
                        {
                            "startTime": "2024-11-04T11:00:00-08:00",
                            "values": {
                                "humidity": 68,
                                "pressureSeaLevel": 30.02,
                                "temperature": 73.4,
                                "windDirection": 243.88,
                                "windSpeed": 6.99
                            }
                        },
                        {
                            "startTime": "2024-11-04T12:00:00-08:00",
                            "values": {
                                "humidity": 66,
                                "pressureSeaLevel": 30.02,
                                "temperature": 73.4,
                                "windDirection": 239.5,
                                "windSpeed": 6.01
                            }
                        },
                        {
                            "startTime": "2024-11-04T13:00:00-08:00",
                            "values": {
                                "humidity": 65,
                                "pressureSeaLevel": 30.01,
                                "temperature": 73.4,
                                "windDirection": 232.69,
                                "windSpeed": 6.43
                            }
                        },
                        {
                            "startTime": "2024-11-04T14:00:00-08:00",
                            "values": {
                                "humidity": 65,
                                "pressureSeaLevel": 30.01,
                                "temperature": 73.18,
                                "windDirection": 234.38,
                                "windSpeed": 6.01
                            }
                        },
                        {
                            "startTime": "2024-11-04T15:00:00-08:00",
                            "values": {
                                "humidity": 65,
                                "pressureSeaLevel": 30.01,
                                "temperature": 73.18,
                                "windDirection": 236,
                                "windSpeed": 5.87
                            }
                        },
                        {
                            "startTime": "2024-11-04T16:00:00-08:00",
                            "values": {
                                "humidity": 63,
                                "pressureSeaLevel": 30,
                                "temperature": 73.06,
                                "windDirection": 236.19,
                                "windSpeed": 4.89
                            }
                        },
                        {
                            "startTime": "2024-11-04T17:00:00-08:00",
                            "values": {
                                "humidity": 63,
                                "pressureSeaLevel": 30,
                                "temperature": 73.06,
                                "windDirection": 238.19,
                                "windSpeed": 4.47
                            }
                        },
                        {
                            "startTime": "2024-11-04T18:00:00-08:00",
                            "values": {
                                "humidity": 64,
                                "pressureSeaLevel": 30,
                                "temperature": 72.84,
                                "windDirection": 241.19,
                                "windSpeed": 3.78
                            }
                        },
                        {
                            "startTime": "2024-11-04T19:00:00-08:00",
                            "values": {
                                "humidity": 61,
                                "pressureSeaLevel": 30.01,
                                "temperature": 72.84,
                                "windDirection": 224.19,
                                "windSpeed": 3.36
                            }
                        },
                        {
                            "startTime": "2024-11-04T20:00:00-08:00",
                            "values": {
                                "humidity": 61,
                                "pressureSeaLevel": 30.03,
                                "temperature": 72.84,
                                "windDirection": 227.19,
                                "windSpeed": 2.24
                            }
                        },
                        {
                            "startTime": "2024-11-04T21:00:00-08:00",
                            "values": {
                                "humidity": 61,
                                "pressureSeaLevel": 30.05,
                                "temperature": 72.72,
                                "windDirection": 246.81,
                                "windSpeed": 0.7
                            }
                        },
                        {
                            "startTime": "2024-11-04T22:00:00-08:00",
                            "values": {
                                "humidity": 59,
                                "pressureSeaLevel": 30.07,
                                "temperature": 73.06,
                                "windDirection": 195.13,
                                "windSpeed": 0.84
                            }
                        },
                        {
                            "startTime": "2024-11-04T23:00:00-08:00",
                            "values": {
                                "humidity": 58,
                                "pressureSeaLevel": 30.09,
                                "temperature": 73.06,
                                "windDirection": 177.38,
                                "windSpeed": 1.12
                            }
                        },
                        {
                            "startTime": "2024-11-05T00:00:00-08:00",
                            "values": {
                                "humidity": 59,
                                "pressureSeaLevel": 30.1,
                                "temperature": 73.18,
                                "windDirection": 174,
                                "windSpeed": 0.7
                            }
                        },
                        {
                            "startTime": "2024-11-05T01:00:00-08:00",
                            "values": {
                                "humidity": 59,
                                "pressureSeaLevel": 30.1,
                                "temperature": 73.18,
                                "windDirection": 147.75,
                                "windSpeed": 0.28
                            }
                        },
                        {
                            "startTime": "2024-11-05T02:00:00-08:00",
                            "values": {
                                "humidity": 60,
                                "pressureSeaLevel": 30.1,
                                "temperature": 73.18,
                                "windDirection": 47.81,
                                "windSpeed": 0.28
                            }
                        },
                        {
                            "startTime": "2024-11-05T03:00:00-08:00",
                            "values": {
                                "humidity": 60,
                                "pressureSeaLevel": 30.09,
                                "temperature": 73.18,
                                "windDirection": 25.94,
                                "windSpeed": 0.84
                            }
                        },
                        {
                            "startTime": "2024-11-05T04:00:00-08:00",
                            "values": {
                                "humidity": 61,
                                "pressureSeaLevel": 30.08,
                                "temperature": 73.18,
                                "windDirection": 22.44,
                                "windSpeed": 1.54
                            }
                        },
                        {
                            "startTime": "2024-11-05T05:00:00-08:00",
                            "values": {
                                "humidity": 61,
                                "pressureSeaLevel": 30.07,
                                "temperature": 73.18,
                                "windDirection": 20.81,
                                "windSpeed": 1.82
                            }
                        },
                        {
                            "startTime": "2024-11-05T06:00:00-08:00",
                            "values": {
                                "humidity": 60,
                                "pressureSeaLevel": 30.06,
                                "temperature": 73.18,
                                "windDirection": 23.94,
                                "windSpeed": 2.52
                            }
                        },
                        {
                            "startTime": "2024-11-05T07:00:00-08:00",
                            "values": {
                                "humidity": 59,
                                "pressureSeaLevel": 30.05,
                                "temperature": 73.29,
                                "windDirection": 28.06,
                                "windSpeed": 2.8
                            }
                        },
                        {
                            "startTime": "2024-11-05T08:00:00-08:00",
                            "values": {
                                "humidity": 57,
                                "pressureSeaLevel": 30.06,
                                "temperature": 73.4,
                                "windDirection": 34.44,
                                "windSpeed": 4.19
                            }
                        },
                        {
                            "startTime": "2024-11-05T09:00:00-08:00",
                            "values": {
                                "humidity": 58,
                                "pressureSeaLevel": 30.06,
                                "temperature": 73.4,
                                "windDirection": 44.56,
                                "windSpeed": 4.75
                            }
                        },
                        {
                            "startTime": "2024-11-05T10:00:00-08:00",
                            "values": {
                                "humidity": 65,
                                "pressureSeaLevel": 30.06,
                                "temperature": 73.29,
                                "windDirection": 48.81,
                                "windSpeed": 6.57
                            }
                        },
                        {
                            "startTime": "2024-11-05T11:00:00-08:00",
                            "values": {
                                "humidity": 65,
                                "pressureSeaLevel": 30.07,
                                "temperature": 73.18,
                                "windDirection": 49.19,
                                "windSpeed": 7.41
                            }
                        },
                        {
                            "startTime": "2024-11-05T12:00:00-08:00",
                            "values": {
                                "humidity": 65,
                                "pressureSeaLevel": 30.07,
                                "temperature": 73.29,
                                "windDirection": 50.31,
                                "windSpeed": 7.97
                            }
                        },
                        {
                            "startTime": "2024-11-05T13:00:00-08:00",
                            "values": {
                                "humidity": 64,
                                "pressureSeaLevel": 30.07,
                                "temperature": 73.18,
                                "windDirection": 45.25,
                                "windSpeed": 8.67
                            }
                        },
                        {
                            "startTime": "2024-11-05T14:00:00-08:00",
                            "values": {
                                "humidity": 64,
                                "pressureSeaLevel": 30.07,
                                "temperature": 73.18,
                                "windDirection": 43.19,
                                "windSpeed": 8.95
                            }
                        },
                        {
                            "startTime": "2024-11-05T15:00:00-08:00",
                            "values": {
                                "humidity": 64,
                                "pressureSeaLevel": 30.07,
                                "temperature": 73.06,
                                "windDirection": 41,
                                "windSpeed": 10.21
                            }
                        },
                        {
                            "startTime": "2024-11-05T16:00:00-08:00",
                            "values": {
                                "humidity": 63,
                                "pressureSeaLevel": 30.07,
                                "temperature": 73.18,
                                "windDirection": 38.63,
                                "windSpeed": 11.6
                            }
                        },
                        {
                            "startTime": "2024-11-05T17:00:00-08:00",
                            "values": {
                                "humidity": 61,
                                "pressureSeaLevel": 30.07,
                                "temperature": 73.18,
                                "windDirection": 35.75,
                                "windSpeed": 13.28
                            }
                        },
                        {
                            "startTime": "2024-11-05T18:00:00-08:00",
                            "values": {
                                "humidity": 57,
                                "pressureSeaLevel": 30.07,
                                "temperature": 73.06,
                                "windDirection": 34.88,
                                "windSpeed": 14.54
                            }
                        },
                        {
                            "startTime": "2024-11-05T19:00:00-08:00",
                            "values": {
                                "humidity": 57,
                                "pressureSeaLevel": 30.07,
                                "temperature": 73.06,
                                "windDirection": 35.63,
                                "windSpeed": 14.82
                            }
                        },
                        {
                            "startTime": "2024-11-05T20:00:00-08:00",
                            "values": {
                                "humidity": 58,
                                "pressureSeaLevel": 30.09,
                                "temperature": 73.18,
                                "windDirection": 38,
                                "windSpeed": 14.82
                            }
                        },
                        {
                            "startTime": "2024-11-05T21:00:00-08:00",
                            "values": {
                                "humidity": 59,
                                "pressureSeaLevel": 30.11,
                                "temperature": 73.29,
                                "windDirection": 42.38,
                                "windSpeed": 14.96
                            }
                        },
                        {
                            "startTime": "2024-11-05T22:00:00-08:00",
                            "values": {
                                "humidity": 59,
                                "pressureSeaLevel": 30.13,
                                "temperature": 73.63,
                                "windDirection": 42.56,
                                "windSpeed": 15.52
                            }
                        },
                        {
                            "startTime": "2024-11-05T23:00:00-08:00",
                            "values": {
                                "humidity": 60,
                                "pressureSeaLevel": 30.15,
                                "temperature": 73.74,
                                "windDirection": 40.81,
                                "windSpeed": 16.08
                            }
                        },
                        {
                            "startTime": "2024-11-06T00:00:00-08:00",
                            "values": {
                                "humidity": 60,
                                "pressureSeaLevel": 30.16,
                                "temperature": 73.74,
                                "windDirection": 36.88,
                                "windSpeed": 16.5
                            }
                        },
                        {
                            "startTime": "2024-11-06T01:00:00-08:00",
                            "values": {
                                "humidity": 60,
                                "pressureSeaLevel": 30.16,
                                "temperature": 73.74,
                                "windDirection": 34.19,
                                "windSpeed": 16.22
                            }
                        },
                        {
                            "startTime": "2024-11-06T02:00:00-08:00",
                            "values": {
                                "humidity": 60,
                                "pressureSeaLevel": 30.15,
                                "temperature": 73.74,
                                "windDirection": 32.25,
                                "windSpeed": 16.08
                            }
                        },
                        {
                            "startTime": "2024-11-06T03:00:00-08:00",
                            "values": {
                                "humidity": 61,
                                "pressureSeaLevel": 30.15,
                                "temperature": 73.74,
                                "windDirection": 30.69,
                                "windSpeed": 16.36
                            }
                        },
                        {
                            "startTime": "2024-11-06T04:00:00-08:00",
                            "values": {
                                "humidity": 64,
                                "pressureSeaLevel": 30.13,
                                "temperature": 73.63,
                                "windDirection": 29.38,
                                "windSpeed": 17.34
                            }
                        },
                        {
                            "startTime": "2024-11-06T05:00:00-08:00",
                            "values": {
                                "humidity": 64,
                                "pressureSeaLevel": 30.12,
                                "temperature": 73.4,
                                "windDirection": 28.25,
                                "windSpeed": 18.32
                            }
                        },
                        {
                            "startTime": "2024-11-06T06:00:00-08:00",
                            "values": {
                                "humidity": 63,
                                "pressureSeaLevel": 30.11,
                                "temperature": 73.4,
                                "windDirection": 27.94,
                                "windSpeed": 19.15
                            }
                        },
                        {
                            "startTime": "2024-11-06T07:00:00-08:00",
                            "values": {
                                "humidity": 63,
                                "pressureSeaLevel": 30.11,
                                "temperature": 73.4,
                                "windDirection": 26.81,
                                "windSpeed": 19.85
                            }
                        },
                        {
                            "startTime": "2024-11-06T08:00:00-08:00",
                            "values": {
                                "humidity": 63,
                                "pressureSeaLevel": 30.11,
                                "temperature": 73.51,
                                "windDirection": 26.5,
                                "windSpeed": 20.13
                            }
                        },
                        {
                            "startTime": "2024-11-06T09:00:00-08:00",
                            "values": {
                                "humidity": 63,
                                "pressureSeaLevel": 30.11,
                                "temperature": 73.74,
                                "windDirection": 27.31,
                                "windSpeed": 19.85
                            }
                        },
                        {
                            "startTime": "2024-11-06T10:00:00-08:00",
                            "values": {
                                "humidity": 61,
                                "pressureSeaLevel": 30.12,
                                "temperature": 73.85,
                                "windDirection": 27.81,
                                "windSpeed": 19.71
                            }
                        },
                        {
                            "startTime": "2024-11-06T11:00:00-08:00",
                            "values": {
                                "humidity": 60,
                                "pressureSeaLevel": 30.12,
                                "temperature": 73.96,
                                "windDirection": 26.81,
                                "windSpeed": 19.57
                            }
                        },
                        {
                            "startTime": "2024-11-06T12:00:00-08:00",
                            "values": {
                                "humidity": 61,
                                "pressureSeaLevel": 30.12,
                                "temperature": 73.96,
                                "windDirection": 25,
                                "windSpeed": 19.57
                            }
                        },
                        {
                            "startTime": "2024-11-06T13:00:00-08:00",
                            "values": {
                                "humidity": 62,
                                "pressureSeaLevel": 30.12,
                                "temperature": 73.85,
                                "windDirection": 23,
                                "windSpeed": 19.99
                            }
                        },
                        {
                            "startTime": "2024-11-06T14:00:00-08:00",
                            "values": {
                                "humidity": 62,
                                "pressureSeaLevel": 30.12,
                                "temperature": 73.85,
                                "windDirection": 21.63,
                                "windSpeed": 20.27
                            }
                        },
                        {
                            "startTime": "2024-11-06T15:00:00-08:00",
                            "values": {
                                "humidity": 61.83,
                                "pressureSeaLevel": 30.13,
                                "temperature": 73.7,
                                "windDirection": 20.77,
                                "windSpeed": 20.95
                            }
                        },
                        {
                            "startTime": "2024-11-06T16:00:00-08:00",
                            "values": {
                                "humidity": 59.84,
                                "pressureSeaLevel": 30.12,
                                "temperature": 74.23,
                                "windDirection": 24.19,
                                "windSpeed": 20.83
                            }
                        },
                        {
                            "startTime": "2024-11-06T17:00:00-08:00",
                            "values": {
                                "humidity": 61.04,
                                "pressureSeaLevel": 30.12,
                                "temperature": 74.1,
                                "windDirection": 27.63,
                                "windSpeed": 20.2
                            }
                        },
                        {
                            "startTime": "2024-11-06T18:00:00-08:00",
                            "values": {
                                "humidity": 61.01,
                                "pressureSeaLevel": 30.12,
                                "temperature": 74.01,
                                "windDirection": 28.43,
                                "windSpeed": 20.52
                            }
                        },
                        {
                            "startTime": "2024-11-06T19:00:00-08:00",
                            "values": {
                                "humidity": 60.03,
                                "pressureSeaLevel": 30.13,
                                "temperature": 73.88,
                                "windDirection": 28.95,
                                "windSpeed": 21.32
                            }
                        },
                        {
                            "startTime": "2024-11-06T20:00:00-08:00",
                            "values": {
                                "humidity": 59.97,
                                "pressureSeaLevel": 30.13,
                                "temperature": 73.63,
                                "windDirection": 29.41,
                                "windSpeed": 21.5
                            }
                        },
                        {
                            "startTime": "2024-11-06T21:00:00-08:00",
                            "values": {
                                "humidity": 60.15,
                                "pressureSeaLevel": 30.14,
                                "temperature": 73.55,
                                "windDirection": 29.33,
                                "windSpeed": 21.29
                            }
                        },
                        {
                            "startTime": "2024-11-06T22:00:00-08:00",
                            "values": {
                                "humidity": 61.77,
                                "pressureSeaLevel": 30.16,
                                "temperature": 73.4,
                                "windDirection": 28.68,
                                "windSpeed": 20.83
                            }
                        },
                        {
                            "startTime": "2024-11-06T23:00:00-08:00",
                            "values": {
                                "humidity": 63.73,
                                "pressureSeaLevel": 30.16,
                                "temperature": 73.3,
                                "windDirection": 26.18,
                                "windSpeed": 20.61
                            }
                        },
                        {
                            "startTime": "2024-11-07T00:00:00-08:00",
                            "values": {
                                "humidity": 65.01,
                                "pressureSeaLevel": 30.16,
                                "temperature": 73.15,
                                "windDirection": 27.85,
                                "windSpeed": 20.55
                            }
                        },
                        {
                            "startTime": "2024-11-07T01:00:00-08:00",
                            "values": {
                                "humidity": 65.87,
                                "pressureSeaLevel": 30.16,
                                "temperature": 73,
                                "windDirection": 27.55,
                                "windSpeed": 20.36
                            }
                        },
                        {
                            "startTime": "2024-11-07T02:00:00-08:00",
                            "values": {
                                "humidity": 66.61,
                                "pressureSeaLevel": 30.13,
                                "temperature": 72.76,
                                "windDirection": 23.94,
                                "windSpeed": 21.21
                            }
                        },
                        {
                            "startTime": "2024-11-07T03:00:00-08:00",
                            "values": {
                                "humidity": 66.44,
                                "pressureSeaLevel": 30.12,
                                "temperature": 72.61,
                                "windDirection": 22.59,
                                "windSpeed": 21.32
                            }
                        },
                        {
                            "startTime": "2024-11-07T04:00:00-08:00",
                            "values": {
                                "humidity": 65.99,
                                "pressureSeaLevel": 30.11,
                                "temperature": 72.65,
                                "windDirection": 23.43,
                                "windSpeed": 21.09
                            }
                        },
                        {
                            "startTime": "2024-11-07T05:00:00-08:00",
                            "values": {
                                "humidity": 66.04,
                                "pressureSeaLevel": 30.11,
                                "temperature": 72.75,
                                "windDirection": 23.97,
                                "windSpeed": 20.93
                            }
                        },
                        {
                            "startTime": "2024-11-07T06:00:00-08:00",
                            "values": {
                                "humidity": 66.74,
                                "pressureSeaLevel": 30.12,
                                "temperature": 72.88,
                                "windDirection": 22.97,
                                "windSpeed": 20.84
                            }
                        },
                        {
                            "startTime": "2024-11-07T07:00:00-08:00",
                            "values": {
                                "humidity": 66.83,
                                "pressureSeaLevel": 30.12,
                                "temperature": 72.96,
                                "windDirection": 23.25,
                                "windSpeed": 20.57
                            }
                        },
                        {
                            "startTime": "2024-11-07T08:00:00-08:00",
                            "values": {
                                "humidity": 65.59,
                                "pressureSeaLevel": 30.13,
                                "temperature": 73.11,
                                "windDirection": 23.21,
                                "windSpeed": 20.89
                            }
                        },
                        {
                            "startTime": "2024-11-07T09:00:00-08:00",
                            "values": {
                                "humidity": 65.09,
                                "pressureSeaLevel": 30.13,
                                "temperature": 73.19,
                                "windDirection": 21.94,
                                "windSpeed": 20.49
                            }
                        },
                        {
                            "startTime": "2024-11-07T10:00:00-08:00",
                            "values": {
                                "humidity": 65.09,
                                "pressureSeaLevel": 30.14,
                                "temperature": 73.43,
                                "windDirection": 17.87,
                                "windSpeed": 19.43
                            }
                        },
                        {
                            "startTime": "2024-11-07T11:00:00-08:00",
                            "values": {
                                "humidity": 65.72,
                                "pressureSeaLevel": 30.13,
                                "temperature": 73.17,
                                "windDirection": 14.78,
                                "windSpeed": 18.66
                            }
                        },
                        {
                            "startTime": "2024-11-07T12:00:00-08:00",
                            "values": {
                                "humidity": 66.11,
                                "pressureSeaLevel": 30.12,
                                "temperature": 73.22,
                                "windDirection": 12.4,
                                "windSpeed": 18.85
                            }
                        },
                        {
                            "startTime": "2024-11-07T13:00:00-08:00",
                            "values": {
                                "humidity": 64.75,
                                "pressureSeaLevel": 30.11,
                                "temperature": 73.61,
                                "windDirection": 12.59,
                                "windSpeed": 19.43
                            }
                        },
                        {
                            "startTime": "2024-11-07T14:00:00-08:00",
                            "values": {
                                "humidity": 65.13,
                                "pressureSeaLevel": 30.1,
                                "temperature": 73.9,
                                "windDirection": 12.07,
                                "windSpeed": 19.69
                            }
                        },
                        {
                            "startTime": "2024-11-07T15:00:00-08:00",
                            "values": {
                                "humidity": 65.74,
                                "pressureSeaLevel": 30.09,
                                "temperature": 74.22,
                                "windDirection": 14.02,
                                "windSpeed": 19.82
                            }
                        },
                        {
                            "startTime": "2024-11-07T16:00:00-08:00",
                            "values": {
                                "humidity": 67.4,
                                "pressureSeaLevel": 30.09,
                                "temperature": 74.32,
                                "windDirection": 19.39,
                                "windSpeed": 18.76
                            }
                        },
                        {
                            "startTime": "2024-11-07T17:00:00-08:00",
                            "values": {
                                "humidity": 68.39,
                                "pressureSeaLevel": 30.09,
                                "temperature": 74.03,
                                "windDirection": 23.29,
                                "windSpeed": 18.2
                            }
                        },
                        {
                            "startTime": "2024-11-07T18:00:00-08:00",
                            "values": {
                                "humidity": 68.59,
                                "pressureSeaLevel": 30.08,
                                "temperature": 73.83,
                                "windDirection": 25.77,
                                "windSpeed": 17.59
                            }
                        },
                        {
                            "startTime": "2024-11-07T19:00:00-08:00",
                            "values": {
                                "humidity": 66.98,
                                "pressureSeaLevel": 30.07,
                                "temperature": 73.35,
                                "windDirection": 25.83,
                                "windSpeed": 18.76
                            }
                        },
                        {
                            "startTime": "2024-11-07T20:00:00-08:00",
                            "values": {
                                "humidity": 63.21,
                                "pressureSeaLevel": 30.08,
                                "temperature": 73.36,
                                "windDirection": 27.3,
                                "windSpeed": 19.27
                            }
                        },
                        {
                            "startTime": "2024-11-07T21:00:00-08:00",
                            "values": {
                                "humidity": 62.49,
                                "pressureSeaLevel": 30.08,
                                "temperature": 73.37,
                                "windDirection": 26.71,
                                "windSpeed": 18.14
                            }
                        },
                        {
                            "startTime": "2024-11-07T22:00:00-08:00",
                            "values": {
                                "humidity": 61.96,
                                "pressureSeaLevel": 30.09,
                                "temperature": 73.35,
                                "windDirection": 28.03,
                                "windSpeed": 16.79
                            }
                        },
                        {
                            "startTime": "2024-11-07T23:00:00-08:00",
                            "values": {
                                "humidity": 62.17,
                                "pressureSeaLevel": 30.1,
                                "temperature": 73.26,
                                "windDirection": 27.68,
                                "windSpeed": 15.36
                            }
                        },
                        {
                            "startTime": "2024-11-08T00:00:00-08:00",
                            "values": {
                                "humidity": 62.24,
                                "pressureSeaLevel": 30.1,
                                "temperature": 73.24,
                                "windDirection": 26.54,
                                "windSpeed": 14.06
                            }
                        },
                        {
                            "startTime": "2024-11-08T01:00:00-08:00",
                            "values": {
                                "humidity": 61.36,
                                "pressureSeaLevel": 30.09,
                                "temperature": 73.3,
                                "windDirection": 24.75,
                                "windSpeed": 13.63
                            }
                        },
                        {
                            "startTime": "2024-11-08T02:00:00-08:00",
                            "values": {
                                "humidity": 60.97,
                                "pressureSeaLevel": 30.08,
                                "temperature": 73.36,
                                "windDirection": 21.59,
                                "windSpeed": 13.99
                            }
                        },
                        {
                            "startTime": "2024-11-08T03:00:00-08:00",
                            "values": {
                                "humidity": 61.46,
                                "pressureSeaLevel": 30.06,
                                "temperature": 73.24,
                                "windDirection": 18.15,
                                "windSpeed": 15.01
                            }
                        },
                        {
                            "startTime": "2024-11-08T04:00:00-08:00",
                            "values": {
                                "humidity": 61.97,
                                "pressureSeaLevel": 30.06,
                                "temperature": 73.13,
                                "windDirection": 16.16,
                                "windSpeed": 15.4
                            }
                        },
                        {
                            "startTime": "2024-11-08T05:00:00-08:00",
                            "values": {
                                "humidity": 62.34,
                                "pressureSeaLevel": 30.06,
                                "temperature": 73.05,
                                "windDirection": 16.52,
                                "windSpeed": 15.9
                            }
                        },
                        {
                            "startTime": "2024-11-08T06:00:00-08:00",
                            "values": {
                                "humidity": 63.24,
                                "pressureSeaLevel": 30.06,
                                "temperature": 72.97,
                                "windDirection": 19.17,
                                "windSpeed": 16.13
                            }
                        },
                        {
                            "startTime": "2024-11-08T07:00:00-08:00",
                            "values": {
                                "humidity": 64.01,
                                "pressureSeaLevel": 30.06,
                                "temperature": 72.88,
                                "windDirection": 19.39,
                                "windSpeed": 16.35
                            }
                        },
                        {
                            "startTime": "2024-11-08T08:00:00-08:00",
                            "values": {
                                "humidity": 64.02,
                                "pressureSeaLevel": 30.07,
                                "temperature": 72.84,
                                "windDirection": 19.98,
                                "windSpeed": 16.59
                            }
                        },
                        {
                            "startTime": "2024-11-08T09:00:00-08:00",
                            "values": {
                                "humidity": 63.63,
                                "pressureSeaLevel": 30.07,
                                "temperature": 72.93,
                                "windDirection": 19.61,
                                "windSpeed": 16.18
                            }
                        },
                        {
                            "startTime": "2024-11-08T10:00:00-08:00",
                            "values": {
                                "humidity": 63.43,
                                "pressureSeaLevel": 30.07,
                                "temperature": 72.99,
                                "windDirection": 19.68,
                                "windSpeed": 15.53
                            }
                        },
                        {
                            "startTime": "2024-11-08T11:00:00-08:00",
                            "values": {
                                "humidity": 56.24,
                                "pressureSeaLevel": 30.04,
                                "temperature": 72.88,
                                "windDirection": 18.57,
                                "windSpeed": 12.39
                            }
                        },
                        {
                            "startTime": "2024-11-08T12:00:00-08:00",
                            "values": {
                                "humidity": 55.1,
                                "pressureSeaLevel": 30.04,
                                "temperature": 72.95,
                                "windDirection": 18.18,
                                "windSpeed": 12.52
                            }
                        },
                        {
                            "startTime": "2024-11-08T13:00:00-08:00",
                            "values": {
                                "humidity": 54.48,
                                "pressureSeaLevel": 30.03,
                                "temperature": 72.96,
                                "windDirection": 14.14,
                                "windSpeed": 13.19
                            }
                        },
                        {
                            "startTime": "2024-11-08T14:00:00-08:00",
                            "values": {
                                "humidity": 54.83,
                                "pressureSeaLevel": 30.02,
                                "temperature": 72.81,
                                "windDirection": 12.79,
                                "windSpeed": 14.31
                            }
                        },
                        {
                            "startTime": "2024-11-08T15:00:00-08:00",
                            "values": {
                                "humidity": 55.07,
                                "pressureSeaLevel": 30.02,
                                "temperature": 72.69,
                                "windDirection": 14.48,
                                "windSpeed": 14.15
                            }
                        },
                        {
                            "startTime": "2024-11-08T16:00:00-08:00",
                            "values": {
                                "humidity": 55.38,
                                "pressureSeaLevel": 30.01,
                                "temperature": 72.62,
                                "windDirection": 18.14,
                                "windSpeed": 14.72
                            }
                        },
                        {
                            "startTime": "2024-11-08T17:00:00-08:00",
                            "values": {
                                "humidity": 54.59,
                                "pressureSeaLevel": 30,
                                "temperature": 72.56,
                                "windDirection": 21.94,
                                "windSpeed": 15.11
                            }
                        },
                        {
                            "startTime": "2024-11-08T18:00:00-08:00",
                            "values": {
                                "humidity": 54.28,
                                "pressureSeaLevel": 30,
                                "temperature": 72.47,
                                "windDirection": 22.81,
                                "windSpeed": 15.5
                            }
                        },
                        {
                            "startTime": "2024-11-08T19:00:00-08:00",
                            "values": {
                                "humidity": 54.31,
                                "pressureSeaLevel": 29.99,
                                "temperature": 72.48,
                                "windDirection": 23.9,
                                "windSpeed": 16.01
                            }
                        },
                        {
                            "startTime": "2024-11-08T20:00:00-08:00",
                            "values": {
                                "humidity": 54.37,
                                "pressureSeaLevel": 30,
                                "temperature": 72.47,
                                "windDirection": 22.88,
                                "windSpeed": 16.07
                            }
                        },
                        {
                            "startTime": "2024-11-08T21:00:00-08:00",
                            "values": {
                                "humidity": 54.46,
                                "pressureSeaLevel": 30,
                                "temperature": 72.46,
                                "windDirection": 21.41,
                                "windSpeed": 15.88
                            }
                        },
                        {
                            "startTime": "2024-11-08T22:00:00-08:00",
                            "values": {
                                "humidity": 54.51,
                                "pressureSeaLevel": 30.01,
                                "temperature": 72.45,
                                "windDirection": 21.65,
                                "windSpeed": 14.76
                            }
                        },
                        {
                            "startTime": "2024-11-08T23:00:00-08:00",
                            "values": {
                                "humidity": 55.36,
                                "pressureSeaLevel": 30.01,
                                "temperature": 72.5,
                                "windDirection": 22.14,
                                "windSpeed": 14.02
                            }
                        },
                        {
                            "startTime": "2024-11-09T00:00:00-08:00",
                            "values": {
                                "humidity": 56.41,
                                "pressureSeaLevel": 30.01,
                                "temperature": 72.42,
                                "windDirection": 21.17,
                                "windSpeed": 13
                            }
                        },
                        {
                            "startTime": "2024-11-09T01:00:00-08:00",
                            "values": {
                                "humidity": 57.53,
                                "pressureSeaLevel": 30,
                                "temperature": 72.47,
                                "windDirection": 19.36,
                                "windSpeed": 13.12
                            }
                        },
                        {
                            "startTime": "2024-11-09T02:00:00-08:00",
                            "values": {
                                "humidity": 58.8,
                                "pressureSeaLevel": 29.98,
                                "temperature": 72.68,
                                "windDirection": 22.03,
                                "windSpeed": 13.05
                            }
                        },
                        {
                            "startTime": "2024-11-09T03:00:00-08:00",
                            "values": {
                                "humidity": 59.75,
                                "pressureSeaLevel": 29.96,
                                "temperature": 73.15,
                                "windDirection": 21.72,
                                "windSpeed": 12.93
                            }
                        },
                        {
                            "startTime": "2024-11-09T04:00:00-08:00",
                            "values": {
                                "humidity": 62.05,
                                "pressureSeaLevel": 29.95,
                                "temperature": 73.26,
                                "windDirection": 26.1,
                                "windSpeed": 13.64
                            }
                        },
                        {
                            "startTime": "2024-11-09T05:00:00-08:00",
                            "values": {
                                "humidity": 63.43,
                                "pressureSeaLevel": 29.96,
                                "temperature": 73.33,
                                "windDirection": 23.94,
                                "windSpeed": 14.02
                            }
                        },
                        {
                            "startTime": "2024-11-09T06:00:00-08:00",
                            "values": {
                                "humidity": 63.96,
                                "pressureSeaLevel": 29.95,
                                "temperature": 73.48,
                                "windDirection": 25.89,
                                "windSpeed": 14.7
                            }
                        }
                    ]
                }
            ]
        }
    };
    return res.json(data);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
