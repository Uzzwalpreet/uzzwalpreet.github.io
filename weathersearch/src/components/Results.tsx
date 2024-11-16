import React, { useState, useEffect } from "react";
import DailyView from "./DailyView";
import DailyTempChart from "./DailyTempChart";
import Meteogram from "./Meteogram";
import DetailsView from "./DetailsView";
import { motion } from "framer-motion";

interface ResultsProps {
  data: any;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  isFavorite: boolean;
}

const ResultsTabs: React.FC<ResultsProps> = ({
  data,
  city,
  state,
  latitude,
  longitude,
  isFavorite,
}) => {
  const [currentTab, setCurrentTab] = useState("dailyView");
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const [isFavoriteSet, setIsFavoriteSet] = useState(isFavorite);

  useEffect(() => {
    setIsFavoriteSet(isFavorite);
  }, [isFavorite]);

  useEffect(() => {
    if (!selectedDate && data.data.timelines[0].intervals.length > 0) {
      setSelectedDate(data.data.timelines[0].intervals[0].startTime);
    }
  }, [data, selectedDate]);

  const handleDetailsButtonClick = () => {
    setShowDetails(true);
    setShouldAnimate(true);
  };

  const handleDateClick = (date: string) => {
    setSelectedDate(date);
    setShowDetails(true);
    setShouldAnimate(true);
  };

  const handleListClick = () => {
    setShowDetails(false);
    setShouldAnimate(true);
  };

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab);
    setShouldAnimate(false);
  };
  

  const handleStarClick = async () => {
    setIsFavoriteSet(!isFavoriteSet);

    try {
      if (isFavoriteSet) {
        // Unfavorite the location
        const response = await fetch(
          `https://assignmentthreebackenduzzwal.wl.r.appspot.com/api/favorites/delete2`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              city,
              state,
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to delete data from the backend");
        }
        console.log("Data removed from favorites");
      } else {
        // Favorite the location
        const response = await fetch(
          "https://assignmentthreebackenduzzwal.wl.r.appspot.com/sendToDB",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              city,
              state,
              latitude,
              longitude,
            }),
          }
        );
        if (!response.ok) {
          throw new Error("Failed to send data to the backend");
        }
        console.log("Data saved to favorites");
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  const details = selectedDate
    ? data.data.timelines[0].intervals.find(
        (item: any) => item.startTime === selectedDate
      )?.values
    : null;

  const slideIn = {
    hidden: { x: "-100%", opacity: 0 },
    visible: { x: 0, opacity: 1 },
    exit: { x: "-100%", opacity: 0 },
  };

  return (
    <div className="container mt-4">
      {!showDetails && (
        <>
          <h4 className="text-center mb-4">
            Forecast at {city}, {state}
          </h4>
          <div className="mb-2" style={{ textAlign: "right" }}>
            <div style={{ display: "inline-flex", alignItems: "center" }}>
              <button
                type="button"
                onClick={handleStarClick}
                className="btn d-flex align-items-center p-1 rounded"
                style={{
                  border: "1px solid black",
                  backgroundColor: "transparent",
                  marginRight: "8px",
                }}
              >
                <span
                  className="material-icons"
                  style={{
                    color: isFavoriteSet ? "yellow" : "white",
                    WebkitTextStroke: "1px black",
                  }}
                >
                  star
                </span>
              </button>
              <button
                onClick={handleDetailsButtonClick}
                className="btn btn-link"
                style={{ color: "black" }}
              >
                Details &gt;
              </button>
            </div>
          </div>
          <ul className="nav nav-tabs justify-content-end align-items-center mb-1">
            <li className="nav-item">
              <button
                className={`nav-link ${
                  currentTab === "dailyView" ? "active" : ""
                }`}
                onClick={() => handleTabChange("dailyView")}
              >
                Daily View
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  currentTab === "tempChart" ? "active" : ""
                }`}
                onClick={() => handleTabChange("tempChart")}
              >
                Daily Temp Chart
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link ${
                  currentTab === "meteogram" ? "active" : ""
                }`}
                onClick={() => handleTabChange("meteogram")}
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
            {currentTab === "dailyView" && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={slideIn}
                transition={{ duration: 0.5 }}
                {...(!shouldAnimate && { animate: "visible", initial: "visible" })}
              >
                <DailyView data={data} onDateClick={handleDateClick} />
              </motion.div>
            )}
            {currentTab === "tempChart" && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={slideIn}
                transition={{ duration: 0.5 }}
                {...(!shouldAnimate && { animate: "visible", initial: "visible" })}
              >
                <DailyTempChart data={data} />
              </motion.div>
            )}
            {currentTab === "meteogram" && (
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={slideIn}
                transition={{ duration: 0.5 }}
                {...(!shouldAnimate && { animate: "visible", initial: "visible" })}
              >
                <Meteogram
                  latitude={latitude}
                  longitude={longitude}
                  startTime={data.data.timelines[0].startTime}
                />
              </motion.div>
            )}
          </>
        ) : (
          <DetailsView
            date={selectedDate || ""}
            onListClick={handleListClick}
            details={details || {}}
            city={city || ""}
            state={state || ""}
            lat={latitude}
            lng={longitude}
          />
        )}
      </div>
    </div>
  );
};

export default ResultsTabs;
