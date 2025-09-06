const express = require('express');
const axios = require('axios');
const { body, validationResult } = require('express-validator');
//import the service worker for on-chain transactions
const BlockchainService = require('./scripts/serviceWorker');

const app = express();
app.use(express.json());

//instance of the blockchain service
const blockchainService = new BlockchainService();

//microservice endpoint to register a new tourist on the blockchain
app.post('/api/blockchain/register', [
  body('aadhaarHash').notEmpty().withMessage('Aadhaar hash is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { aadhaarHash } = req.body;
  try {
    const blockchainId = await blockchainService.createDigitalId(aadhaarHash);
    res.json({ blockchainId });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Blockchain Service Error');
  }
});

//microservice endpoint to log an incident for a tourist on the blockchain
app.post('/api/blockchain/incident', [
  body('touristId').notEmpty().withMessage('Tourist ID is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { touristId } = req.body;

  try {
    const txHash = await blockchainService.recordIncident(touristId);
    res.json({ txHash });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Blockchain Service Error');
  }
});

//microservice endpoint to fetch the aadhaar hash of a tourist from the blockchain
app.get('/api/blockchain/tourist/:id', async (req, res) => {
  try {
    const touristId = req.params.id;
    const aadhaarHash = await blockchainService.getAadhaarHash(touristId);
    res.json({ aadhaarHash });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Blockchain Service Error');
  }
});

const PORT = 5002;
app.listen(PORT, () => console.log(`Blockchain microservice running on port ${PORT}`));