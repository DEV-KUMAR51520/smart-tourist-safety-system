from app import db
from datetime import datetime
import uuid

class RiskZone(db.Model):
    __tablename__ = 'risk_zones'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    name = db.Column(db.String(255), nullable=False)
    zone_type = db.Column(db.String(50), nullable=False)  # wildlife, restricted, weather
    coordinates = db.Column(db.JSON, nullable=False)  # GeoJSON polygon
    risk_level = db.Column(db.Integer, nullable=False)  # 1-5
    active_alerts = db.Column(db.JSON, nullable=True)
    description = db.Column(db.Text, nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'zone_type': self.zone_type,
            'coordinates': self.coordinates,
            'risk_level': self.risk_level,
            'active_alerts': self.active_alerts,
            'description': self.description
        }
