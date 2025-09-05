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

    // Counter for assigning unique IDs to tourists
    uint256 private _touristCounter;

    // Events to log important actions
    event TouristRegistered(address indexed owner, uint256 touristId, bytes32 indexed aadhaarHash);
    event IncidentRecorded(uint256 indexed incidentId, uint256 touristId, bytes32 indexed aadhaarHash);

    // Only allow the Backend API to call this function
    modifier onlyBackend() {
        // You would secure this by checking the caller's address
        // For a simple demo, we'll assume the owner is the backend
        require(msg.sender == owner(), "Only the backend can call this function");
        _;
    }

    constructor() ERC721("TouristSafetyNFT", "TSN") Ownable(msg.sender) {}

    // Function to register a new tourist and create a unique Digital ID
    function registerTourist(bytes32 _aadhaarHash) external onlyBackend {
        // Ensure this Aadhaar hash hasn't been used yet
        require(aadhaarToTouristId[_aadhaarHash] == 0, "Aadhaar hash already registered");

        _touristCounter++;
        uint256 newTouristId = _touristCounter;
        
        // This creates a unique NFT (Non-Fungible Token) for the tourist
        _mint(msg.sender, newTouristId);

        aadhaarToTouristId[_aadhaarHash] = newTouristId;
        emit TouristRegistered(msg.sender, newTouristId, _aadhaarHash);
    }

    // Function to record an emergency incident
    function recordIncident(uint256 _touristId) external onlyBackend {
        // Ensure the tourist exists and is not already in an active incident
        require(_touristId != 0, "Tourist ID must be valid");
        require(isIncidentActive[_touristId] == false, "Incident already active for this tourist");

        // Record the incident as active
        isIncidentActive[_touristId] = true;
        emit IncidentRecorded(block.timestamp, _touristId, _getAadhaarHash(_touristId));
    }

    // A helper function to find the aadhaar hash from a tourist ID (for events)
    function _getAadhaarHash(uint256 _touristId) private view returns (bytes32) {
        for (uint256 i = 1; i <= _touristCounter; i++) {
            if (aadhaarToTouristId[_getAadhaarHash(i)] == _touristId) {
                return _getAadhaarHash(i);
            }
        }
        revert("Tourist ID not found");
    }
}