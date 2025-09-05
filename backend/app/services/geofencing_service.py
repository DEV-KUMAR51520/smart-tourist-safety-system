from app.models.risk_zone import RiskZone
from geopy.distance import geodesic
import json

class GeofencingService:
    def check_geofence_violations(self, tourist_id, latitude, longitude):
        # A simple geofencing check. For a hackathon, you can
        # simulate this with dummy data. For a real app, you would
        # use a spatial database and complex geometry checks.
        
        # This is a mock implementation to show the concept.
        # In a real scenario, you'd fetch real risk zones from the database.
        
        # Example: a risk zone around Kaziranga National Park
        kaziranga_center = (26.5775, 93.1711)
        current_location = (latitude, longitude)
        
        if geodesic(current_location, kaziranga_center).km < 5:
            return [{
                'zone_id': 'kaziranga_01',
                'zone_name': 'Kaziranga National Park',
                'alert_message': 'You are entering a wildlife zone. Be cautious!',
                'violation_type': 'entered'
            }]
        
        return []

    def get_nearby_risk_zones(self, latitude, longitude, radius_km):
        # This is a mock implementation. For a real app, this would
        # query the database for all risk zones within the given radius.
        
        # Example: a sample risk zone as a GeoJSON polygon
        sample_zone_geojson = {
            "type": "Polygon",
            "coordinates": [
                [
                    [91.725, 26.155],
                    [91.735, 26.155],
                    [91.735, 26.165],
                    [91.725, 26.165],
                    [91.725, 26.155]
                ]
            ]
        }
        
        # Create a mock RiskZone object
        sample_zone = RiskZone(
            id='mock-zone-01',
            name='Mock Restricted Area',
            zone_type='restricted',
            coordinates=sample_zone_geojson,
            risk_level=4,
            description='A mock restricted zone for demo purposes.'
        )
        
        return [sample_zone]