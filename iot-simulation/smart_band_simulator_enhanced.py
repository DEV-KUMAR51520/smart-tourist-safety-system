#!/usr/bin/env python3
"""
Enhanced Smart Band Simulator
Generates realistic IoT data for testing the real-time tourist tracking and heat map features
"""

import json
import time
import random
import uuid
import math
import threading
import requests
import websocket
import logging
from datetime import datetime
from typing import Dict, List, Tuple, Optional, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('smart_band_simulator')

# Configuration
API_ENDPOINT = "http://localhost:3002/api/iot-data"
WS_ENDPOINT = "ws://localhost:3002"
NUM_DEVICES = 20  # Number of simulated devices
UPDATE_INTERVAL = 5  # Seconds between updates
JAIPUR_CENTER = (26.9124, 75.7873)  # Latitude, Longitude of Jaipur center
MAX_DISTANCE = 0.05  # Maximum distance from center (in degrees)

# Tourist names for more realistic simulation
TOURIST_NAMES = [
    "John Smith", "Emma Johnson", "Michael Brown", "Sophia Williams", "James Jones",
    "Olivia Miller", "Robert Davis", "Ava Wilson", "David Moore", "Isabella Taylor",
    "Joseph Anderson", "Mia Thomas", "Charles Jackson", "Charlotte White", "Daniel Harris",
    "Amelia Martin", "Matthew Thompson", "Emily Garcia", "Andrew Martinez", "Abigail Robinson",
    "Raj Sharma", "Priya Patel", "Amit Kumar", "Ananya Singh", "Vikram Mehta",
    "Neha Gupta", "Arjun Reddy", "Divya Verma", "Rahul Malhotra", "Pooja Desai"
]

# Tourist attraction points in Jaipur (for more realistic movement)
ATTRACTION_POINTS = [
    (26.9855, 75.8513, "Amber Fort"),           # Amber Fort
    (26.9239, 75.8267, "Hawa Mahal"),          # Hawa Mahal
    (26.9220, 75.8460, "City Palace"),          # City Palace
    (26.9246, 75.8242, "Jantar Mantar"),        # Jantar Mantar
    (26.9850, 75.8422, "Jaigarh Fort"),         # Jaigarh Fort
    (26.9324, 75.8069, "Albert Hall Museum"),    # Albert Hall Museum
    (26.9865, 75.8784, "Nahargarh Fort"),       # Nahargarh Fort
    (26.9023, 75.7885, "World Trade Park"),      # World Trade Park
    (26.8601, 75.8023, "Jaipur Airport"),        # Jaipur Airport
    (26.9183, 75.7889, "Jaipur Railway Station") # Jaipur Railway Station
]

class SmartBandSimulator:
    """Simulates a smart band/tag worn by a tourist"""
    
    def __init__(self, device_id: str, tourist_name: str):
        self.device_id = device_id
        self.tourist_id = str(uuid.uuid4())
        self.tourist_name = tourist_name
        
        # Initialize with random location near Jaipur center
        self.target_attraction = random.choice(ATTRACTION_POINTS)
        self.location = self._random_location_near(self.target_attraction[0], self.target_attraction[1], 0.005)
        self.movement_vector = (0, 0)  # Direction of movement
        self.speed = random.uniform(0.0001, 0.0005)  # Movement speed
        
        # Initialize health data
        self.heart_rate = random.randint(65, 85)
        self.body_temperature = round(random.uniform(36.5, 37.2), 1)
        self.steps = 0
        
        # Initialize environmental data
        self.env_temperature = round(random.uniform(25, 35), 1)
        self.humidity = round(random.uniform(40, 70), 1)
        self.air_quality = random.randint(50, 150)
        
        # Initialize device data
        self.battery_level = random.randint(60, 100)
        
        # Status and alerts
        self.status = "safe"
        self.alerts = []
        
        # Anomaly simulation
        self.anomaly_chance = 0.05  # 5% chance of anomaly per update
        self.anomaly_duration = 0  # Duration of current anomaly in updates
        self.current_anomaly = None  # Type of current anomaly
        
        # Movement pattern
        self.time_at_attraction = 0
        self.max_time_at_attraction = random.randint(10, 30)  # Updates to stay at attraction
        
        logger.info(f"Initialized device {device_id} for tourist {tourist_name}")
    
    def _random_location_near(self, lat: float, lng: float, max_distance: float) -> Tuple[float, float]:
        """Generate a random location near the specified coordinates"""
        # Convert max_distance from degrees to radians
        r = max_distance * random.random()
        theta = random.uniform(0, 2 * math.pi)
        
        # Calculate new point
        dx = r * math.cos(theta)
        dy = r * math.sin(theta)
        
        return (lat + dy, lng + dx)
    
    def _calculate_distance(self, lat1: float, lng1: float, lat2: float, lng2: float) -> float:
        """Calculate distance between two points in degrees"""
        return math.sqrt((lat2 - lat1)**2 + (lng2 - lng1)**2)
    
    def _move_towards_attraction(self):
        """Move towards the current target attraction"""
        target_lat, target_lng, _ = self.target_attraction
        current_lat, current_lng = self.location
        
        # Calculate distance to target
        distance = self._calculate_distance(current_lat, current_lng, target_lat, target_lng)
        
        if distance < 0.001:  # Very close to attraction
            self.time_at_attraction += 1
            self.steps += random.randint(10, 50)  # Small movement at attraction
            
            # If stayed long enough, choose a new attraction
            if self.time_at_attraction >= self.max_time_at_attraction:
                self.target_attraction = random.choice(ATTRACTION_POINTS)
                self.time_at_attraction = 0
                self.max_time_at_attraction = random.randint(10, 30)
                logger.info(f"Device {self.device_id}: Moving to {self.target_attraction[2]}")
        else:
            # Calculate movement vector
            dx = target_lng - current_lng
            dy = target_lat - current_lat
            
            # Normalize and scale by speed
            magnitude = math.sqrt(dx**2 + dy**2)
            dx = (dx / magnitude) * self.speed * random.uniform(0.8, 1.2)
            dy = (dy / magnitude) * self.speed * random.uniform(0.8, 1.2)
            
            # Update location
            self.location = (current_lat + dy, current_lng + dx)
            self.steps += random.randint(50, 200)  # More steps when moving
    
    def _simulate_anomaly(self):
        """Simulate anomalies in health or environmental data"""
        if self.anomaly_duration > 0:
            # Continue existing anomaly
            self.anomaly_duration -= 1
            
            if self.current_anomaly == "health_critical":
                self.heart_rate = random.randint(120, 160)
                self.body_temperature = round(random.uniform(39.0, 40.5), 1)
                self.status = "critical"
                
            elif self.current_anomaly == "health_warning":
                self.heart_rate = random.randint(100, 119)
                self.body_temperature = round(random.uniform(38.0, 38.9), 1)
                self.status = "warning"
                
            elif self.current_anomaly == "environment_critical":
                self.env_temperature = round(random.uniform(45, 50), 1)
                self.air_quality = random.randint(300, 500)
                self.status = "critical"
                
            elif self.current_anomaly == "environment_warning":
                self.env_temperature = round(random.uniform(40, 44), 1)
                self.air_quality = random.randint(200, 299)
                self.status = "warning"
                
            elif self.current_anomaly == "battery_low":
                self.battery_level = random.randint(1, 10)
                self.status = "warning"
            
            # If anomaly is ending, generate recovery
            if self.anomaly_duration == 0:
                self.current_anomaly = None
                logger.info(f"Device {self.device_id}: Anomaly ended, returning to normal")
        else:
            # Possibly start a new anomaly
            if random.random() < self.anomaly_chance:
                anomaly_types = [
                    "health_critical", "health_warning", 
                    "environment_critical", "environment_warning", 
                    "battery_low"
                ]
                self.current_anomaly = random.choice(anomaly_types)
                self.anomaly_duration = random.randint(2, 6)  # Duration in updates
                
                # Generate alert for the anomaly
                alert_message = {
                    "health_critical": "Critical health condition detected",
                    "health_warning": "Abnormal health readings detected",
                    "environment_critical": "Dangerous environmental conditions",
                    "environment_warning": "Concerning environmental conditions",
                    "battery_low": "Device battery critically low"
                }[self.current_anomaly]
                
                self.alerts.append({
                    "type": self.current_anomaly.split("_")[0],
                    "message": alert_message,
                    "timestamp": datetime.now().isoformat()
                })
                
                logger.info(f"Device {self.device_id}: Anomaly started - {self.current_anomaly}")
            else:
                # Normal readings
                self.heart_rate = random.randint(65, 85)
                self.body_temperature = round(random.uniform(36.5, 37.2), 1)
                self.env_temperature = round(random.uniform(25, 35), 1)
                self.humidity = round(random.uniform(40, 70), 1)
                self.air_quality = random.randint(50, 150)
                
                # Battery slowly decreases
                self.battery_level = max(1, self.battery_level - random.randint(0, 1))
                
                # Status is safe unless battery is low
                self.status = "safe"
                if self.battery_level < 10:
                    self.status = "warning"
                    
                # Clear alerts
                self.alerts = []
    
    def update(self) -> Dict[str, Any]:
        """Update the device state and return the data"""
        # Move towards attraction
        self._move_towards_attraction()
        
        # Simulate anomalies
        self._simulate_anomaly()
        
        # Prepare data payload
        data = {
            "deviceId": self.device_id,
            "userId": self.tourist_id,
            "touristName": self.tourist_name,
            "timestamp": datetime.now().isoformat(),
            "location": {
                "lat": self.location[0],
                "lng": self.location[1],
                "accuracy": random.uniform(3.0, 15.0)
            },
            "healthData": {
                "heartRate": self.heart_rate,
                "bodyTemperature": self.body_temperature,
                "steps": self.steps
            },
            "environmentData": {
                "temperature": self.env_temperature,
                "humidity": self.humidity,
                "airQuality": self.air_quality
            },
            "batteryLevel": self.battery_level,
            "status": self.status,
            "alerts": self.alerts
        }
        
        return data

class IoTSimulationManager:
    """Manages multiple smart band simulators and sends data to the backend"""
    
    def __init__(self, num_devices: int = NUM_DEVICES):
        self.devices = {}
        self.running = False
        self.ws = None
        
        # Initialize devices
        for i in range(num_devices):
            device_id = f"SB-{uuid.uuid4().hex[:8]}"
            tourist_name = random.choice(TOURIST_NAMES)
            self.devices[device_id] = SmartBandSimulator(device_id, tourist_name)
        
        logger.info(f"Initialized {num_devices} smart band simulators")
    
    def _connect_websocket(self):
        """Connect to WebSocket server"""
        try:
            self.ws = websocket.create_connection(WS_ENDPOINT)
            logger.info("Connected to WebSocket server")
            return True
        except Exception as e:
            logger.error(f"Failed to connect to WebSocket: {e}")
            return False
    
    def _send_data_http(self, data: Dict[str, Any]):
        """Send data to backend via HTTP"""
        try:
            response = requests.post(API_ENDPOINT, json=data)
            if response.status_code == 201:
                logger.debug(f"Data sent successfully via HTTP: {data['deviceId']}")
                return True
            else:
                logger.warning(f"Failed to send data via HTTP: {response.status_code} - {response.text}")
                return False
        except Exception as e:
            logger.error(f"Error sending data via HTTP: {e}")
            return False
    
    def _send_data_ws(self, data: Dict[str, Any]):
        """Send data to backend via WebSocket"""
        if not self.ws:
            if not self._connect_websocket():
                return False
        
        try:
            message = json.dumps({
                "type": "iot_data",
                "payload": data
            })
            self.ws.send(message)
            logger.debug(f"Data sent successfully via WebSocket: {data['deviceId']}")
            return True
        except Exception as e:
            logger.error(f"Error sending data via WebSocket: {e}")
            self.ws = None  # Reset connection for next attempt
            return False
    
    def start(self):
        """Start the simulation"""
        self.running = True
        self._simulation_thread = threading.Thread(target=self._run_simulation)
        self._simulation_thread.daemon = True
        self._simulation_thread.start()
        logger.info("Simulation started")
    
    def stop(self):
        """Stop the simulation"""
        self.running = False
        if self.ws:
            self.ws.close()
        logger.info("Simulation stopped")
    
    def _run_simulation(self):
        """Run the simulation loop"""
        while self.running:
            for device_id, device in self.devices.items():
                # Update device state
                data = device.update()
                
                # Try WebSocket first, fall back to HTTP
                if not self._send_data_ws(data):
                    self._send_data_http(data)
            
            # Wait for next update
            time.sleep(UPDATE_INTERVAL)

def main():
    """Main function to run the simulator"""
    try:
        # Create and start the simulation manager
        manager = IoTSimulationManager(NUM_DEVICES)
        manager.start()
        
        # Keep running until interrupted
        print("Smart Band Simulator running. Press Ctrl+C to stop.")
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        print("\nStopping simulation...")
    finally:
        if 'manager' in locals():
            manager.stop()
        print("Simulation stopped.")

if __name__ == "__main__":
    main()