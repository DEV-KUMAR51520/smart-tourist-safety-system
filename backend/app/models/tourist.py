# app/models/tourist.py
from app import db
from datetime import datetime
import uuid
from werkzeug.security import generate_password_hash, check_password_hash

class Tourist(db.Model):
    __tablename__ = 'tourists'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    blockchain_id = db.Column(db.String(66), unique=True, nullable=True)
    aadhaar_hash = db.Column(db.String(64), nullable=False)
    name = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(15), nullable=False)
    email = db.Column(db.String(120), nullable=True)
    password_hash = db.Column(db.String(255), nullable=False)
    emergency_contact = db.Column(db.JSON, nullable=False)
    entry_point = db.Column(db.String(100), nullable=False)
    trip_duration = db.Column(db.Integer, nullable=False)  # days
    safety_score = db.Column(db.Integer, default=100)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    locations = db.relationship('LocationLog', backref='tourist', lazy='dynamic')
    incidents = db.relationship('Incident', backref='tourist', lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'phone': self.phone,
            'safety_score': self.safety_score,
            'entry_point': self.entry_point,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat()
        }