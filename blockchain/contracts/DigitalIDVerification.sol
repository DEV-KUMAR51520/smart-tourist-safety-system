// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title Digital ID Verification Contract
 * @dev Stores and verifies digital IDs for tourists
 */
contract DigitalIDVerification {
    address public owner;
    
    struct DigitalID {
        string touristId;      // Unique identifier for the tourist
        bytes32 dataHash;     // Hash of the tourist's data
        uint256 issuedAt;     // Timestamp when the ID was issued
        uint256 validUntil;   // Timestamp until which the ID is valid
        bool isRevoked;       // Whether the ID has been revoked
        address issuedBy;     // Address that issued the ID
    }
    
    // Mapping from digital ID to its details
    mapping(string => DigitalID) private digitalIDs;
    
    // Mapping to track if a digital ID exists
    mapping(string => bool) private idExists;
    
    // List of authorized issuers
    mapping(address => bool) private authorizedIssuers;
    
    // Events
    event IDIssued(string indexed touristId, uint256 validUntil);
    event IDVerified(string indexed touristId, bool isValid);
    event IDRevoked(string indexed touristId);
    event IssuerAdded(address indexed issuer);
    event IssuerRemoved(address indexed issuer);
    
    /**
     * @dev Constructor sets the owner of the contract
     */
    constructor() {
        owner = msg.sender;
        authorizedIssuers[msg.sender] = true; // Owner is an authorized issuer by default
    }
    
    /**
     * @dev Modifier to check if the caller is the owner
     */
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    /**
     * @dev Modifier to check if the caller is an authorized issuer
     */
    modifier onlyAuthorizedIssuer() {
        require(authorizedIssuers[msg.sender], "Only authorized issuers can call this function");
        _;
    }
    
    /**
     * @dev Add a new authorized issuer
     * @param issuer Address of the new issuer
     */
    function addIssuer(address issuer) external onlyOwner {
        require(issuer != address(0), "Invalid issuer address");
        require(!authorizedIssuers[issuer], "Issuer already authorized");
        
        authorizedIssuers[issuer] = true;
        emit IssuerAdded(issuer);
    }
    
    /**
     * @dev Remove an authorized issuer
     * @param issuer Address of the issuer to remove
     */
    function removeIssuer(address issuer) external onlyOwner {
        require(issuer != owner, "Cannot remove owner as issuer");
        require(authorizedIssuers[issuer], "Issuer not authorized");
        
        authorizedIssuers[issuer] = false;
        emit IssuerRemoved(issuer);
    }
    
    /**
     * @dev Check if an address is an authorized issuer
     * @param issuer Address to check
     * @return bool True if the address is an authorized issuer
     */
    function isAuthorizedIssuer(address issuer) external view returns (bool) {
        return authorizedIssuers[issuer];
    }
    
    /**
     * @dev Issue a new digital ID
     * @param touristId Unique identifier for the tourist
     * @param dataHash Hash of the tourist's data
     * @param validityDays Number of days the ID is valid for
     */
    function issueID(string calldata touristId, bytes32 dataHash, uint256 validityDays) external onlyAuthorizedIssuer {
        require(!idExists[touristId], "ID already exists");
        require(validityDays > 0, "Validity must be greater than 0");
        
        uint256 validUntil = block.timestamp + (validityDays * 1 days);
        
        DigitalID memory newID = DigitalID({
            touristId: touristId,
            dataHash: dataHash,
            issuedAt: block.timestamp,
            validUntil: validUntil,
            isRevoked: false,
            issuedBy: msg.sender
        });
        
        digitalIDs[touristId] = newID;
        idExists[touristId] = true;
        
        emit IDIssued(touristId, validUntil);
    }
    
    /**
     * @dev Verify a digital ID
     * @param touristId ID to verify
     * @param dataHash Hash of the data to verify against
     * @return isValid Whether the ID is valid
     * @return validUntil Timestamp until which the ID is valid
     * @return issuedAt Timestamp when the ID was issued
     */
    function verifyID(string calldata touristId, bytes32 dataHash) external view returns (bool isValid, uint256 validUntil, uint256 issuedAt) {
        require(idExists[touristId], "ID does not exist");
        
        DigitalID memory id = digitalIDs[touristId];
        
        // Check if ID is valid (not revoked, not expired, and data hash matches)
        isValid = !id.isRevoked && 
                 block.timestamp <= id.validUntil && 
                 id.dataHash == dataHash;
        
        return (isValid, id.validUntil, id.issuedAt);
    }
    
    /**
     * @dev Check if an ID exists and is valid (not revoked and not expired)
     * @param touristId ID to check
     * @return bool True if the ID exists and is valid
     */
    function isIDValid(string calldata touristId) external view returns (bool) {
        if (!idExists[touristId]) {
            return false;
        }
        
        DigitalID memory id = digitalIDs[touristId];
        return !id.isRevoked && block.timestamp <= id.validUntil;
    }
    
    /**
     * @dev Revoke a digital ID
     * @param touristId ID to revoke
     */
    function revokeID(string calldata touristId) external onlyAuthorizedIssuer {
        require(idExists[touristId], "ID does not exist");
        require(!digitalIDs[touristId].isRevoked, "ID already revoked");
        
        digitalIDs[touristId].isRevoked = true;
        emit IDRevoked(touristId);
    }
    
    /**
     * @dev Update the validity period of an ID
     * @param touristId ID to update
     * @param newValidityDays New validity period in days
     */
    function updateValidity(string calldata touristId, uint256 newValidityDays) external onlyAuthorizedIssuer {
        require(idExists[touristId], "ID does not exist");
        require(!digitalIDs[touristId].isRevoked, "Cannot update revoked ID");
        require(newValidityDays > 0, "Validity must be greater than 0");
        
        uint256 newValidUntil = block.timestamp + (newValidityDays * 1 days);
        digitalIDs[touristId].validUntil = newValidUntil;
        
        emit IDIssued(touristId, newValidUntil);
    }
    
    /**
     * @dev Get details of a digital ID
     * @param touristId ID to get details for
     * @return issuedAt Timestamp when the ID was issued
     * @return validUntil Timestamp until which the ID is valid
     * @return isRevoked Whether the ID has been revoked
     * @return issuedBy Address that issued the ID
     */
    function getIDDetails(string calldata touristId) external view returns (
        uint256 issuedAt,
        uint256 validUntil,
        bool isRevoked,
        address issuedBy
    ) {
        require(idExists[touristId], "ID does not exist");
        
        DigitalID memory id = digitalIDs[touristId];
        return (id.issuedAt, id.validUntil, id.isRevoked, id.issuedBy);
    }
    
    /**
     * @dev Calculate hash of tourist data
     * @param name Tourist's name
     * @param phone Tourist's phone number
     * @param email Tourist's email
     * @param additionalData Any additional data
     * @return bytes32 Hash of the data
     */
    function calculateDataHash(
        string calldata name,
        string calldata phone,
        string calldata email,
        string calldata additionalData
    ) external pure returns (bytes32) {
        return keccak256(abi.encodePacked(name, phone, email, additionalData));
    }
}