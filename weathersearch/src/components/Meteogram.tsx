import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import Windbarb from 'highcharts/modules/windbarb';
import highchartsMore from 'highcharts/highcharts-more';

highchartsMore(Highcharts);
Windbarb(Highcharts);

export interface MeteogramProps {
  latitude: number;
  longitude: number;
  startTime: string;
}

const Meteogram: React.FC<MeteogramProps> = ({ latitude, longitude, startTime }) => {
  console.log("YES")
  const [temperature, setTemperature] = useState<{ x: number; y: number }[]>([]);
  const [humidity, setHumidity] = useState<{ x: number; y: number }[]>([]);
  const [airPressure, setAirPressure] = useState<{ x: number; y: number }[]>([]);
  const [winds, setWinds] = useState<{ x: number; value: number; direction: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `http://localhost:5001/weather-hourly?lat=${latitude}&lng=${longitude}&startTime=${startTime}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        parseWeatherData(data);
      } catch (err) {
        setError("Error fetching data: ");
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [latitude, longitude, startTime]);

  // Parse the fetched data and set state variables
  const parseWeatherData = (data: any) => {
    const tempData: { x: number; y: number }[] = [];
    const humData: { x: number; y: number }[] = [];
    const airPressureData: { x: number; y: number }[] = [];
    const windData: { x: number; value: number; direction: number }[] = [];

    const timeline = data.data.timelines[0];
    timeline.intervals.forEach((interval: any, i: number) => {
      const x = Date.parse(interval.startTime);
      const values = interval.values;

      tempData.push({ x, y: Math.round(values.temperature) });
      humData.push({ x, y: Math.round(values.humidity) });
      airPressureData.push({ x, y: Math.round(values.pressureSeaLevel) });

      if (i % 2 === 0) { // Only add wind data every other interval
        windData.push({
          x,
          value: Math.round(values.windSpeed),
          direction: Math.round(values.windDirection)
        });
      }
    });

    setTemperature(tempData);
    setHumidity(humData);
    setAirPressure(airPressureData);
    setWinds(windData);
  };

  // Chart options
  const getChartOptions = (): Highcharts.Options => ({
    chart: {
      renderTo: 'chart2',
      marginBottom: 70,
      marginRight: 40,
      marginTop: 50,
      plotBorderWidth: 1,
      height: 380,
      alignTicks: false,
      scrollablePlotArea: {
        minWidth: 720
      }
    },
    title: {
      text: 'Hourly Weather (For Next 5 Days)',
      align: 'center',
      style: {
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis'
      }
    },
    legend: {
      enabled: false // Disable the legend for the entire chart
    },
    xAxis: [
      {
        type: 'datetime',
        tickInterval: 2 * 36e5, // two hours
        minorTickInterval: 36e5, // one hour
        tickLength: 0,
        gridLineWidth: 1,
        gridLineColor: 'rgba(128, 128, 128, 0.1)',
        startOnTick: false,
        endOnTick: false,
        minPadding: 0,
        maxPadding: 0,
        offset: 30,
        showLastLabel: true,
        labels: {
          format: '{value:%H}'
        },
        crosshair: true
      },
      {
        linkedTo: 0,
        type: 'datetime',
        tickInterval: 24 * 3600 * 1000,
        labels: {
          format: '{value:<span style="font-size: 12px; font-weight: bold">%a</span> %b %e}',
          align: 'left',
          x: 3,
          y: 8
        },
        opposite: true,
        tickLength: 20,
        gridLineWidth: 1
      }
    ],
    yAxis: [
      {
        title: { text: null },
        labels: { format: '{value}°', style: { fontSize: '10px' }, x: -3 },
        plotLines: [{ value: 0, color: '#BBBBBB', width: 1, zIndex: 2 }],
        maxPadding: 0.3,
        minRange: 8,
        tickInterval: 1,
        gridLineColor: 'rgba(128, 128, 128, 0.1)'
      },
      { // precipitation axis
        title: { text: null },
        labels: { enabled: false },
        gridLineWidth: 0,
        tickLength: 0,
        minRange: 10,
        min: 0
      },
      {
        allowDecimals: false,
        title: {
          text: 'inHg',
          offset: 0,
          align: 'high',
          rotation: 0,
          style: { fontSize: '10px', color: '#000' },
          textAlign: 'left',
          x: 3
        },
        labels: { style: { fontSize: '8px', color: '#000' }, y: 2, x: 3 },
        gridLineWidth: 0,
        opposite: true,
        showLastLabel: false
      }
    ],
    tooltip: { shared: true, useHTML: true },
    plotOptions: {
      series: { pointPlacement: 'between' }
    },
    series: [
      {
        name: 'Humidity',
        data: humidity,
        type: 'column',
        color: '#68CFE8',
        yAxis: 1,
        groupPadding: 0,
        pointPadding: 0,
        grouping: false,
        dataLabels: {
          enabled: true,
          filter: { operator: '>', property: 'y', value: 0 },
          style: { fontSize: '8px', color: '#666' }
        },
        tooltip: { valueSuffix: ' %' }
      },
      {
        name: 'Temperature',
        data: temperature,
        type: 'spline',
        marker: {
          enabled: false,
          states: { hover: { enabled: true } }
        },
        tooltip: {
          pointFormat: '<span style="color:{point.color}">●</span> {series.name}: <b>{point.y}°F</b><br/>'
        },
        zIndex: 1,
        color: '#FF3333',
        negativeColor: '#48AFE8'
      },
      {
        name: 'Air pressure',
        color: 'orange',
        type: 'spline',
        data: airPressure,
        marker: { enabled: false },
        shadow: false,
        tooltip: { valueSuffix: ' inHg' },
        // dashStyle: 'shortdot',
        yAxis: 2
      },
      {
        name: 'Wind',
        type: 'windbarb',
        color: '#000',
        lineWidth: 1.5,
        data: winds,
        vectorLength: 18,
        yOffset: -15,
        tooltip: { valueSuffix: ' m/s' },
        showInLegend: false
      }
    ]
  });

  useEffect(() => {
    if (!loading && !error) {
      Highcharts.chart('chart2', getChartOptions());
    }
  }, [temperature, humidity, airPressure, winds, loading, error]);

  return (
    <div className="container mt-3">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <div id="chart2"></div>
      )}
    </div>
  );
};

export default Meteogram;
