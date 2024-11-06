import React from 'react';

interface DetailsViewProps {
  date: string;
  onListClick: () => void;
  details: any;
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

const DetailsView: React.FC<DetailsViewProps> = ({ date, onListClick, details }) => {
  if (!details) {
    return <p>No data available for the selected date.</p>;
  }
  console.log('detail page data:',details);
  return (
    <div className="details-view">
      <button onClick={onListClick} className="btn btn-secondary mb-3">List</button>
      <h4 className="text-center mb-4">Details for {formatDate(date)}</h4>

      <table className="table table-striped">
        <tbody>
          <tr>
            <td>Status</td>
            <td>{getStatus(details.weatherCode) || "N/A"}</td>
          </tr>
          <tr>
            <td>Max Temperature</td>
            <td>{details.temperatureMax || "N/A"} °F</td>
          </tr>
          <tr>
            <td>Min Temperature</td>
            <td>{details.temperatureMin || "N/A"} °F</td>
          </tr>
          <tr>
            <td>Apparent Temperature</td>
            <td>{details.temperatureApparent || "N/A"} °F</td>
          </tr>
          <tr>
            <td>Sun Rise Time</td>
            <td>{formatTime(details.sunriseTime)}</td>
          </tr>
          <tr>
            <td>Sun Set Time</td>
            <td>{formatTime(details.sunsetTime)}</td>
          </tr>
          <tr>
            <td>Humidity</td>
            <td>{details.humidity || "N/A"}%</td>
          </tr>
          <tr>
            <td>Wind Speed</td>
            <td>{details.windSpeed || "N/A"} mph</td>
          </tr>
          <tr>
            <td>Visibility</td>
            <td>{details.visibility || "N/A"} mi</td>
          </tr>
          <tr>
            <td>Cloud Cover</td>
            <td>{details.cloudCover || "N/A"}%</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default DetailsView;
