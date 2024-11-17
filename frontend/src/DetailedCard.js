import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useParams
import "./DetailedCard.css"; // Import updated CSS for styling

const DetailedCard = () => {
  const { id } = useParams(); // Get the id from the URL
  const [card, setCard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Simulate loading card data based on id
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

      const cardDetails = allCards.find((card) => card.id === parseInt(id)); // Find the card by id
      setCard(cardDetails);
    };

    fetchCardData();
  }, [id]);

  return (
    <div className="card-detail-container">
      {card ? (
        <div className="card-detail">
          <h2>{card.name} Details</h2>
          <div className="card-info">
            <div className="card-item">
              <strong>Percentage:</strong> {card.percentage}%
            </div>
            <div className="card-item">
              <strong>Gas Injected:</strong> {card.value1}
            </div>
            <div className="card-item">
              <strong>Set Point:</strong> {card.value2}
            </div>
            <div className="card-item">
              <strong>Valve Open:</strong> {card.value3.toFixed(2)}
            </div>
          </div>
          <button className="back-button" onClick={() => navigate("/")}>Back</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default DetailedCard;