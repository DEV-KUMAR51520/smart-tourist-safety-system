// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TouristSafety is ERC721, Ownable {
    // A mapping to store a tourist's digital identity
    // Key: Hashed Aadhaar number (bytes32) -> Value: NFT ID (uint256)
    mapping(bytes32 => uint256) public aadhaarToTouristId;

    // A mapping to track the status of an emergency (Incident ID -> Boolean)
    mapping(uint256 => bool) public isIncidentActive;

    // A mapping to find the Aadhaar hash from a tourist ID
    mapping(uint256 => bytes32) private touristIdToAadhaarHash;

    // Counter for assigning unique IDs to tourists
    uint256 private _touristCounter;

    // Events to log important actions
    event TouristRegistered(address indexed owner, uint256 touristId, bytes32 indexed aadhaarHash);
    event IncidentRecorded(uint256 indexed incidentId, uint256 touristId, bytes32 indexed aadhaarHash);

    constructor() ERC721("TouristSafetyNFT", "TSN") Ownable(msg.sender) {}

    /**
     * @dev Registers a new tourist and creates a unique Digital ID.
     * This function can only be called by the contract owner (the Backend API).
     * @param _aadhaarHash A cryptographic hash of the tourist's Aadhaar number.
     */
    function registerTourist(bytes32 _aadhaarHash) external onlyOwner {
        // Ensure this Aadhaar hash hasn't been used yet
        require(aadhaarToTouristId[_aadhaarHash] == 0, "Aadhaar hash already registered");

        _touristCounter++;
        uint256 newTouristId = _touristCounter;
        
        // Mints a new NFT to represent the tourist's digital ID.
        _mint(msg.sender, newTouristId);

        // Link the Aadhaar hash to the new NFT ID
        aadhaarToTouristId[_aadhaarHash] = newTouristId;
        touristIdToAadhaarHash[newTouristId] = _aadhaarHash;

        emit TouristRegistered(msg.sender, newTouristId, _aadhaarHash);
    }

    /**
     * @dev Records a new emergency incident for a specific tourist.
     * This function can only be called by the contract owner (the Backend API).
     * @param _touristId The unique ID of the tourist.
     */
    function recordIncident(uint256 _touristId) external onlyOwner {
        // Ensure the tourist exists and is not already in an active incident
        require(aadhaarToTouristId[touristIdToAadhaarHash[_touristId]] != 0, "Tourist ID must be valid");
        require(isIncidentActive[_touristId] == false, "Incident already active for this tourist");

        // Record the incident as active
        isIncidentActive[_touristId] = true;
        emit IncidentRecorded(block.timestamp, _touristId, touristIdToAadhaarHash[_touristId]);
    }

    function getAadhaarHash(uint256 _touristId) external view returns (bytes32) {
        require(touristIdToAadhaarHash[_touristId] != 0, "Tourist ID not found");
        return touristIdToAadhaarHash[_touristId];
    }
}