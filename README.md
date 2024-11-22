# Oil Well Monitoring System

This project is an **Oil Well Monitoring System** that streams real-time well data from a **FastAPI backend** to a **React frontend** using **Server-Sent Events (SSE)**. It visualizes the status of wells with key metrics like instant volume, set volume, and nozzle strength, along with warnings and danger levels. The system supports real-time updates, historical data tracking, and dynamic visualizations using progress bars.

---

## Features

### Backend (FastAPI)
- **Real-time streaming:** Uses SSE to stream well data to the frontend.
- **Data management:** Loads well data from CSV files, processes it, and calculates key metrics.
- **Status checks:** Identifies warning and danger levels based on thresholds.
- **Historical data tracking:** Maintains historical values for trend analysis.
- **Detailed endpoints:** Provides specific well details via API endpoints.

### Frontend (React)
- **Interactive cards:** Displays key metrics for each well in a card-based UI.
- **Dynamic progress bars:** Visualizes the percentage of instant volume relative to set volume.
- **Real-time updates:** Automatically updates the UI as new data is streamed.
- **Status indicators:** Highlights warning and danger statuses with dynamic styles.
- **Responsive design:** Ensures smooth user experience across devices.

---

## How It Works

### Backend Initialization
- The backend reads CSV files from the `./wells` folder, processes them, and initializes well data with baseline values.
- It continuously updates well statuses with new readings and streams data to the frontend via SSE.

### Frontend Integration
- The React frontend establishes a connection with the backend using SSE to receive real-time updates.
- Data is processed and displayed dynamically using interactive cards with progress bars and status indicators.

### Visualization
- Each card represents a well, showing metrics like instant volume, set volume, and nozzle strength.
- Statuses (e.g., warning, danger) are visually indicated with colored labels.
