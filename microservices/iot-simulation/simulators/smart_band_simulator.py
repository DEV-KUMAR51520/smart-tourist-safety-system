# iot-simulation/smart_band_simulator.py
import asyncio
import json
import random
import requests
import time
from datetime import datetime, timedelta
import websockets
import logging

class SmartBandSimulator:
    def __init__(self, tourist_id, api_url="http://localhost:5000/api"):
        self.tourist_id = tourist_id
        self.api_url = api_url
        self.device_id = f"band_{tourist_id}_{random.randint(1000, 9999)}"
        self.is_active = True
        self.battery_level = 100
        self.last_heartbeat = datetime.now()

        # Health sensors
        self.heart_rate = 75
        self.body_temperature = 98.6
        self.activity_level = 0  # 0-10 scale
        self.stress_level = 0    # 0-10 scale

        # Environmental sensors
        self.ambient_temperature = 77
        self.humidity = 60
        self.air_quality = 50  # 0-100 scale

        # Location (will be updated)
        self.latitude = 26.1445 + random.uniform(-0.1, 0.1)
        self.longitude = 91.7362 + random.uniform(-0.1, 0.1)

        self.logger = logging.getLogger(f"SmartBand_{self.device_id}")
        logging.basicConfig(level=logging.INFO)

    def simulate_health_data(self):
        """Simulate realistic health sensor data"""
        # Heart rate varies based on activity
        base_hr = 75
        if self.activity_level > 7:  # High activity
            self.heart_rate = random.randint(120, 160)
        elif self.activity_level > 4:  # Moderate activity
            self.heart_rate = random.randint(90, 120)
        else:  # Resting
            self.heart_rate = random.randint(60, 85)

        # Body temperature (slight variations)
        self.body_temperature = 98.6 + random.uniform(-0.5, 0.8)

        # Activity level (based on time of day and random factors)
        current_hour = datetime.now().hour
        if 22 <= current_hour or current_hour <= 6:  # Night time
            self.activity_level = random.randint(0, 2)
        elif 7 <= current_hour <= 9 or 17 <= current_hour <= 19:  # Peak activity
            self.activity_level = random.randint(5, 10)
        else:
            self.activity_level = random.randint(2, 7)

        # Stress level (correlated with activity and random events)
        if self.activity_level > 8 or random.random() < 0.1:  # 10% chance of stress event
            self.stress_level = random.randint(6, 10)
        else:
            self.stress_level = random.randint(0, 4)

    def simulate_environmental_data(self):
        """Simulate environmental sensor data"""
        # Temperature varies by time and season
        current_hour = datetime.now().hour
        base_temp = 77

        if 6 <= current_hour <= 18:  # Daytime
            self.ambient_temperature = base_temp + random.uniform(5, 15)
        else:  # Nighttime
            self.ambient_temperature = base_temp + random.uniform(-5, 5)

        # Humidity (varies with weather patterns)
        self.humidity = max(30, min(95, self.humidity + random.uniform(-5, 5)))

        # Air quality (varies by location type)
        self.air_quality = max(0, min(100, self.air_quality + random.uniform(-3, 3)))

    def simulate_movement(self):
        """Simulate GPS movement"""
        # Random walk with bias towards interesting locations
        movement_speed = 0.0001 * (self.activity_level / 10)  # Slower movement at night

        self.latitude += random.uniform(-movement_speed, movement_speed)
        self.longitude += random.uniform(-movement_speed, movement_speed)

        # Keep within reasonable bounds (Northeast India)
        self.latitude = max(25.0, min(28.0, self.latitude))
        self.longitude = max(90.0, min(96.0, self.longitude))

    def detect_anomalies(self):
        """Detect potential health or safety anomalies"""
        alerts = []

        # Health anomalies
        if self.heart_rate > 180 or self.heart_rate < 40:
            alerts.append({
                'type': 'health_anomaly',
                'severity': 'critical',
                'message': f'Abnormal heart rate detected: {self.heart_rate} bpm',
                'vital_signs': self.get_vital_signs()
            })

        if self.body_temperature > 101 or self.body_temperature < 95:
            alerts.append({
                'type': 'health_anomaly',
                'severity': 'high',
                'message': f'Abnormal body temperature: {self.body_temperature:.1f}°F',
                'vital_signs': self.get_vital_signs()
            })

        if self.stress_level >= 9:
            alerts.append({
                'type': 'stress_alert',
                'severity': 'medium',
                'message': f'High stress level detected: {self.stress_level}/10',
                'vital_signs': self.get_vital_signs()
            })

        # Environmental alerts
        if self.ambient_temperature > 110 or self.ambient_temperature < 32:
            alerts.append({
                'type': 'environmental_alert',
                'severity': 'high',
                'message': f'Extreme temperature: {self.ambient_temperature:.1f}°F',
                'environmental_data': self.get_environmental_data()
            })

        if self.air_quality < 20:
            alerts.append({
                'type': 'environmental_alert',
                'severity': 'medium',
                'message': f'Poor air quality detected: {self.air_quality}/100',
                'environmental_data': self.get_environmental_data()
            })

        # Device alerts
        if self.battery_level < 10:
            alerts.append({
                'type': 'device_alert',
                'severity': 'medium',
                'message': f'Low battery warning: {self.battery_level}%'
            })

        return alerts

    def get_vital_signs(self):
        """Get current vital signs"""
        return {
            'heart_rate': self.heart_rate,
            'body_temperature': round(self.body_temperature, 1),
            'activity_level': self.activity_level,
            'stress_level': self.stress_level,
            'timestamp': datetime.now().isoformat()
        }

    def get_environmental_data(self):
        """Get current environmental data"""
        return {
            'ambient_temperature': round(self.ambient_temperature, 1),
            'humidity': self.humidity,
            'air_quality': self.air_quality,
            'timestamp': datetime.now().isoformat()
        }

    def get_location_data(self):
        """Get current location data"""
        return {
            'latitude': round(self.latitude, 6),
            'longitude': round(self.longitude, 6),
            'accuracy': random.uniform(3, 10),
            'timestamp': datetime.now().isoformat()
        }

    def get_device_status(self):
        """Get device status"""
        return {
            'device_id': self.device_id,
            'battery_level': self.battery_level,
            'is_active': self.is_active,
            'last_heartbeat': self.last_heartbeat.isoformat(),
            'signal_strength': random.randint(1, 5)
        }

    async def send_data_to_server(self):
        """Send all sensor data to server"""
        try:
            data_payload = {
                'tourist_id': self.tourist_id,
                'device_id': self.device_id,
                'vital_signs': self.get_vital_signs(),
                'environmental_data': self.get_environmental_data(),
                'location_data': self.get_location_data(),
                'device_status': self.get_device_status(),
                'alerts': self.detect_anomalies(),
                'timestamp': datetime.now().isoformat()
            }

            # Send to IoT data endpoint
            response = requests.post(
                f"{self.api_url}/iot/data",
                json=data_payload,
                timeout=5
            )

            if response.status_code == 200:
                self.logger.info(f"Data sent successfully for {self.device_id}")
            else:
                self.logger.error(f"Failed to send data: {response.status_code}")

        except Exception as e:
            self.logger.error(f"Error sending data: {str(e)}")

    def update_battery(self):
        """Update battery level based on usage"""
        # Battery drain rate (per minute)
        drain_rate = 0.1

        if self.activity_level > 7:
            drain_rate = 0.15  # Higher drain during high activity

        self.battery_level = max(0, self.battery_level - drain_rate)

        if self.battery_level <= 0:
            self.is_active = False

    async def run_simulation(self, duration_minutes=60):
        """Run the IoT device simulation"""
        self.logger.info(f"Starting IoT simulation for tourist {self.tourist_id}")

        start_time = datetime.now()
        end_time = start_time + timedelta(minutes=duration_minutes)

        while datetime.now() < end_time and self.is_active:
            # Update all sensor data
            self.simulate_health_data()
            self.simulate_environmental_data()
            self.simulate_movement()
            self.update_battery()

            # Send data to server
            await self.send_data_to_server()

            # Update heartbeat
            self.last_heartbeat = datetime.now()

            # Wait before next reading (simulate 30-second intervals)
            await asyncio.sleep(30)

        self.logger.info(f"IoT simulation completed for {self.device_id}")

# IoT Data Processing Service
class IoTDataProcessor:
    def __init__(self, api_url="http://localhost:5000/api"):
        self.api_url = api_url
        self.logger = logging.getLogger("IoTDataProcessor")

    def process_iot_data(self, data):
        """Process incoming IoT data and trigger appropriate actions"""
        tourist_id = data.get('tourist_id')
        device_id = data.get('device_id')
        alerts = data.get('alerts', [])

        # Store data in database
        self.store_iot_data(data)

        # Process alerts
        for alert in alerts:
            self.handle_iot_alert(tourist_id, device_id, alert)

        # Update tourist safety score based on IoT data
        self.update_safety_score_with_iot(tourist_id, data)

    def store_iot_data(self, data):
        """Store IoT data in database"""
        try:
            response = requests.post(
                f"{self.api_url}/iot/store",
                json=data,
                timeout=5
            )

            if response.status_code != 200:
                self.logger.error(f"Failed to store IoT data: {response.status_code}")

        except Exception as e:
            self.logger.error(f"Error storing IoT data: {str(e)}")

    def handle_iot_alert(self, tourist_id, device_id, alert):
        """Handle IoT-generated alerts"""
        self.logger.warning(f"IoT Alert for {tourist_id}: {alert['message']}")

        # Send alert to emergency response system
        alert_payload = {
            'tourist_id': tourist_id,
            'device_id': device_id,
            'type': 'iot_alert',
            'subtype': alert['type'],
            'severity': alert['severity'],
            'message': alert['message'],
            'data': alert.get('vital_signs') or alert.get('environmental_data'),
            'timestamp': datetime.now().isoformat()
        }

        try:
            requests.post(
                f"{self.api_url}/emergency/iot-alert",
                json=alert_payload,
                timeout=5
            )
        except Exception as e:
            self.logger.error(f"Failed to send IoT alert: {str(e)}")

    def update_safety_score_with_iot(self, tourist_id, iot_data):
        """Update tourist safety score based on IoT data"""
        vital_signs = iot_data.get('vital_signs', {})
        environmental = iot_data.get('environmental_data', {})
        device_status = iot_data.get('device_status', {})

        # Calculate health score
        health_score = 100

        heart_rate = vital_signs.get('heart_rate', 75)
        if heart_rate > 150 or heart_rate < 50:
            health_score -= 20
        elif heart_rate > 120 or heart_rate < 60:
            health_score -= 10

        body_temp = vital_signs.get('body_temperature', 98.6)
        if body_temp > 100 or body_temp < 97:
            health_score -= 15

        stress_level = vital_signs.get('stress_level', 0)
        health_score -= stress_level * 2

        # Environmental factors
        air_quality = environmental.get('air_quality', 50)
        if air_quality < 30:
            health_score -= 10

        ambient_temp = environmental.get('ambient_temperature', 77)
        if ambient_temp > 100 or ambient_temp < 40:
            health_score -= 15

        # Device factors
        battery = device_status.get('battery_level', 100)
        if battery < 20:
            health_score -= 5

        health_score = max(0, min(100, health_score))

        # Send updated score to main system
        try:
            requests.post(
                f"{self.api_url}/tourists/{tourist_id}/iot-safety-update",
                json={'health_score': health_score, 'iot_data': iot_data},
                timeout=5
            )
        except Exception as e:
            self.logger.error(f"Failed to update safety score: {str(e)}")

# Usage example
async def main():
    # Simulate multiple IoT devices
    simulators = []

    # Create simulators for different tourists
    tourist_ids = ['tourist_001', 'tourist_002', 'tourist_003']

    for tourist_id in tourist_ids:
        simulator = SmartBandSimulator(tourist_id)
        simulators.append(simulator)

    # Run all simulations concurrently
    tasks = []
    for simulator in simulators:
        task = asyncio.create_task(simulator.run_simulation(duration_minutes=30))
        tasks.append(task)

    await asyncio.gather(*tasks)

if __name__ == "__main__":
    asyncio.run(main())