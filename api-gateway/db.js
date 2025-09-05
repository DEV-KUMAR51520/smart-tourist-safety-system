const { Pool } = require('pg');
require('dotenv').config();

// Create the connection pool using the single connection string
const pool = new Pool({
  connectionString: process.env.PG_CONN_STRING,
});

// A simple function to test the connection and log a success message
const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Database connection successful!');
    client.release();
  } catch (err) {
    console.error('Database connection failed:', err);
  }
};

testConnection();

module.exports = {
  query: (text, params) => pool.query(text, params),
};