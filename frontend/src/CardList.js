import React, { useState, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./CardList.css"; // Import the updated CSS file

const CardList = () => {
  const [wellInfo, setWellInfo] = useState({});
  const [selectedWell, setSelectedWell] = useState(null);
  const [historicalData, setHistoricalData] = useState({});

  useEffect(() => {
    const eventSource = new EventSource("http://127.0.0.1:8000/wells");
    eventSource.onopen = () => console.log(">>> Connection opened!");
    eventSource.onerror = (e) => console.log("ERROR!", e);

    eventSource.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      console.log("NewData:", newData);

      setWellInfo((prevData) => ({
        ...prevData,
        ...Object.fromEntries(
          Object.entries(newData).map(([well, data]) => [well, data])
        ),
      }));

      setHistoricalData((prevHistory) => {
        const newHistory = { ...prevHistory };
        Object.entries(newData).forEach(([well, data]) => {
          if (!newHistory[well]) {
            newHistory[well] = [];
          }
          newHistory[well] = [...newHistory[well], { ...data }].slice(-20);
        });
        return newHistory;
      });
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const wellData = Object.entries(wellInfo).map(([well, data]) => ({
    id: well,
    name: well,
    percentage: (
      (data.current_values.InstantVol / data.current_values.SetVol) *
      100
    ).toFixed(1),
    value1: data.current_values.InstantVol,
    value2: data.current_values.SetVol,
    value3: data.current_values.Nozzle,
    status_nozzle: data.status_checks.Nozzle,
    status_pct_warn: data.status_checks.pct_warn,
    status_pct_danger: data.status_checks.pct_danger,
    time: data.current_values.Time,
  }));

  const getStatusClass = (warning, danger) => {
    if (danger) return "danger";
    if (warning) return "warning";
    return "default"; // default blue
  };

  const handleClick = (card) => {
    console.log(card);
    alert(`Clicked on well ${card.name}!`);
  };

  return (
    <div className="card-list">
      {wellData.map((card) => (
        <div key={card.id} className="card" onClick={() => handleClick(card)}>
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
            <p>
              <strong>{card.name}</strong>
            </p>
            <button className="value-button">{`Instant Volume: ${(card.value1).toFixed(1)}`}</button>
            <button className="value-button">{`Set Point Volume: ${card.value2}`}</button>
            <button className="value-button">{`Nozzle Strength (%): ${card.value3}`}</button>
            <button className="value-button">
              {`Nozzle above 80%: ${card.status_nozzle !== undefined ? String(card.status_nozzle) : "N/A"}`}
            </button>
            <button className="value-button">
              {`${card.time !== undefined ? String(card.time) : "N/A"}`}
            </button>
            <button className="value-button">
              {`Hydrate Formation/Production Problem: ${card.status_pct_danger !== undefined ? String(card.status_pct_danger) : "N/A"}`}
            </button>

            {/* Dynamic warning button */}
            <button
              className={`status-button ${getStatusClass(card.status_pct_warn, card.status_pct_danger)}`}
            >
              Warning Status
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CardList;
