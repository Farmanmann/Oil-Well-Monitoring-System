const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const stream = require("stream");
const { promisify } = require("util");

const app = express();
app.use(cors());

class WellDataStreamer {
  constructor() {
    this.wells = new Map();
    this.currentIndices = new Map();
    this.lastValidValues = new Map();
    this.statistics = new Map();
    this.connected = false;
  }

  async loadCSVs(folderPath) {
    const files = await fs.promises.readdir(folderPath);
    const csvFiles = files.filter((file) => file.endsWith(".csv"));

    for (const file of csvFiles) {
      const rows = [];
      await new Promise((resolve) => {
        fs.createReadStream(path.join(folderPath, file))
          .pipe(csv())
          .on("data", (row) => rows.push(row))
          .on("end", () => {
            const wellName = path.basename(file, ".csv");
            this.wells.set(wellName, rows);
            this.currentIndices.set(wellName, 0);
            resolve();
          });
      });
    }
  }

  getNextDataPoint() {
    const dataPoints = {};

    for (const [wellName, data] of this.wells.entries()) {
      const currentIndex = this.currentIndices.get(wellName);
      if (currentIndex < data.length) {
        dataPoints[wellName] = data[currentIndex];
        this.currentIndices.set(wellName, (currentIndex + 1) % data.length); // Loop back to start when reaching end
      }
    }

    return dataPoints;
  }
}

const streamer = new WellDataStreamer();

// Initialize the streamer with CSV data
streamer.loadCSVs("./well_data").then(() => {
  console.log("CSVs loaded successfully");
});

app.get("/stream", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const intervalId = setInterval(() => {
    const data = streamer.getNextDataPoint();
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  }, 1000); // Send data every second

  req.on("close", () => {
    clearInterval(intervalId);
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
