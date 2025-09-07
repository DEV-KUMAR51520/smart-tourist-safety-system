const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../db');
const auth = require('../middleware/auth'); // Your JWT middleware
const axios = require('axios');

//route to update tourist location and get risk assessment
router.post('/location', auth, [
  body('latitude').isFloat().withMessage('Invalid latitude'),
  body('longitude').isFloat().withMessage('Invalid longitude')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id: touristId } = req.tourist; // Get tourist ID from JWT
  const { latitude, longitude } = req.body;

  try {
    // Call the AI Service to get a risk score
    // const aiResponse = await axios.post('http://localhost:5001/api/ai/predict', {
    //   latitude,
    //   longitude,
    // });
    const riskScore = 75;

    // Update the tourist's location and status in the database
    const updateQuery = `
      UPDATE tourists
      SET
        current_latitude = $1,
        current_longitude = $2,
        status = $3
      WHERE id = $4
      RETURNING id, status;
    `;
    const newStatus = riskScore > 70 ? 'At-Risk' : 'Safe';
    const result = await db.query(updateQuery, [latitude, longitude, newStatus, touristId]);

    res.json({ message: 'Location updated', status: result.rows[0].status });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// Route to handle panic button press
router.post('/panic', auth, async (req, res) => {
  const { id: touristId } = req.tourist; // Get tourist ID from JWT
  try {
    const touristQuery = 'SELECT blockchain_id FROM tourists WHERE id = $1';
    const result = await db.query(touristQuery, [touristId]);
    const blockchainId = result.rows[0].blockchain_id;
    if (!blockchainId) {
      return res.status(400).json({ message: 'Tourist has no blockchain ID. Please re-register.' });
    }
    // Call the Blockchain microservice to record an immutable incident
    const blockchainResponse = await axios.post('http://localhost:5002/api/blockchain/incident', {
      touristId: blockchainId,
    });
    const txHash = blockchainResponse.data.txHash;
    const updateStatusQuery = `
      UPDATE tourists
      SET status = 'Emergency'
      WHERE id = $1
    `;
    await db.query(updateStatusQuery, [touristId]);
    // Insert the incident into your private database
    const insertIncidentQuery = `
      INSERT INTO incidents (tourist_id, transaction_hash)
      VALUES ($1, $2)
    `;
    await db.query(insertIncidentQuery, [touristId, txHash]);
    res.json({ message: 'Panic alert recorded.', transactionHash: txHash });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});
router.post('/resolve-incident', auth, async (req, res) => {
  const { touristId, incidentId } = req.body;
  try {
    const touristQuery = 'SELECT blockchain_id FROM tourists WHERE id = $1';
    const result = await db.query(touristQuery, [touristId]);
    const blockchainId = result.rows[0].blockchain_id;
    if (!blockchainId) {
      return res.status(400).json({ message: 'Tourist has no blockchain ID.' });
    }
    // Call the Blockchain microservice to resolve the incident on-chain
    await axios.post('http://localhost:5002/api/blockchain/resolve-incident', {
      touristId: blockchainId,
    });
    // Update the tourist's status in the database
    const updateTouristStatusQuery = `
      UPDATE tourists
      SET status = 'Safe'
      WHERE id = $1
    `;
    await db.query(updateTouristStatusQuery, [touristId]);
    // Update the incident record in the database with the resolved time
    const updateIncidentQuery = `
      UPDATE incidents
      SET resolved_at = NOW()
      WHERE id = $1
    `;
    await db.query(updateIncidentQuery, [incidentId]);
    res.json({ message: 'Incident resolved successfully.' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/incidents', auth, async (req, res) => {
  const { id: touristId } = req.tourist; // Get tourist ID from JWT
  try {
    const incidentsQuery = 'SELECT * FROM incidents WHERE tourist_id = $1 ORDER BY created_at DESC';
    const result = await db.query(incidentsQuery, [touristId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No incidents found for this tourist.' });
    }
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;