import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./DetailedCard.css";

const DetailedCard = () => {
  const { id } = useParams();
  const [card, setCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCardData = async () => {
      const allCards = [
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
      const cardDetails = allCards.find((card) => card.id === parseInt(id));
      setCard(cardDetails);
    };
    fetchCardData();
  }, [id]);

  if (!card) {
    return (
      <div className="card-detail-container">
        <div className="card-detail">
          <p style={{ color: '#e0e0e0' }}>Loading...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (percentage) => {
    if (percentage >= 80) return '#4CAF50';  // Green
    if (percentage >= 60) return '#FFC107';  // Yellow
    return '#f44336';  // Red
  };

  const getStatusText = (percentage) => {
    if (percentage >= 80) return 'Optimal';
    if (percentage >= 60) return 'Warning';
    return 'Critical';
  };

  return (
    <div className="card-detail-container">
      <div className="card-detail">
        <div className="header-row">
          <h2 className="card-title">{card.name} Details</h2>
          <div 
            className="status-indicator"
            style={{ backgroundColor: getStatusColor(card.percentage) }}
          >
            {getStatusText(card.percentage)}
          </div>
        </div>
        
        <div className="info-box percentage">
          <div style={{ width: '120px', margin: '0 auto' }}>
            <CircularProgressbar
              value={card.percentage}
              text={`${card.percentage}%`}
              styles={buildStyles({
                textSize: '16px',
                pathColor: `rgba(62, 152, 199, ${card.percentage / 100})`,
                textColor: '#e0e0e0',
                trailColor: '#333',
              })}
            />
          </div>
        </div>

        <div className="card-info">
          <div className="info-box">
            <div className="info-label">Gas Injection</div>
            <div className="info-value">{card.value1}</div>
          </div>
          
          <div className="info-box">
            <div className="info-label">Set Point</div>
            <div className="info-value">{card.value2}</div>
          </div>
          
          <div className="info-box">
            <div className="info-label">Valve Open</div>
            <div className="info-value">{card.value3.toFixed(2)}%</div>
          </div>
        </div>

        <button className="back-button" onClick={() => navigate("/")}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default DetailedCard;