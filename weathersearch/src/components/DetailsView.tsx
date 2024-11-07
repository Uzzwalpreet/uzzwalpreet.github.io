import React, { useEffect, useRef }from 'react';
import { motion } from 'framer-motion';

interface DetailsViewProps {
  date: string;
  onListClick: () => void;
  details: any;
  city: string;
  state: string;
  lat: number;
  lng: number
}

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };


  function formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  }

  function getStatus(code: number): string {
    const weatherInfo = weatherCodeText.get(code);
    return weatherInfo ? weatherInfo[0] : "Unknown";

  }
  
const weatherCodeText = new Map<number, [string, string]>();
  // Weather code mappings
weatherCodeText.set(4201, ['Heavy Rain', '/static/weathercodes/rain_heavy.svg']); 
weatherCodeText.set(4001, ['Rain', '/static/weathercodes/rain.svg']);
weatherCodeText.set(4200, ['Light Rain', '/static/weathercodes/rain_light.svg']);
weatherCodeText.set(6201, ['Heavy Freezing Rain', '/static/weathercodes/freezing_rain_heavy.svg']);
weatherCodeText.set(6001, ['Freezing Rain', '/static/weathercodes/freezing_rain.svg']);
weatherCodeText.set(6200, ['Light Freezing Rain', '/static/weathercodes/freezing_rain_light.svg']);
weatherCodeText.set(6000, ['Freezing Drizzle', '/static/weathercodes/freezing_drizzle.svg']);
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

const DetailsView: React.FC<DetailsViewProps> = ({ date, onListClick, details, city, state, lat, lng }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("Latitue", lat, "longitutde", lng)
    if (window.google && mapRef.current) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 13,
      });
      new window.google.maps.Marker({
        position: { lat, lng },
        map,
      });
    }
  }, [lat, lng]);
  if (!details) {
    return <p>No data available for the selected date.</p>;
  }
  console.log('detail page data:',details);

  const weatherStatus = getStatus(details.weatherCode) || "Unknown";
  const temperature = details.temperatureMax || "N/A";

  const twitterText = encodeURIComponent(
    `The temperature in ${city}, ${state} on ${formatDate(date)} is ${temperature}°F. The weather conditions are ${weatherStatus} #CSCI571WeatherSearch`
  );

  const slideIn = {
    hidden: { x: '100%', opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: '-100%', opacity: 0 }
  };
  
  return (

    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={slideIn}
      transition={{ duration: 0.5 }}
      className="details-view"
    >

    <div className="details-view">
<div className="d-flex align-items-center justify-content-between">
  <button onClick={onListClick} className="bi bi-chevron-left">List</button>
  <h4 className="text-center mb-0 flex-grow-1">Details for {formatDate(date)}</h4>
    <a className="twitter-share-button" href={`https://twitter.com/intent/tweet?text=${twitterText}`}>
    <button className=" bi bi-twitter-x btn btn-light" style={{ fontSize: '1.5rem' }}> 
      </button>
    </a>
</div>


      <table className="table table-striped">
        <tbody>
          <tr>
            <th>Status</th>
            <td>{getStatus(details.weatherCode) || "N/A"}</td>
          </tr>
          <tr>
            <th>Max Temperature</th>
            <td>{details.temperatureMax || "N/A"} °F</td>
          </tr>
          <tr>
            <th>Min Temperature</th>
            <td>{details.temperatureMin || "N/A"} °F</td>
          </tr>
          <tr>
            <th>Apparent Temperature</th>
            <td>{details.temperatureApparent || "N/A"} °F</td>
          </tr>
          <tr>
            <th>Sun Rise Time</th>
            <td>{formatTime(details.sunriseTime)}</td>
          </tr>
          <tr>
            <th>Sun Set Time</th>
            <td>{formatTime(details.sunsetTime)}</td>
          </tr>
          <tr>
            <th>Humidity</th>
            <td>{details.humidity || "N/A"}%</td>
          </tr>
          <tr>
            <th>Wind Speed</th>
            <td>{details.windSpeed || "N/A"} mph</td>
          </tr>
          <tr>
            <th>Visibility</th>
            <td>{details.visibility || "N/A"} mi</td>
          </tr>
          <tr>
            <th>Cloud Cover</th>
            <td>{details.cloudCover || "0"}%</td>
          </tr>
        </tbody>
      </table>
      <div ref={mapRef} style={{ height: '500px', width: '100%', marginTop: '20px' }}></div>

    </div>
    </motion.div>
  );
};

export default DetailsView;
