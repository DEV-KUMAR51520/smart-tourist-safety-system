// contracts/DigitalTouristID.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DigitalTouristID is Ownable, ReentrancyGuard {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    struct TouristID {
        string touristId;
        bytes32 aadhaarHash;
        uint256 createdAt;
        uint256 expiryDate;
        bool isActive;
        string entryPoint;
        address issuer;
    }

    struct TravelRecord {
        uint256 timestamp;
        string location;
        string activity;
        bool isEmergency;
    }

    mapping(uint256 => TouristID) public touristIDs;
    mapping(uint256 => TravelRecord[]) public travelRecords;
    mapping(string => uint256) public touristIdToTokenId;
    mapping(address => bool) public authorizedIssuers;

    event IDCreated(uint256 indexed tokenId, string touristId, address issuer);
    event TravelRecordAdded(uint256 indexed tokenId, string location, uint256 timestamp);
    event EmergencyRecorded(uint256 indexed tokenId, string location, uint256 timestamp);
    event IDDeactivated(uint256 indexed tokenId);

    modifier onlyAuthorized() {
        require(authorizedIssuers[msg.sender] || owner() == msg.sender, "Not authorized");
        _;
    }

    constructor() {
        authorizedIssuers[msg.sender] = true;
    }

    function addAuthorizedIssuer(address issuer) external onlyOwner {
        authorizedIssuers[issuer] = true;
    }

    function removeAuthorizedIssuer(address issuer) external onlyOwner {
        authorizedIssuers[issuer] = false;
    }

    function createDigitalID(
        string memory _touristId,
        bytes32 _aadhaarHash,
        string memory _entryPoint,
        uint256 _validityDays
    ) external onlyAuthorized nonReentrant returns (uint256) {
        require(bytes(_touristId).length > 0, "Tourist ID cannot be empty");
        require(_aadhaarHash != bytes32(0), "Invalid Aadhaar hash");
        require(touristIdToTokenId[_touristId] == 0, "Tourist ID already exists");

        _tokenIdCounter.increment();
        uint256 newTokenId = _tokenIdCounter.current();

        TouristID storage newID = touristIDs[newTokenId];
        newID.touristId = _touristId;
        newID.aadhaarHash = _aadhaarHash;
        newID.createdAt = block.timestamp;
        newID.expiryDate = block.timestamp + (_validityDays * 1 days);
        newID.isActive = true;
        newID.entryPoint = _entryPoint;
        newID.issuer = msg.sender;

        touristIdToTokenId[_touristId] = newTokenId;

        emit IDCreated(newTokenId, _touristId, msg.sender);
        return newTokenId;
    }

    function addTravelRecord(
        string memory _touristId,
        string memory _location,
        string memory _activity
    ) external onlyAuthorized {
        uint256 tokenId = touristIdToTokenId[_touristId];
        require(tokenId != 0, "Tourist ID not found");
        require(touristIDs[tokenId].isActive, "Tourist ID not active");
        require(block.timestamp <= touristIDs[tokenId].expiryDate, "Tourist ID expired");

        TravelRecord memory record = TravelRecord({
            timestamp: block.timestamp,
            location: _location,
            activity: "EMERGENCY",
            isEmergency: false
        });

        travelRecords[tokenId].push(record);
        emit TravelRecordAdded(tokenId, _location, block.timestamp);
    }

    function recordEmergency(
        string memory _touristId,
        string memory _location
    ) external onlyAuthorized {
        uint256 tokenId = touristIdToTokenId[_touristId];
        require(tokenId != 0, "Tourist ID not found");
        require(touristIDs[tokenId].isActive, "Tourist ID not active");

        TravelRecord memory emergencyRecord = TravelRecord({
            timestamp: block.timestamp,
            location: _location,
            activity: "EMERGENCY",
            isEmergency: true
        });

        travelRecords[tokenId].push(emergencyRecord);
        emit EmergencyRecorded(tokenId, _location, block.timestamp);
    }

    function deactivateID(string memory _touristId) external onlyAuthorized {
        uint256 tokenId = touristIdToTokenId[_touristId];
        require(tokenId != 0, "Tourist ID not found");

        touristIDs[tokenId].isActive = false;
        emit IDDeactivated(tokenId);
    }

    function verifyTouristID(string memory _touristId) 
        external view returns (bool isValid, uint256 expiryDate, string memory entryPoint) {
        uint256 tokenId = touristIdToTokenId[_touristId];
        if (tokenId == 0) {
            return (false, 0, "");
        }

        TouristID memory id = touristIDs[tokenId];
        bool valid = id.isActive && block.timestamp <= id.expiryDate;

        return (valid, id.expiryDate, id.entryPoint);
    }

    function getTravelHistory(string memory _touristId) 
        external view returns (TravelRecord[] memory) {
        uint256 tokenId = touristIdToTokenId[_touristId];
        require(tokenId != 0, "Tourist ID not found");

        return travelRecords[tokenId];
    }

    function getTouristIDDetails(string memory _touristId) 
        external view returns (TouristID memory) {
        uint256 tokenId = touristIdToTokenId[_touristId];
        require(tokenId != 0, "Tourist ID not found");

        return touristIDs[tokenId];
    }

    function getTotalIDs() external view returns (uint256) {
        return _tokenIdCounter.current();
    }
}