const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Tourist = require('../models/Tourist');
const Incident = require('../models/Incident');

// @route   GET /api/tourists
// @desc    Get all tourists
// @access  Private (Admin)
router.get('/', auth, async (req, res) => {
  try {
    const tourists = await Tourist.find();
    res.json(tourists);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/tourists/location
// @desc    Update tourist's location
// @access  Private (Tourist)
router.post('/location', auth, async (req, res) => {
  const { lat, lng } = req.body;
  try {
    // In a real app, save location to a time-series DB
    // For now, update the tourist's last known location
    const tourist = await Tourist.findById(req.user.id);
    if (tourist) {
      tourist.last_location = { lat, lng, timestamp: new Date() };
      await tourist.save();
      // Emit real-time update via WebSocket
      // req.io.emit('locationUpdate', { touristId: tourist.id, location: tourist.last_location });
      res.json({ message: 'Location updated' });
    } else {
      res.status(404).json({ message: 'Tourist not found' });
    }
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/tourists/panic
// @desc    Trigger a panic incident
// @access  Private (Tourist)
router.post('/panic', auth, async (req, res) => {
  const { lat, lng } = req.body;
  try {
    const incident = new Incident({
      tourist: req.user.id,
      type: 'Panic button activated',
      location: { lat, lng },
      status: 'unassigned',
      priority: 'critical'
    });
    await incident.save();
    // Emit real-time alert via WebSocket
    // req.io.emit('newAlert', { incident });
    res.status(201).json({ message: 'Panic alert created' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/incidents/:id/acknowledge
// @desc    Acknowledge an incident
// @access  Private (Admin)
router.post('/incidents/:id/acknowledge', auth, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    incident.status = 'pending';
    await incident.save();
    res.json(incident);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/incidents/:id/resolve
// @desc    Resolve an incident
// @access  Private (Admin)
router.post('/incidents/:id/resolve', auth, async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ message: 'Incident not found' });
    }
    incident.status = 'resolved';
    await incident.save();
    res.json(incident);
  } catch (err) {
    res.status(500).send('Server Error');
  }
});

module.exports = router;
