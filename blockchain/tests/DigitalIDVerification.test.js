const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DigitalIDVerification", function () {
  let DigitalIDVerification;
  let digitalIDVerification;
  let owner;
  let issuer;
  let nonIssuer;
  
  beforeEach(async function () {
    // Get signers
    [owner, issuer, nonIssuer] = await ethers.getSigners();
    
    // Deploy the contract
    DigitalIDVerification = await ethers.getContractFactory("DigitalIDVerification");
    digitalIDVerification = await DigitalIDVerification.deploy();
    await digitalIDVerification.deployed();
    
    // Add issuer
    await digitalIDVerification.addIssuer(issuer.address);
  });
  
  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await digitalIDVerification.owner()).to.equal(owner.address);
    });
    
    it("Should make owner an authorized issuer", async function () {
      expect(await digitalIDVerification.isAuthorizedIssuer(owner.address)).to.equal(true);
    });
  });
  
  describe("Issuer Management", function () {
    it("Should allow owner to add issuers", async function () {
      const newIssuer = nonIssuer;
      await digitalIDVerification.addIssuer(newIssuer.address);
      expect(await digitalIDVerification.isAuthorizedIssuer(newIssuer.address)).to.equal(true);
    });
    
    it("Should allow owner to remove issuers", async function () {
      await digitalIDVerification.removeIssuer(issuer.address);
      expect(await digitalIDVerification.isAuthorizedIssuer(issuer.address)).to.equal(false);
    });
    
    it("Should not allow non-owners to add issuers", async function () {
      await expect(
        digitalIDVerification.connect(issuer).addIssuer(nonIssuer.address)
      ).to.be.revertedWith("Only owner can call this function");
    });
    
    it("Should not allow removing owner as issuer", async function () {
      await expect(
        digitalIDVerification.removeIssuer(owner.address)
      ).to.be.revertedWith("Cannot remove owner as issuer");
    });
  });
  
  describe("Digital ID Management", function () {
    const touristId = "TSN-1234567890";
    const name = "John Doe";
    const phone = "9876543210";
    const email = "john@example.com";
    const additionalData = "Passport: AB123456";
    let dataHash;
    
    beforeEach(async function () {
      // Calculate data hash
      dataHash = await digitalIDVerification.calculateDataHash(name, phone, email, additionalData);
    });
    
    it("Should allow authorized issuers to issue IDs", async function () {
      await digitalIDVerification.connect(issuer).issueID(touristId, dataHash, 30);
      expect(await digitalIDVerification.isIDValid(touristId)).to.equal(true);
    });
    
    it("Should not allow non-issuers to issue IDs", async function () {
      await expect(
        digitalIDVerification.connect(nonIssuer).issueID(touristId, dataHash, 30)
      ).to.be.revertedWith("Only authorized issuers can call this function");
    });
    
    it("Should not allow issuing duplicate IDs", async function () {
      await digitalIDVerification.issueID(touristId, dataHash, 30);
      await expect(
        digitalIDVerification.issueID(touristId, dataHash, 30)
      ).to.be.revertedWith("ID already exists");
    });
    
    it("Should verify valid IDs correctly", async function () {
      await digitalIDVerification.issueID(touristId, dataHash, 30);
      const [isValid, validUntil, issuedAt] = await digitalIDVerification.verifyID(touristId, dataHash);
      
      expect(isValid).to.equal(true);
      expect(validUntil).to.be.gt(Math.floor(Date.now() / 1000));
      expect(issuedAt).to.be.lte(Math.floor(Date.now() / 1000));
    });
    
    it("Should fail verification with incorrect data hash", async function () {
      await digitalIDVerification.issueID(touristId, dataHash, 30);
      const wrongHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes("wrong data"));
      
      const [isValid] = await digitalIDVerification.verifyID(touristId, wrongHash);
      expect(isValid).to.equal(false);
    });
    
    it("Should allow authorized issuers to revoke IDs", async function () {
      await digitalIDVerification.issueID(touristId, dataHash, 30);
      await digitalIDVerification.connect(issuer).revokeID(touristId);
      
      expect(await digitalIDVerification.isIDValid(touristId)).to.equal(false);
    });
    
    it("Should allow updating validity period", async function () {
      await digitalIDVerification.issueID(touristId, dataHash, 30);
      
      // Get original validity
      const [, originalValidUntil] = await digitalIDVerification.getIDDetails(touristId);
      
      // Update validity to 60 days
      await digitalIDVerification.updateValidity(touristId, 60);
      
      // Get new validity
      const [, newValidUntil] = await digitalIDVerification.getIDDetails(touristId);
      
      expect(newValidUntil).to.be.gt(originalValidUntil);
    });
    
    it("Should not allow updating revoked IDs", async function () {
      await digitalIDVerification.issueID(touristId, dataHash, 30);
      await digitalIDVerification.revokeID(touristId);
      
      await expect(
        digitalIDVerification.updateValidity(touristId, 60)
      ).to.be.revertedWith("Cannot update revoked ID");
    });
  });
  
  describe("Data Hash Calculation", function () {
    it("Should calculate consistent hashes for the same data", async function () {
      const name = "John Doe";
      const phone = "9876543210";
      const email = "john@example.com";
      const additionalData = "Passport: AB123456";
      
      const hash1 = await digitalIDVerification.calculateDataHash(name, phone, email, additionalData);
      const hash2 = await digitalIDVerification.calculateDataHash(name, phone, email, additionalData);
      
      expect(hash1).to.equal(hash2);
    });
    
    it("Should calculate different hashes for different data", async function () {
      const hash1 = await digitalIDVerification.calculateDataHash("John Doe", "9876543210", "john@example.com", "");
      const hash2 = await digitalIDVerification.calculateDataHash("Jane Doe", "9876543210", "jane@example.com", "");
      
      expect(hash1).to.not.equal(hash2);
    });
  });
});