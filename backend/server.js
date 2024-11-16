const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 8080; 
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


app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
