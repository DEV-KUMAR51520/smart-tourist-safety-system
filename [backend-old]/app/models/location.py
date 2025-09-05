# app/models/location.py
from app import db
from datetime import datetime
import uuid

class LocationLog(db.Model):
    __tablename__ = 'location_logs'

    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tourist_id = db.Column(db.String(36), db.ForeignKey('tourists.id'), nullable=False)
    latitude = db.Column(db.Numeric(10, 8), nullable=False)
    longitude = db.Column(db.Numeric(11, 8), nullable=False)
    accuracy = db.Column(db.Float, nullable=True)
    altitude = db.Column(db.Float, nullable=True)
    speed = db.Column(db.Float, nullable=True)
    bearing = db.Column(db.Float, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    battery_level = db.Column(db.Integer, nullable=True)
    network_type = db.Column(db.String(10), nullable=True)

    def to_dict(self):
        return {
            'id': self.id,
            'tourist_id': self.tourist_id,
            'latitude': float(self.latitude),
            'longitude': float(self.longitude),
            'accuracy': self.accuracy,
            'timestamp': self.timestamp.isoformat()
        }