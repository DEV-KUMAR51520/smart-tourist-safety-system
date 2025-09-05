# app/routes/location.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import db
from app.models.location import LocationLog
from app.models.risk_zone import RiskZone
from app.services.geofencing_service import GeofencingService
from datetime import datetime

location_bp = Blueprint('location', __name__)
geofencing_service = GeofencingService()

@location_bp.route('/update', methods=['POST'])
@jwt_required()
def update_location():
    try:
        tourist_id = get_jwt_identity()
        data = request.get_json()

        # Validate required fields
        if 'latitude' not in data or 'longitude' not in data:
            return jsonify({'error': 'Latitude and longitude required'}), 400

        # Create location log
        location_log = LocationLog(
            tourist_id=tourist_id,
            latitude=data['latitude'],
            longitude=data['longitude'],
            accuracy=data.get('accuracy'),
            altitude=data.get('altitude'),
            speed=data.get('speed'),
            bearing=data.get('bearing'),
            battery_level=data.get('battery_level'),
            network_type=data.get('network_type')
        )

        db.session.add(location_log)
        db.session.commit()

        # Check geofencing
        violations = geofencing_service.check_geofence_violations(
            tourist_id, data['latitude'], data['longitude']
        )

        response_data = {
            'message': 'Location updated successfully',
            'location_id': location_log.id,
            'geofence_violations': violations
        }

        return jsonify(response_data), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@location_bp.route('/nearby-zones', methods=['GET'])
@jwt_required()
def get_nearby_zones():
    try:
        lat = request.args.get('lat', type=float)
        lng = request.args.get('lng', type=float)
        radius = request.args.get('radius', default=5.0, type=float)  # km

        if not lat or not lng:
            return jsonify({'error': 'Latitude and longitude required'}), 400

        nearby_zones = geofencing_service.get_nearby_risk_zones(lat, lng, radius)

        return jsonify({
            'zones': [zone.to_dict() for zone in nearby_zones]
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500