// Script to deploy the DigitalIDVerification contract

const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying DigitalIDVerification contract...");

  // Get the contract factory
  const DigitalIDVerification = await ethers.getContractFactory("DigitalIDVerification");
  
  // Deploy the contract
  const digitalIDVerification = await DigitalIDVerification.deploy();
  
  // Wait for deployment to finish
  await digitalIDVerification.deployed();
  
  console.log("DigitalIDVerification deployed to:", digitalIDVerification.address);
  
  // Save the contract address for later use
  saveContractAddress(digitalIDVerification.address);
  
  return digitalIDVerification;
}

function saveContractAddress(address) {
  const fs = require('fs');
  const path = require('path');
  
  // Create directory if it doesn't exist
  const deploymentDir = path.join(__dirname, '../deployments');
  if (!fs.existsSync(deploymentDir)) {
    fs.mkdirSync(deploymentDir);
  }
  
  // Save address to file
  const deploymentFile = path.join(deploymentDir, 'contract-address.json');
  fs.writeFileSync(
    deploymentFile,
    JSON.stringify({ DigitalIDVerification: address }, null, 2)
  );
  
  console.log("Contract address saved to", deploymentFile);
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error deploying contract:", error);
    process.exit(1);
  });