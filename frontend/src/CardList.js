import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "react-circular-progressbar/dist/styles.css";
import "./CardList.css"; // Import the updated CSS file

const CardList = () => {
  const [cardsData, setCardsData] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  // Simulate loading data from multiple CSV files
  useEffect(() => {
    const loadCSVFiles = async () => {
      // Replace with actual logic to load and parse CSV files
      const csvFiles = [
        { id: 1, name: "COURAGEOUS", percentage: 75, value1: 123, value2: 456, value3: 789 },
        { id: 2, name: "FEARLESS", percentage: 50, value1: 321, value2: 654, value3: 987 },
        { id: 3, name: "GALLANT", percentage: 90, value1: 111, value2: 222, value3: 333 },
        { id: 4, name: "NOBLE", percentage: 60, value1: 234, value2: 567, value3: 890 },
        { id: 5, name: "RESOLUTE", percentage: 80, value1: 432, value2: 876, value3: 543 },
        { id: 6, name: "RUTHLESS", percentage: 40, value1: 543, value2: 210, value3: 678 },
        { id: 7, name: "STEADFAST", percentage: 70, value1: 654, value2: 321, value3: 987 },
        { id: 8, name: "VALIANT", percentage: 85, value1: 111, value2: 999, value3: 222 },
        { id: 9, name: "DAUNTLESS", percentage: 95, value1: 777, value2: 555, value3: 333 },
      ];

      // Simulate asynchronous data fetching
      setCardsData(csvFiles);
    };

    loadCSVFiles();
  }, []);

  const handleClick = (card) => {
    // Navigate to the detailed card page
    navigate(`/card/${card.id}`);
  };

  return (
    <div className="card-list">
      {cardsData.map((card) => (
        <div
          key={card.id}
          className="card"
          onClick={() => handleClick(card)} // Navigate when clicked
        >
          <div className="progress-bar-container">
            <CircularProgressbar
              value={card.percentage}
              text={`${card.percentage}%`}
              styles={buildStyles({
                textSize: "16px",
                pathColor: `rgba(62, 152, 199, ${card.percentage / 100})`,
                textColor: "#e0e0e0",
                trailColor: "#333",
              })}
            />
          </div>
          <div className="card-values">
            <p><strong>{card.name}</strong></p>
            <p>Value 1: {card.value1}</p>
            <p>Value 2: {card.value2}</p>
            <p>Value 3: {card.value3}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardList;
