const { ethers } = require('ethers');
require('dotenv').config();
const contractABI = require('../artifacts/contracts/TouristSafety.sol/TouristSafety.json').abi;

const PRIVATE_KEY = process.env.METAMASK_PRIVATE_KEY;
const RPC_URL = process.env.RPC_URL;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

if (!PRIVATE_KEY || !RPC_URL || !CONTRACT_ADDRESS) {
  throw new Error("Missing Polygon blockchain credentials in .env file.");
}

const provider = new ethers.JsonRpcProvider(RPC_URL);

const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, wallet);

class BlockchainService {
  async createDigitalId(aadhaarHash) {
    try {
      // The smart contract expects bytes32, so we add the 0x prefix
      const tx = await contract.registerTourist("0x" + aadhaarHash);
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

  async getAadhaarHash(touristId) {
    try {
      const aadhaarHash = await contract.getAadhaarHash(touristId);
      return aadhaarHash.substring(2);
    } catch (error) {
      console.error("Error getting Aadhaar hash:", error);
      throw error;
    }
  }
}

module.exports = BlockchainService;