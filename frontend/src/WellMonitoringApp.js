import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const WellMonitoringApp = () => {
  const [wellData, setWellData] = useState({});
  const [selectedWell, setSelectedWell] = useState(null);
  const [historicalData, setHistoricalData] = useState({});

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:3001/stream");

    eventSource.onmessage = (event) => {
      const newData = JSON.parse(event.data);

      setWellData((prevData) => ({
        ...prevData,
        ...Object.fromEntries(
          Object.entries(newData).map(([well, data]) => [well, data])
        ),
      }));

      // Keep historical data for graphs
      setHistoricalData((prevHistory) => {
        const newHistory = { ...prevHistory };
        Object.entries(newData).forEach(([well, data]) => {
          if (!newHistory[well]) {
            newHistory[well] = [];
          }
          newHistory[well] = [
            ...newHistory[well],
            { ...data, timestamp: new Date().toISOString() },
          ].slice(-20);
        });
        return newHistory;
      });
    };

    return () => {
      eventSource.close();
    };
  }, []);

  const WellCard = ({ wellName, data }) => (
    <div
      className="p-4 bg-white rounded-lg shadow-md mb-4 cursor-pointer hover:bg-gray-50"
      onClick={() => setSelectedWell(wellName)}
    >
      <h3 className="text-lg font-semibold mb-2">{wellName}</h3>
      <div className="grid grid-cols-2 gap-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="text-sm">
            <span className="font-medium">{key}:</span> {value}
          </div>
        ))}
      </div>
    </div>
  );

  const DetailView = ({ wellName, data }) => {
    if (!data || data.length === 0) return null;

    // Get the keys that contain numeric values for graphing
    const numericKeys = Object.keys(data[0]).filter(
      (key) => key !== "timestamp" && !isNaN(data[0][key])
    );

    return (
      <div className="fixed inset-0 bg-white p-4 z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{wellName} Details</h2>
          <button
            onClick={() => setSelectedWell(null)}
            className="px-4 py-2 bg-gray-200 rounded-md"
          >
            Close
          </button>
        </div>

        <div className="overflow-auto h-full">
          {numericKeys.map((key) => (
            <div key={key} className="mb-8">
              <h3 className="text-lg font-semibold mb-2">{key}</h3>
              <LineChart width={350} height={200} data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="timestamp" tick={false} />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey={key}
                  stroke="#2563eb"
                  dot={false}
                />
              </LineChart>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Well Monitoring</h1>

      {selectedWell ? (
        <DetailView
          wellName={selectedWell}
          data={historicalData[selectedWell]}
        />
      ) : (
        <div className="space-y-4">
          {Object.entries(wellData).map(([wellName, data]) => (
            <WellCard key={wellName} wellName={wellName} data={data} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WellMonitoringApp;
