import React, { useEffect, useState, useRef } from 'react';
export interface MeteogramProps {
  latitude: number;
  longitude: number;
  startTime: string;
}


const Meteogram: React.FC<MeteogramProps> = ({ latitude, longitude, startTime }) => {
  const hasFetchedData = useRef(false);

  useEffect(() => {
    const fetchWeatherData = async () => {
      console.log("CALL TO HOURLY DATA");
      try {
        const response = await fetch(
          `http://localhost:5001/weather-hourly?lat=${latitude}&lng=${longitude}&startTime=${startTime}`
        );
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        console.log("Data", data);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };

    if (!hasFetchedData.current) {
      fetchWeatherData();
      hasFetchedData.current = true; // Mark as fetched to prevent future calls
    }
  }, [latitude, longitude, startTime]);

  return (
    <div className="container mt-3">
      <h5 className="text-center">Hourly Meteogram</h5>
    </div>
  );
};

export default Meteogram;
