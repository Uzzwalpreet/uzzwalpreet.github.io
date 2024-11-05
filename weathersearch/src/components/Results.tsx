import React, { useState } from "react";
import DailyView from "./DailyView";
import DailyTempChart from "./DailyTempChart";
import Meteogram from "./Meteogram";

interface ResultsProps {
    data: any;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
}

const ResultsTabs: React.FC<ResultsProps> = ({ data, city, state, latitude, longitude }) => {
    const [currentTab, setCurrentTab] = useState('dailyView');

    return (
        <div className="container mt-4">
          <h4 className="text-center mb-4">
            Forecast at {city}, {state}
          </h4>
          {/* <div className="d-flex justify-content-end mb-3"> */}
            <ul className="nav nav-tabs justify-content-end mb-3">
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
          {/* </div> */}
          <div>
            {currentTab === 'dailyView' && <DailyView data={data} />}
            {currentTab === 'tempChart' && <DailyTempChart data={data} />}
            {currentTab === 'meteogram' && <Meteogram latitude={latitude} longitude={longitude} startTime={data.data.timelines[0].startTime} />}
          </div>
        </div>
    );
};

export default ResultsTabs;
