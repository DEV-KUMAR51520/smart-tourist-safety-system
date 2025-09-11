/**
 * IoT Data Service
 * Handles real-time IoT data processing from smart bands/tags
 * Provides WebSocket connections for dashboard real-time updates
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mongoose = require('mongoose');
const cors = require('cors');

// IoT Data Schema
const iotDataSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  userId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    accuracy: { type: Number }
  },
  healthData: {
    heartRate: Number,
    bodyTemperature: Number,
    steps: Number
  },
  environmentData: {
    temperature: Number,
    humidity: Number,
    airQuality: Number
  },
  batteryLevel: Number,
  status: { type: String, enum: ['safe', 'warning', 'critical'], default: 'safe' },
  alerts: [{
    type: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
  }]
});

const IoTData = mongoose.model('IoTData', iotDataSchema);

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Initialize WebSocket server
const wss = new WebSocket.Server({ server });

// Connected clients
const clients = new Set();

// Broadcast to all connected clients
function broadcast(data) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// WebSocket connection handler
wss.on('connection', (ws) => {
  clients.add(ws);
  console.log('New client connected');
  
  // Send initial data
  sendInitialData(ws);
  
  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message);
      
      // Handle different message types
      if (data.type === 'subscribe') {
        // Handle subscription requests
        ws.subscriptions = ws.subscriptions || [];
        ws.subscriptions.push(data.channel);
      } else if (data.type === 'iot_data') {
        // Process and store IoT data
        await processIoTData(data.payload);
      }
    } catch (error) {
      console.error('Error processing message:', error);
    }
  });
  
  ws.on('close', () => {
    clients.delete(ws);
    console.log('Client disconnected');
  });
});

// Send initial data to new connections
async function sendInitialData(ws) {
  try {
    // Get the latest IoT data for all devices
    const latestData = await getLatestIoTData();
    ws.send(JSON.stringify({
      type: 'initial_data',
      payload: latestData
    }));
  } catch (error) {
    console.error('Error sending initial data:', error);
  }
}

// Get latest IoT data for all devices
async function getLatestIoTData() {
  try {
    // Aggregate to get the latest entry for each device
    const latestData = await IoTData.aggregate([
      { $sort: { timestamp: -1 } },
      { $group: {
          _id: "$deviceId",
          data: { $first: "$$ROOT" }
        }
      },
      { $replaceRoot: { newRoot: "$data" } }
    ]);
    
    return latestData;
  } catch (error) {
    console.error('Error getting latest IoT data:', error);
    return [];
  }
}

// Process incoming IoT data
async function processIoTData(data) {
  try {
    // Calculate status based on health and environmental data
    const status = calculateStatus(data);
    
    // Create new IoT data entry
    const iotData = new IoTData({
      ...data,
      status,
      timestamp: new Date()
    });
    
    // Save to database
    await iotData.save();
    
    // Check for alerts
    const alerts = generateAlerts(data, status);
    if (alerts.length > 0) {
      iotData.alerts = alerts;
      await iotData.save();
    }
    
    // Broadcast update to all clients
    broadcast({
      type: 'iot_update',
      payload: iotData
    });
    
    return iotData;
  } catch (error) {
    console.error('Error processing IoT data:', error);
    throw error;
  }
}

// Calculate status based on health and environmental data
function calculateStatus(data) {
  let status = 'safe';
  
  // Check health data
  if (data.healthData) {
    const { heartRate, bodyTemperature } = data.healthData;
    
    if (heartRate > 120 || heartRate < 40 || bodyTemperature > 39) {
      status = 'critical';
    } else if (heartRate > 100 || heartRate < 50 || bodyTemperature > 38) {
      status = 'warning';
    }
  }
  
  // Check environmental data
  if (data.environmentData && status !== 'critical') {
    const { temperature, airQuality } = data.environmentData;
    
    if (temperature > 45 || airQuality > 300) {
      status = 'critical';
    } else if (temperature > 40 || airQuality > 200) {
      status = 'warning';
    }
  }
  
  // Check battery level
  if (data.batteryLevel < 10 && status !== 'critical') {
    status = 'warning';
  }
  
  return status;
}

// Generate alerts based on data and status
function generateAlerts(data, status) {
  const alerts = [];
  
  if (status === 'critical') {
    if (data.healthData && data.healthData.heartRate > 120) {
      alerts.push({
        type: 'health',
        message: 'High heart rate detected',
        timestamp: new Date()
      });
    }
    
    if (data.healthData && data.healthData.bodyTemperature > 39) {
      alerts.push({
        type: 'health',
        message: 'High body temperature detected',
        timestamp: new Date()
      });
    }
    
    if (data.environmentData && data.environmentData.temperature > 45) {
      alerts.push({
        type: 'environment',
        message: 'Extreme environmental temperature',
        timestamp: new Date()
      });
    }
    
    if (data.environmentData && data.environmentData.airQuality > 300) {
      alerts.push({
        type: 'environment',
        message: 'Hazardous air quality detected',
        timestamp: new Date()
      });
    }
  }
  
  if (data.batteryLevel < 10) {
    alerts.push({
      type: 'device',
      message: 'Low battery level',
      timestamp: new Date()
    });
  }
  
  return alerts;
}

// API Routes

// Get all IoT data
app.get('/api/iot-data', async (req, res) => {
  try {
    const data = await IoTData.find().sort({ timestamp: -1 }).limit(100);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get latest IoT data for all devices
app.get('/api/iot-data/latest', async (req, res) => {
  try {
    const data = await getLatestIoTData();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get IoT data for a specific device
app.get('/api/iot-data/:deviceId', async (req, res) => {
  try {
    const data = await IoTData.find({ deviceId: req.params.deviceId })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get IoT data for a specific user
app.get('/api/iot-data/user/:userId', async (req, res) => {
  try {
    const data = await IoTData.find({ userId: req.params.userId })
      .sort({ timestamp: -1 })
      .limit(50);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Post new IoT data
app.post('/api/iot-data', async (req, res) => {
  try {
    const result = await processIoTData(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get heatmap data
app.get('/api/heatmap-data', async (req, res) => {
  try {
    const latestData = await getLatestIoTData();
    
    // Transform data for heatmap
    const heatmapData = latestData.map(item => {
      // Intensity based on status: critical = 1.0, warning = 0.7, safe = 0.3
      const intensity = 
        item.status === 'critical' ? 1.0 : 
        item.status === 'warning' ? 0.7 : 0.3;
      
      return [
        item.location.lat,
        item.location.lng,
        intensity
      ];
    });
    
    res.json(heatmapData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`IoT Data Service running on port ${PORT}`);
});

module.exports = {
  app,
  server,
  wss,
  IoTData,
  processIoTData,
  calculateStatus,
  generateAlerts
};