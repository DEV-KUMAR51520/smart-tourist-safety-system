const { ethers } = require('ethers');
require('dotenv').config();

// Contract ABI (Application Binary Interface)
// This JSON tells ethers.js what the functions in the smart contract are
const contractABI = require('./artifacts/contracts/TouristSafety.sol/TouristSafety.json').abi;

// Get your blockchain connection details from .env
const PRIVATE_KEY = process.env.POLYGON_PRIVATE_KEY;
const RPC_URL = process.env.POLYGON_RPC_URL;
const CONTRACT_ADDRESS = process.env.POLYGON_CONTRACT_ADDRESS;

if (!PRIVATE_KEY || !RPC_URL || !CONTRACT_ADDRESS) {
  throw new Error("Missing Polygon blockchain credentials in .env file.");
}

// Set up a provider to connect to the Polygon network
const provider = new ethers.JsonRpcProvider(RPC_URL);

// Create a wallet instance from the private key
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Create a contract instance
const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

class BlockchainService {
  async createDigitalId(aadhaarHash) {
    try {
      const tx = await contract.registerTourist("0x" + aadhaarHash); // Pass the hash with '0x' prefix
      const receipt = await tx.wait(); // Wait for the transaction to be mined

      if (receipt.status === 1) {
        // Find the 'TouristRegistered' event in the transaction receipt logs
        const event = receipt.logs.find(log => log.topics[0] === ethers.id("TouristRegistered(address,uint256,bytes32)"));

        if (event) {
          // Decode the event to get the touristId
          const decodedEvent = contract.interface.decodeEventLog("TouristRegistered", event.data, event.topics);
          const touristId = decodedEvent.touristId.toString();
          console.log(`Transaction successful. Tourist registered with ID: ${touristId}`);
          return touristId; // Return the actual NFT ID
        } else {
          throw new Error("TouristRegistered event not found in transaction receipt.");
        }
      } else {
        throw new Error("Transaction failed.");
      }
    } catch (error) {
      console.error("Error creating digital ID:", error);
      throw error;
    }
  }

  async recordIncident(touristId) {
    try {
      const tx = await contract.recordIncident(touristId);
      const receipt = await tx.wait();

      if (receipt.status === 1) {
        console.log(`Incident recorded for tourist ${touristId}.`);
        return receipt.hash;
      } else {
        throw new Error("Transaction failed.");
      }
    } catch (error) {
      console.error("Error recording incident:", error);
      throw error;
    }
  }
}

module.exports = BlockchainService;