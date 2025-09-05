# app/routes/auth.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models.tourist import Tourist
# from app.services.blockchain_service import BlockchainService
import hashlib

auth_bp = Blueprint('auth', __name__)
# blockchain_service = BlockchainService()

@auth_bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()

        # Validate required fields
        required_fields = ['name', 'phone', 'password', 'aadhaar', 'emergency_contact', 'entry_point', 'trip_duration']
        for field in required_fields:
            if field not in data:
                return jsonify({'error': f'Missing field: {field}'}), 400

        # Hash Aadhaar for privacy
        aadhaar_hash = hashlib.sha256(data['aadhaar'].encode()).hexdigest()

        # Check if tourist already exists
        existing_tourist = Tourist.query.filter_by(aadhaar_hash=aadhaar_hash).first()
        if existing_tourist:
            return jsonify({'error': 'Tourist already registered'}), 409

        # Create new tourist
        tourist = Tourist(
            name=data['name'],
            phone=data['phone'],
            aadhaar_hash=aadhaar_hash,
            emergency_contact=data['emergency_contact'],
            entry_point=data['entry_point'],
            trip_duration=data['trip_duration']
        )
        tourist.set_password(data['password'])

        db.session.add(tourist)
        db.session.commit()

        # Generate blockchain ID
        try:
            blockchain_id = blockchain_service.create_digital_id(tourist.id, aadhaar_hash)
            tourist.blockchain_id = blockchain_id
            db.session.commit()
        except Exception as e:
            print(f"Blockchain ID generation failed: {e}")
            # Continue without blockchain ID for demo

        # Generate access token
        access_token = create_access_token(identity=tourist.id)

        return jsonify({
            'message': 'Tourist registered successfully',
            'tourist': tourist.to_dict(),
            'access_token': access_token
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()

        if 'phone' not in data or 'password' not in data:
            return jsonify({'error': 'Phone and password required'}), 400

        tourist = Tourist.query.filter_by(phone=data['phone']).first()

        if not tourist or not tourist.check_password(data['password']):
            return jsonify({'error': 'Invalid credentials'}), 401

        access_token = create_access_token(identity=tourist.id)

        return jsonify({
            'message': 'Login successful',
            'tourist': tourist.to_dict(),
            'access_token': access_token
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    try:
        tourist_id = get_jwt_identity()
        tourist = Tourist.query.get(tourist_id)

        if not tourist:
            return jsonify({'error': 'Tourist not found'}), 404

        return jsonify(tourist.to_dict()), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500