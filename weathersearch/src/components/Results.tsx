import React, {useState} from "react";
import DailyView from "./DailyView";
import DailyTempChart from "./DailyTempChart";
import Meteogram from "./Meteogram";

export interface WeatherData {
    date: String;
    status: String;
    tempHigh: number;
    tempLow: number;
    windSpeed: number;
}
interface ResultsProps {
    data: WeatherData[];
    city: string;
    state: string;
}

const ResultsTabs : React.FC<ResultsProps> = ({ data, city, state }) => {
    const [currentTab, setCurrentTab] = useState('dailyView');
    return (
        <div className="container mt-4">
          {/* Header */}
          <h4 className="text-center mb-4">
            Forecast at {city}, {state}
          </h4>
    
          {/* Tab Buttons */}
          <div className="d-flex justify-content-center mb-3">
            <button
              className={`btn ${currentTab === 'dailyView' ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
              onClick={() => setCurrentTab('dailyView')}
            >
              Daily View
            </button>
            <button
              className={`btn ${currentTab === 'tempChart' ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
              onClick={() => setCurrentTab('tempChart')}
            >
              Daily Temp Chart
            </button>
            <button
              className={`btn ${currentTab === 'meteogram' ? 'btn-primary' : 'btn-outline-primary'} mx-1`}
              onClick={() => setCurrentTab('meteogram')}
            >
              Meteogram
            </button>
          </div>
    
          {/* Tab Content */}
          <div className="card p-3 shadow-sm">
            {currentTab === 'dailyView' && <DailyView data={data} />}
            {currentTab === 'tempChart' && <DailyTempChart data={data} />}
            {currentTab === 'meteogram' && <Meteogram data={data} />}
          </div>
        </div>
      );
    };

export default ResultsTabs;