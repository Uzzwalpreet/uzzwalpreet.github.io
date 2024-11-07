import React, { useState, useEffect } from "react";
import DailyView from "./DailyView";
import DailyTempChart from "./DailyTempChart";
import Meteogram from "./Meteogram";
import DetailsView from "./DetailsView";

interface ResultsProps {
    data: any;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
}

const ResultsTabs: React.FC<ResultsProps> = ({ data, city, state, latitude, longitude }) => {
    const [currentTab, setCurrentTab] = useState('dailyView');
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [showDetails, setShowDetails] = useState(false);

    // Ensure first date is selected initially
    useEffect(() => {
        if (!selectedDate && data.data.timelines[0].intervals.length > 0) {
            setSelectedDate(data.data.timelines[0].intervals[0].startTime);
        }
    }, [data, selectedDate]);

    // Handle "Details >" button click
    const handleDetailsButtonClick = () => {
        setShowDetails(true);
    };

    const handleDateClick = (date: string) => {
        setSelectedDate(date);
        setShowDetails(true);
    };

    const handleListClick = () => {
        setShowDetails(false);
    };

    const details = selectedDate ? data.data.timelines[0].intervals.find(
        (item: any) => item.startTime === selectedDate
    )?.values : null;

    return (
        <div className="container mt-4">
          
          {!showDetails && (
            <>
              <h4 className="text-center mb-4">
                    Forecast at {city}, {state}
              </h4>
              <div className="mb-2" style={{ textAlign: "right" }}>
                <button onClick={handleDetailsButtonClick} className="btn btn-link" style={{ color: "black" }}>
                  Details &gt;
                </button>
              </div>
              <ul className="nav nav-tabs justify-content-end">
                <li className="nav-item">
                  <button
                    className={`nav-link ${currentTab === 'dailyView' ? 'active' : ''}`}
                    onClick={() => setCurrentTab('dailyView')}
                  >
                    Daily View
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${currentTab === 'tempChart' ? 'active' : ''}`}
                    onClick={() => setCurrentTab('tempChart')}
                  >
                    Daily Temp Chart
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${currentTab === 'meteogram' ? 'active' : ''}`}
                    onClick={() => setCurrentTab('meteogram')}
                  >
                    Meteogram
                  </button>
                </li>
              </ul>
            </>
          )}

          <div>
            {!showDetails ? (
              <>
                {currentTab === 'dailyView' && <DailyView data={data} onDateClick={handleDateClick} />}
                {currentTab === 'tempChart' && <DailyTempChart data={data} />}
                {currentTab === 'meteogram' && (
                  <Meteogram latitude={latitude} longitude={longitude} startTime={data.data.timelines[0].startTime} />
                )}
              </>
            ) : (
              <DetailsView 
                date={selectedDate || ''} 
                onListClick={handleListClick} 
                details={details || {}} 
                city = {city || ''}
                state = {state || ''}
                lat = {latitude}
                lng = {longitude}
              />
            )}
          </div>
        </div>
    );
};

export default ResultsTabs;