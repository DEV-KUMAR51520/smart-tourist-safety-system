import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert
} from '@mui/material';
import {
  ReportProblem as EmergencyIcon, // Corrected icon name
  Phone,
  LocationOn,
  Assignment,
  Update,
  CheckCircle,
  Cancel
} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { updateIncidentStatus, assignOfficer } from '../store/slices/emergencySlice'; // Corrected import
import { EmergencyIncident } from '../types'; // Added this import

interface IncidentDetailsDialogProps {
  incident: EmergencyIncident | null;
  open: boolean;
  onClose: () => void;
  onStatusUpdate: (incidentId: string, status: string, notes?: string) => void;
  onAssignOfficer: (incidentId: string, officerId: string) => void;
}

const IncidentDetailsDialog: React.FC<IncidentDetailsDialogProps> = ({
  incident,
  open,
  onClose,
  onStatusUpdate,
  onAssignOfficer
}) => {
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [assignedOfficer, setAssignedOfficer] = useState('');

  useEffect(() => {
    if (incident) {
      setNewStatus(incident.status);
      setAssignedOfficer(incident.assigned_officer || '');
    }
  }, [incident]);

  const handleStatusUpdate = () => {
    if (incident && newStatus !== incident.status) {
      onStatusUpdate(incident.id, newStatus, notes);
      setNotes('');
    }
  };

  const handleAssignOfficer = () => {
    if (incident && assignedOfficer) {
      onAssignOfficer(incident.id, assignedOfficer);
    }
  };

  if (!incident) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Emergency Incident Details - {incident.id.substring(0, 8)}
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Incident Information
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Type:</strong> {incident.incident_type}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Priority:</strong> 
                <Chip 
                  label={incident.priority}
                  color={
                    incident.priority === 'critical' ? 'error' :
                    incident.priority === 'high' ? 'warning' : 'info'
                  }
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Status:</strong> 
                <Chip 
                  label={incident.status}
                  color={
                    incident.status === 'resolved' ? 'success' :
                    incident.status === 'investigating' ? 'warning' : 'default'
                  }
                  size="small"
                  sx={{ ml: 1 }}
                />
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Created:</strong> {new Date(incident.created_at).toLocaleString()}
              </Typography>
              <Typography variant="body2" gutterBottom>
                <strong>Location:</strong> {incident.location.latitude.toFixed(6)}, {incident.location.longitude.toFixed(6)}
              </Typography>
              {incident.description && (
                <Typography variant="body2" gutterBottom>
                  <strong>Description:</strong> {incident.description}
                </Typography>
              )}
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="h6" gutterBottom>
                Response Actions
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Update Status</InputLabel>
                <Select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  label="Update Status"
                >
                  <MenuItem value="open">Open</MenuItem>
                  <MenuItem value="investigating">Investigating</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                  <MenuItem value="closed">Closed</MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Status Update Notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                onClick={handleStatusUpdate}
                startIcon={<Update />}
                disabled={newStatus === incident.status}
                sx={{ mb: 2, mr: 1 }}
              >
                Update Status
              </Button>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Assign Officer</InputLabel>
                <Select
                  value={assignedOfficer}
                  onChange={(e) => setAssignedOfficer(e.target.value)}
                  label="Assign Officer"
                >
                  <MenuItem value="officer_001">Officer Singh</MenuItem>
                  <MenuItem value="officer_002">Officer Sharma</MenuItem>
                  <MenuItem value="officer_003">Officer Das</MenuItem>
                  <MenuItem value="officer_004">Officer Patel</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="outlined"
                onClick={handleAssignOfficer}
                startIcon={<Assignment />}
                disabled={assignedOfficer === incident.assigned_officer}
              >
                Assign Officer
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<Phone />}
              size="small"
            >
              Call Tourist
            </Button>
            <Button
              variant="outlined"
              startIcon={<Phone />}
              size="small"
            >
              Call Emergency Contact
            </Button>
            <Button
              variant="outlined"
              startIcon={<LocationOn />}
              size="small"
            >
              Send Location to Team
            </Button>
            <Button
              variant="outlined"
              startIcon={<EmergencyIcon />}
              size="small"
            >
              Dispatch Emergency Services
            </Button>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

const EmergencyResponseCenter: React.FC = () => {
  const dispatch = useDispatch();
  const { incidents, loading } = useSelector((state: RootState) => state.emergency);
  
  const [selectedIncident, setSelectedIncident] = useState<EmergencyIncident | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const openIncidents = incidents.filter(i => i.status === 'open');
  const criticalIncidents = incidents.filter(i => i.priority === 'critical');
  const activeIncidents = incidents.filter(i => ['open', 'investigating'].includes(i.status));

  const filteredIncidents = incidents.filter(incident => {
    if (statusFilter === 'all') return true;
    return incident.status === statusFilter;
  });

  const handleIncidentClick = (incident: EmergencyIncident) => {
    setSelectedIncident(incident);
    setDialogOpen(true);
  };

  const handleStatusUpdate = (incidentId: string, status: string, notes?: string) => {
    // In a real application, this would dispatch a thunk to a backend API
    console.log(`Updating incident ${incidentId} to status ${status} with notes: ${notes}`);
    dispatch(updateIncidentStatus({ incidentId, status, notes }));
  };

  const handleAssignOfficer = (incidentId: string, officerId: string) => {
    // In a real application, this would dispatch a thunk to a backend API
    console.log(`Assigning officer ${officerId} to incident ${incidentId}`);
    dispatch(assignOfficer({ incidentId, officerId }));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'error';
      case 'high': return 'warning';
      case 'medium': return 'info';
      default: return 'default';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'success';
      case 'investigating': return 'warning';
      case 'closed': return 'default';
      default: return 'error';
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header Stats */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EmergencyIcon sx={{ fontSize: 40, color: 'error.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Open Incidents
                  </Typography>
                  <Typography variant="h4">
                    {openIncidents.length}
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
                <EmergencyIcon sx={{ fontSize: 40, color: 'warning.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Critical Priority
                  </Typography>
                  <Typography variant="h4">
                    {criticalIncidents.length}
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
                <Assignment sx={{ fontSize: 40, color: 'info.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Under Investigation
                  </Typography>
                  <Typography variant="h4">
                    {incidents.filter(i => i.status === 'investigating').length}
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
                <CheckCircle sx={{ fontSize: 40, color: 'success.main', mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Resolved Today
                  </Typography>
                  <Typography variant="h4">
                    {incidents.filter(i => 
                      i.status === 'resolved' && 
                      new Date(i.created_at).toDateString() === new Date().toDateString()
                    ).length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            label="Filter by Status"
          >
            <MenuItem value="all">All Incidents</MenuItem>
            <MenuItem value="open">Open</MenuItem>
            <MenuItem value="investigating">Investigating</MenuItem>
            <MenuItem value="resolved">Resolved</MenuItem>
            <MenuItem value="closed">Closed</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Incidents List */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Emergency Incidents
          </Typography>
          
          {filteredIncidents.length === 0 ? (
            <Alert severity="info">No incidents found for the selected filter.</Alert>
          ) : (
            <List>
              {filteredIncidents
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .map((incident, index) => (
                  <React.Fragment key={incident.id}>
                    <ListItem 
                      button 
                      onClick={() => handleIncidentClick(incident)}
                      sx={{ 
                        border: incident.priority === 'critical' ? '2px solid red' : 'none',
                        borderRadius: 1,
                        mb: 1
                      }}
                    >
                      <ListItemIcon>
                        <EmergencyIcon
                          color={
                            incident.priority === 'critical' ? 'error' :
                            incident.priority === 'high' ? 'warning' : 'info'
                          }
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="body1">
                              {incident.incident_type.toUpperCase()} - {incident.id.substring(0, 8)}
                            </Typography>
                            <Chip 
                              label={incident.priority}
                              color={getPriorityColor(incident.priority)}
                              size="small"
                            />
                            <Chip 
                              label={incident.status}
                              color={getStatusColor(incident.status)}
                              size="small"
                            />
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="textSecondary">
                              {incident.description || 'No description available'}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              Created: {new Date(incident.created_at).toLocaleString()} | 
                              Location: {incident.location.latitude.toFixed(4)}, {incident.location.longitude.toFixed(4)}
                              {incident.assigned_officer && ` | Assigned to: ${incident.assigned_officer}`}
                            </Typography>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < filteredIncidents.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
            </List>
          )}
        </CardContent>
      </Card>

      {/* Incident Details Dialog */}
      <IncidentDetailsDialog
        incident={selectedIncident}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onStatusUpdate={handleStatusUpdate}
        onAssignOfficer={handleAssignOfficer}
      />
    </Box>
  );
};

export default EmergencyResponseCenter;
