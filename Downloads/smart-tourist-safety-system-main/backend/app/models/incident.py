from app import db
from datetime import datetime
import uuid

class Incident(db.Model):
    __tablename__ = 'incidents'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    tourist_id = db.Column(db.String(36), db.ForeignKey('tourists.id'), nullable=False)
    incident_type = db.Column(db.String(50), nullable=False)  # panic, missing, medical, wildlife
    latitude = db.Column(db.Numeric(10, 8), nullable=False)
    longitude = db.Column(db.Numeric(11, 8), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(20), default='open')  # open, investigating, resolved, closed
    priority = db.Column(db.String(10), default='high')  # low, medium, high, critical
    assigned_officer = db.Column(db.String(36), nullable=True)
    blockchain_hash = db.Column(db.String(66), nullable=True)
    metadata = db.Column(db.JSON, nullable=True)  # Additional incident data
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'tourist_id': self.tourist_id,
            'incident_type': self.incident_type,
            'location': {
                'latitude': float(self.latitude),
                'longitude': float(self.longitude)
            },
            'description': self.description,
            'status': self.status,
            'priority': self.priority,
            'created_at': self.created_at.isoformat()
        }

#### `backend/app/services/geofencing_service.py`
# This service contains the core logic for geofencing, including checking if a location is within a defined risk zone.
