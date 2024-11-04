import React, { useEffect } from 'react';
import Highcharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import 'bootstrap/dist/css/bootstrap.min.css';

HighchartsMore(Highcharts);

const DailyTempChart: React.FC<{ data: any }> = ({ data }) => {
  const startTimeArr: string[] = [];
  const temperatureMax: number[] = [];
  const temperatureMin: number[] = [];

  data.data.timelines[0].intervals.forEach((item: any) => {
    startTimeArr.push(item.startTime);
    temperatureMax.push(item.values.temperatureMax);
    temperatureMin.push(item.values.temperatureMin);
  });

  const getDay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const formatDateChart = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    if (!data) return;

    const weekDay = startTimeArr.slice(0, 6).map((time) => getDay(time));
    
    const options: Highcharts.Options = {
      chart: {
        type: 'arearange'
      },
      title: {
        text: 'Temperature Ranges (Min, Max)'
      },
      xAxis: {
        categories: startTimeArr.slice(0, 6).map((time) => formatDateChart(time)),
        crosshair: {
          width: 1,
          dashStyle: 'Solid',
          color: 'rgb(189, 189, 189)'
        }
      },
      yAxis: {
        tickInterval: 5,
        title: {
          text: null
        }
      },
      series: [{
        type: 'arearange',
        data: temperatureMax.slice(0, 6).map((maxTemp, i) => [temperatureMin[i], maxTemp]),
        fillOpacity: 0.5,
        color: 'orange',
        fillColor: {
          linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
          stops: [
            [0, 'rgba(255, 152, 0, 0.6)'], 
            [1, 'rgba(0, 121, 199, 0.4)']  
          ]
        }, 
        marker: {
          enabled: true,
          radius: 4,
          fillColor: '#5db4ee'
        }
      }],    
      legend: {
        enabled: false
      },
      tooltip: {
        formatter: function() {
          const day = weekDay[this.point.index];
          const dateString = startTimeArr[this.point.index];
          const formattedDate = formatDateChart(dateString);
          const blueDot = `<span style="color:#5db4ee;">&#9679;</span>`;
          const dateStyle = `<span style="font-size:10px;">${day}, ${formattedDate}</span>`;
          return `${dateStyle}<br/>${blueDot}Temperatures: <b>${this.point.low}°F</b> - <b>${this.point.high}°F</b>`;
        }
      }
    };

    Highcharts.chart('chart1', options);
  }, [data]);

  return (
    <div className="container mt-3">
      <div className="card shadow-sm p-3 mb-4">
        <div className="card-body">
          <div id="chart1" className="d-flex justify-content-center"></div>
        </div>
      </div>
    </div>
  );
};

export default DailyTempChart;
