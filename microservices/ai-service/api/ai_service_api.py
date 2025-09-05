# api/ai_service_api.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
import logging
import os

# Import our ML models
import sys
sys.path.append('../training')
from anomaly_detection import TouristAnomalyDetector
from risk_assessment import TouristRiskAssessment

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Global model instances
anomaly_detector = None
risk_assessor = None

def load_models():
    """Load pre-trained models"""
    global anomaly_detector, risk_assessor

    try:
        # Load anomaly detection model
        anomaly_detector = TouristAnomalyDetector()
        anomaly_detector.load_model('../models/tourist_anomaly_detector.pkl')
        logger.info("Anomaly detection model loaded successfully")

        # Load risk assessment model
        risk_assessor = TouristRiskAssessment()
        risk_assessor.load_model('../models/tourist_risk_assessment.pkl')
        logger.info("Risk assessment model loaded successfully")

    except Exception as e:
        logger.error(f"Failed to load models: {str(e)}")
        raise e

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'models_loaded': anomaly_detector is not None and risk_assessor is not None
    })

@app.route('/predict/anomaly', methods=['POST'])
def predict_anomaly():
    """Detect anomalous tourist behavior"""
    try:
        data = request.get_json()

        # Validate input
        required_fields = [
            'hour', 'speed_kmh', 'distance_from_entry_km', 'battery_level',
            'gps_accuracy_m', 'risk_zone_distance_km', 'days_since_entry'
        ]

        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400

        # Predict anomaly
        result = anomaly_detector.predict(data)

        # Add interpretation
        interpretation = interpret_anomaly_result(result, data)
        result['interpretation'] = interpretation

        logger.info(f"Anomaly prediction: {result}")
        return jsonify(result)

    except Exception as e:
        logger.error(f"Anomaly prediction error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/predict/risk', methods=['POST'])
def predict_risk():
    """Assess risk level for tourist conditions"""
    try:
        data = request.get_json()

        # Validate input
        required_fields = [
            'weather_risk', 'terrain_type', 'time_of_day', 'season',
            'tourist_experience', 'group_size', 'has_guide', 'emergency_equipment'
        ]

        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400

        # Set defaults for optional fields
        data.setdefault('elevation', 100)
        data.setdefault('temperature', 25)
        data.setdefault('humidity', 70)

        # Predict risk
        result = risk_assessor.predict_risk(data)

        # Add recommendations
        recommendations = generate_risk_recommendations(result, data)
        result['recommendations'] = recommendations

        logger.info(f"Risk prediction: {result}")
        return jsonify(result)

    except Exception as e:
        logger.error(f"Risk prediction error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/analyze/safety-score', methods=['POST'])
def calculate_safety_score():
    """Calculate comprehensive safety score"""
    try:
        data = request.get_json()

        # Get anomaly prediction
        anomaly_data = {
            'hour': data.get('hour', 12),
            'speed_kmh': data.get('speed_kmh', 3),
            'distance_from_entry_km': data.get('distance_from_entry_km', 5),
            'battery_level': data.get('battery_level', 80),
            'gps_accuracy_m': data.get('gps_accuracy_m', 10),
            'risk_zone_distance_km': data.get('risk_zone_distance_km', 5),
            'days_since_entry': data.get('days_since_entry', 1)
        }

        anomaly_result = anomaly_detector.predict(anomaly_data)

        # Get risk assessment
        risk_data = {
            'weather_risk': data.get('weather_risk', 'clear'),
            'terrain_type': data.get('terrain_type', 'urban'),
            'time_of_day': data.get('time_of_day', 'afternoon'),
            'season': data.get('season', 'spring'),
            'tourist_experience': data.get('tourist_experience', 'intermediate'),
            'group_size': data.get('group_size', 2),
            'has_guide': data.get('has_guide', 0),
            'emergency_equipment': data.get('emergency_equipment', 0),
            'elevation': data.get('elevation', 100),
            'temperature': data.get('temperature', 25),
            'humidity': data.get('humidity', 70)
        }

        risk_result = risk_assessor.predict_risk(risk_data)

        # Calculate composite safety score (0-100)
        base_score = 100

        # Deduct for anomalous behavior
        if anomaly_result['is_anomaly']:
            base_score -= 30 * anomaly_result['confidence']

        # Deduct for risk level
        risk_penalties = {'low': 0, 'medium': 15, 'high': 35, 'critical': 60}
        base_score -= risk_penalties.get(risk_result['risk_level'], 0)

        # Additional factors
        if data.get('battery_level', 100) < 20:
            base_score -= 10

        if data.get('gps_accuracy_m', 10) > 50:
            base_score -= 5

        if data.get('risk_zone_distance_km', 5) < 1:
            base_score -= 15

        safety_score = max(0, min(100, base_score))

        result = {
            'safety_score': int(safety_score),
            'risk_level': risk_result['risk_level'],
            'anomaly_detected': anomaly_result['is_anomaly'],
            'anomaly_confidence': anomaly_result['confidence'],
            'risk_probabilities': risk_result['probabilities'],
            'factors': {
                'behavior_anomaly': anomaly_result['is_anomaly'],
                'environmental_risk': risk_result['risk_level'],
                'technical_issues': {
                    'low_battery': data.get('battery_level', 100) < 20,
                    'poor_gps': data.get('gps_accuracy_m', 10) > 50,
                    'near_risk_zone': data.get('risk_zone_distance_km', 5) < 1
                }
            }
        }

        return jsonify(result)

    except Exception as e:
        logger.error(f"Safety score calculation error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def interpret_anomaly_result(result, data):
    """Provide human-readable interpretation of anomaly detection"""
    if not result['is_anomaly']:
        return "Normal tourist behavior detected. No concerns identified."

    interpretations = []

    # Check specific anomaly indicators
    if data.get('speed_kmh', 0) < 0.5:
        interpretations.append("Prolonged stationary behavior detected - tourist may be stuck or resting")

    if data.get('speed_kmh', 0) > 15:
        interpretations.append("Unusually fast movement detected - possible vehicle use or emergency situation")

    if data.get('battery_level', 100) < 10:
        interpretations.append("Critical battery level - risk of losing communication")

    if data.get('gps_accuracy_m', 10) > 100:
        interpretations.append("Poor GPS signal - location accuracy compromised")

    if data.get('hour', 12) < 6 or data.get('hour', 12) > 22:
        interpretations.append("Activity during unusual hours - potential safety concern")

    if not interpretations:
        interpretations.append("Anomalous pattern detected - recommend closer monitoring")

    return ". ".join(interpretations)

def generate_risk_recommendations(risk_result, conditions):
    """Generate safety recommendations based on risk assessment"""
    recommendations = []

    risk_level = risk_result['risk_level']

    if risk_level in ['high', 'critical']:
        recommendations.append("Consider postponing travel or seeking professional guidance")
        recommendations.append("Ensure emergency communication devices are available")

    if conditions.get('weather_risk') in ['storm', 'fog']:
        recommendations.append("Monitor weather conditions closely and seek shelter if necessary")

    if conditions.get('terrain_type') in ['mountain', 'forest']:
        recommendations.append("Travel with experienced guide and proper equipment")

    if conditions.get('time_of_day') == 'night':
        recommendations.append("Avoid nighttime travel in unfamiliar areas")

    if conditions.get('group_size') == 1:
        recommendations.append("Consider traveling with a group for added safety")

    if not conditions.get('has_guide'):
        recommendations.append("Consider hiring a local guide familiar with the area")

    if not conditions.get('emergency_equipment'):
        recommendations.append("Carry emergency equipment including first aid kit and communication devices")

    if not recommendations:
        recommendations.append("Follow standard safety precautions and stay alert")

    return recommendations

if __name__ == '__main__':
    # Load models on startup
    load_models()

    # Start Flask app
    app.run(host='0.0.0.0', port=5001, debug=False)