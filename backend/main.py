from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse
import pandas as pd
import os
from typing import Dict, List
from dataclasses import dataclass
import statistics
import asyncio
import json
from datetime import datetime

@dataclass
class WellStatus:
    well_id: str
    current_values: Dict[str, float]
    historical_values: Dict[str, List[float]]
    last_valid_values: Dict[str, float]
    baseline_values: Dict[str, float]
    status_checks: Dict[str, bool]
    current_row: int

class OilWellMonitor:
    def __init__(self, csv_folder: str):
        self.csv_folder = csv_folder
        self.wells: Dict[str, WellStatus] = {}
        self.dfs: Dict[str, pd.DataFrame] = {}
        self.load_csv_files()
    
    def load_csv_files(self):
        """Load all CSV files and initialize well status."""
        for filename in os.listdir(self.csv_folder):
            if filename.endswith('.csv'):
                well_id = filename.replace('.csv', '')
                df = pd.read_csv(os.path.join(self.csv_folder, filename))
                self.dfs[well_id] = df
                
                # Initialize baseline values
                baseline_values = {}
                for column in df.columns:
                    if column != 'Time':
                        values = df[column].head(100).dropna().tolist()
                        baseline_values[column] = statistics.median(values) if values else 0
                
                self.wells[well_id] = WellStatus(
                    well_id=well_id,
                    current_values={},
                    historical_values={col: [] for col in df.columns if col != 'Time'},
                    last_valid_values={},
                    baseline_values=baseline_values,
                    status_checks={},
                    current_row=0
                )
    
    def update_wells(self) -> bool:
        """Update all wells with their next readings. Returns False if no more data."""
        has_data = False
        
        for well_id, well in self.wells.items():
            df = self.dfs[well_id]
            
            if well.current_row < len(df):
                has_data = True
                row_data = df.iloc[well.current_row].to_dict()
                
                # Update well data
                for key, value in row_data.items():
                    if key == 'Time':
                        continue
                        
                    # Handle null values
                    if pd.isna(value):
                        value = well.last_valid_values.get(key, 0)
                    else:
                        well.last_valid_values[key] = value
                    
                    # Update current values and history
                    well.current_values[key] = value
                    well.historical_values[key] = (well.historical_values[key] + [value])[-100:]
                    
                    # Check if value is less than 30% of baseline
                    baseline = well.baseline_values.get(key, 0)
                    well.status_checks[key] = value < (0.3 * baseline) if baseline else False
                
                well.current_row += 1
        
        return has_data

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Modify for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize monitor
monitor = OilWellMonitor("./wells")  # Replace with actual path

@app.get("/wells")
async def get_wells():
    """Stream well data at 1-second intervals."""
    async def event_generator():
        while True:
            # Update all wells with next readings
            has_data = monitor.update_wells()
            
            # Prepare current state of all wells
            well_states = {
                well_id: {
                    "current_values": well.current_values,
                    "historical_values": well.historical_values,
                    "status_checks": well.status_checks,
                    "Time": datetime.now().isoformat()
                }
                for well_id, well in monitor.wells.items()
            }
            
            # If no more data, end the stream
            if not has_data:
                yield {
                    "event": "end",
                    "data": "Stream completed"
                }
                break
            
            # Send the updates
            yield {
                "event": "update",
                "data": json.dumps(well_states)
            }
            
            await asyncio.sleep(1)  # Wait for 1 second

    return EventSourceResponse(event_generator())

@app.get("/well/{well_id}")
async def get_well_details(well_id: str):
    """Get detailed information for a specific well."""
    if well_id not in monitor.wells:
        return {"error": "Well not found"}
    
    well = monitor.wells[well_id]
    return {
        "historical_values": well.historical_values,
        "current_values": well.current_values,
        "baseline_values": well.baseline_values,
        "status_checks": well.status_checks
    }