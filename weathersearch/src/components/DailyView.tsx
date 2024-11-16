import React from "react";

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

type Interval = {
  date: string;  
  weatherCode: number;
  temperatureHigh: number;
  temperatureLow: number;
  windSpeed: number;
};

const DailyView: React.FC<{ data: any, onDateClick: (date: string) => void }> = ({ data, onDateClick }) => {
  const intervals: Interval[] = data.data.timelines[0].intervals.map((item: any) => ({
    date: item.startTime,
    weatherCode: item.values.weatherCode,
    temperatureHigh: item.values.temperatureMax,
    temperatureLow: item.values.temperatureMin,
    windSpeed: item.values.windSpeed,
  }));

  return (
    <div className="container mt-4">
      <table className="table">
        <thead className="thead-dark">
          <tr>
            <th>#</th>
            <th>Date</th>
            <th>Status</th>
            <th>Temp. High (°F)</th>
            <th>Temp. Low (°F)</th>
            <th>Wind Speed (mph)</th>
          </tr>
        </thead>
        <tbody>
          {intervals.map((interval, index) => {
            const formattedDate = new Date(interval.date).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            const weatherInfo = weatherCodeText.get(interval.weatherCode);
            const weatherDescription = weatherInfo ? weatherInfo[0] : 'Unknown';
            const weatherImage = weatherInfo ? weatherInfo[1] : '';

            return (
              <tr
                key={index}
                onClick={() => onDateClick(interval.date)}
                style={{ cursor: "pointer" }}
              >
                <td>{index + 1}</td>
                <td>
                  <span
                    style={{
                      color: "#007bff",
                      textDecoration: "underline",
                      cursor: "pointer",
                    }}
                  >
                    {formattedDate}
                  </span>
                </td>
                <td>
                  {weatherImage && (
                    <img
                      src={weatherImage}
                      alt={weatherDescription}
                      width="30"
                      height="30"
                      className="mr-2" id="weatherimgicon"
                    />
                  )}
                  <span>{weatherDescription}</span>
                </td>
                <td>{interval.temperatureHigh}</td>
                <td>{interval.temperatureLow}</td>
                <td>{interval.windSpeed}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DailyView;