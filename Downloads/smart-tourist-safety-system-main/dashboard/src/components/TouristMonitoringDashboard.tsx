// src/components/TouristMonitoringDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Chip,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Badge,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  People,
  Warning,
  LocationOn,
  Battery20,
  SignalWifi0Bar,
  Emergency
} from '@mui/icons-material';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon } from 'react-leaflet';
import { LatLngExpression, Icon } from 'leaflet';
import io from 'socket.io-client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateTouristLocation, addAlert } from '../store/slices/dashboardSlice';

// Custom marker icons
const createTouristIcon = (safetyScore: number, hasAlert: boolean) => {
  let color = 'green';
  if (safetyScore < 30) color = 'red';
  else if (safetyScore < 60) color = 'orange';

  return new Icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });
};

const TouristMonitoringDashboard: React.FC = () => {
  const dispatch = useDispatch();
  const { tourists, alerts, riskZones } = useSelector((state: RootState) => state.dashboard);

  const [socket, setSocket] = useState<any>(null);
  const [mapCenter, setMapCenter] = useState<LatLngExpression>([26.1445, 91.7362]); // Guwahati
  const [showAllTourists, setShowAllTourists] = useState(true);
  const [alertFilter, setAlertFilter] = useState<string>('all');

  useEffect(() => {
    // Initialize WebSocket connection
    const newSocket = io('ws://localhost:5000');
    setSocket(newSocket);

    // Listen for location updates
    newSocket.on('location_update', (data: any) => {
      dispatch(updateTouristLocation(data));
    });

    // Listen for alerts
    newSocket.on('new_alert', (alert: Alert) => {
      dispatch(addAlert(alert));
    });

    return () => newSocket.close();
  }, [dispatch]);

  const activeTourists = tourists.filter(t => t.is_active);
  const criticalAlerts = alerts.filter(a => a.priority === 'critical' && !a.acknowledged);
  const highRiskTourists = tourists.filter(t => t.safety_score < 30);

  const getStatusColor = (safetyScore: number) => {
    if (safetyScore >= 80) return 'success';
    if (safetyScore >= 60) return 'warning';
    if (safetyScore >= 30) return 'error';
    return 'error';
  };

  const handleAlertAcknowledge = (alertId: string) => {
    // Implementation for acknowledging alerts
    console.log(`Acknowledging alert: ${alertId}`);
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <People sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Tourists
                  </Typography>
                  <Typography variant="h4">
                    {activeTourists.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Warning sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Critical Alerts
                  </Typography>
                  <Typography variant="h4">
                    {criticalAlerts.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Emergency sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    High Risk Tourists
                  </Typography>
                  <Typography variant="h4">
                    {highRiskTourists.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Risk Zones
                  </Typography>
                  <Typography variant="h4">
                    {riskZones.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Map View */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: 600 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Tourist Location Map</Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={showAllTourists}
                      onChange={(e) => setShowAllTourists(e.target.checked)}
                    />
                  }
                  label="Show All Tourists"
                />
              </Box>

              <MapContainer
                center={mapCenter}
                zoom={10}
                scrollWheelZoom={false}
                style={{ height: '500px', width: '100%' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Tourist Markers */}
                {tourists
                  .filter(tourist => showAllTourists || tourist.safety_score < 60)
                  .map(tourist => {
                    if (!tourist.last_location) return null;

                    const hasAlert = alerts.some(a => a.tourist_id === tourist.id && !a.acknowledged);

                    return (
                      <Marker
                        key={tourist.id}
                        position={[tourist.last_location.latitude, tourist.last_location.longitude]}
                        icon={createTouristIcon(tourist.safety_score, hasAlert)}
                      >
                        <Popup>
                          <div>
                            <Typography variant="subtitle1">{tourist.name}</Typography>
                            <Typography variant="body2">Phone: {tourist.phone}</Typography>
                            <Typography variant="body2">
                              Safety Score: 
                              <Chip 
                                label={tourist.safety_score}
                                color={getStatusColor(tourist.safety_score)}
                                size="small"
                                sx={{ ml: 1 }}
                              />
                            </Typography>
                            <Typography variant="body2">
                              Battery: {tourist.last_location.battery_level || 'N/A'}%
                            </Typography>
                            <Typography variant="body2">
                              Last Update: {new Date(tourist.last_location.timestamp).toLocaleTimeString()}
                            </Typography>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}

                {/* Risk Zones */}
                {riskZones.map(zone => (
                  <React.Fragment key={zone.id}>
                    {zone.coordinates.type === 'Polygon' && (
                      <Polygon
                        positions={zone.coordinates.coordinates[0].map((coord: number[]) => [coord[1], coord[0]])}
                        color={zone.risk_level >= 4 ? 'red' : zone.risk_level >= 3 ? 'orange' : 'yellow'}
                        fillOpacity={0.3}
                      >
                        <Popup>
                          <div>
                            <Typography variant="subtitle1">{zone.name}</Typography>
                            <Typography variant="body2">Type: {zone.zone_type}</Typography>
                            <Typography variant="body2">Risk Level: {zone.risk_level}/5</Typography>
                            {zone.description && (
                              <Typography variant="body2">{zone.description}</Typography>
                            )}
                          </div>
                        </Popup>
                      </Polygon>
                    )}
                  </React.Fragment>
                ))}
              </MapContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts Panel */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: 600, overflow: 'auto' }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Recent Alerts</Typography>
                <Badge badgeContent={criticalAlerts.length} color="error">
                  <Warning />
                </Badge>
              </Box>

              <List>
                {alerts
                  .filter(alert => !alert.acknowledged)
                  .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                  .slice(0, 10)
                  .map(alert => (
                    <ListItem key={alert.id} sx={{ border: 1, borderColor: 'divider', mb: 1, borderRadius: 1 }}>
                      <ListItemIcon>
                        {alert.priority === 'critical' ? (
                          <Emergency color="error" />
                        ) : alert.priority === 'high' ? (
                          <Warning color="warning" />
                        ) : (
                          <Warning color="info" />
                        )}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'between', alignItems: 'center' }}>
                            <Typography variant="body2" noWrap>
                              {alert.message}
                            </Typography>
                            <Chip 
                              label={alert.priority}
                              color={
                                alert.priority === 'critical' ? 'error' :
                                alert.priority === 'high' ? 'warning' : 'info'
                              }
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="caption" color="textSecondary">
                              {new Date(alert.timestamp).toLocaleString()}
                            </Typography>
                            {alert.details && (
                              <Typography variant="caption" display="block">
                                {alert.details}
                              </Typography>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
              </List>

              {alerts.filter(a => !a.acknowledged).length === 0 && (
                <Alert severity="success">No active alerts</Alert>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tourist List */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Tourist Status Overview
              </Typography>

              <List>
                {tourists
                  .sort((a, b) => a.safety_score - b.safety_score)
                  .map(tourist => (
                    <ListItem key={tourist.id} divider>
                      <ListItemIcon>
                        <People color={tourist.is_active ? 'primary' : 'disabled'} />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body1">{tourist.name}</Typography>
                            <Chip
                              label={`Safety: ${tourist.safety_score}`}
                              color={getStatusColor(tourist.safety_score)}
                              size="small"
                            />
                            <Typography variant="body2" color="textSecondary">
                              {tourist.phone}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                            <Typography variant="caption">
                              Entry: {tourist.entry_point}
                            </Typography>
                            {tourist.last_location && (
                              <>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Battery20 fontSize="small" />
                                  <Typography variant="caption">
                                    {tourist.last_location.battery_level || 'N/A'}%
                                  </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <SignalWifi0Bar fontSize="small" />
                                  <Typography variant="caption">
                                    {tourist.last_location.network_type || 'N/A'}
                                  </Typography>
                                </Box>
                                <Typography variant="caption">
                                  Last seen: {new Date(tourist.last_location.timestamp).toLocaleString()}
                                </Typography>
                              </>
                            )}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TouristMonitoringDashboard;