const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const auth = require('../middleware/auth'); // Import the JWT middleware
const yourBlockchainService = require('../../microservices/blockchain/blockchainService'); // Placeholder for your blockchain service

// Validation middleware for registration
const registerValidation = [
  body('name').notEmpty().withMessage('Name is required'),
  body('phone').isMobilePhone('any').withMessage('A valid phone number is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('aadhaar').isLength({ min: 12, max: 12 }).withMessage('Aadhaar must be 12 digits'),
  body('emergency_contact').notEmpty().withMessage('Emergency contact is required'),
  body('entry_point').notEmpty().withMessage('Entry point is required'),
  body('trip_duration').notEmpty().withMessage('Trip duration is required'),
];

router.post('/register', registerValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, phone, password, aadhaar, emergency_contact, entry_point, trip_duration } = req.body;
  try {
    const aadhaarHash = require('crypto').createHash('sha256').update(aadhaar).digest('hex');
    const checkUserQuery = 'SELECT id FROM tourists WHERE aadhaar_hash = $1';
    const result = await db.query(checkUserQuery, [aadhaarHash]);
    if (result.rows.length > 0) {
      return res.status(409).json({ message: 'Tourist already registered' });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const insertUserQuery = `
      INSERT INTO tourists (
        name, phone, password_hash, aadhaar_hash, emergency_contact, entry_point, trip_duration
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, phone
    `;
    const values = [name, phone, passwordHash, aadhaarHash, emergency_contact, entry_point, trip_duration];
    const newUserResult = await db.query(insertUserQuery, values);
    const newTourist = newUserResult.rows[0];
    (async () => {
      try {
        // Assume this function returns a blockchain ID after a delay
        const blockchainId = await yourBlockchainService.createDigitalId("0x" + aadhaarHash);
        // Update the tourist's record in the database
        const updateQuery = 'UPDATE tourists SET blockchain_id = $1 WHERE id = $2';
        await db.query(updateQuery, [blockchainId, newTourist.id]);
        console.log(`Successfully updated tourist ${newTourist.id} with blockchain ID: ${blockchainId}`);
      } catch (e) {
        console.error(`Failed to update blockchain ID for tourist ${newTourist.id}: ${e.message}`);
        // Handle error, e.g., send a notification to a system admin
      }
    })();
    // Create and sign a JWT token
    const payload = {
      tourist: { id: newTourist.id },
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    // Respond to the client immediately, without waiting for the blockchain process
    res.status(201).json({
      message: 'Tourist registered successfully. Your digital ID is being generated.',
      tourist: {
        id: newTourist.id,
        name: newTourist.name,
        phone: newTourist.phone,
        blockchainId: null, // Return null to indicate it's not ready yet
      },
      accessToken,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.post('/login', [
  body('phone').isMobilePhone('any').withMessage('Please enter a valid phone number'),
  body('password').exists().withMessage('Password is required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { phone, password } = req.body;
  try {
    const userQuery = 'SELECT * FROM tourists WHERE phone = $1';
    const result = await db.query(userQuery, [phone]);
    const tourist = result.rows[0];
    if (!tourist) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const isMatch = await bcrypt.compare(password, tourist.password_hash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    const payload = {
      tourist: { id: tourist.id },
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({
      message: 'Login successful',
      tourist: {
        id: tourist.id,
        name: tourist.name,
        phone: tourist.phone,
        blockchainId: tourist.blockchain_id,
      },
      accessToken,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

router.get('/profile', auth, async (req, res) => {
  try {
    const touristId = req.tourist.id; // ID from JWT payload
    const userQuery = 'SELECT id, name, phone, blockchain_id FROM tourists WHERE id = $1';
    const result = await db.query(userQuery, [touristId]);
    const tourist = result.rows[0];
    if (!tourist) {
      return res.status(404).json({ message: 'Tourist not found' });
    }
    res.json(tourist);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;