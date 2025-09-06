const { ethers } = require("hardhat");
async function main() {
  const TouristSafety = await ethers.getContractFactory("TouristSafety");
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  const touristSafety = await TouristSafety.deploy();
  await touristSafety.waitForDeployment();
  console.log("TouristSafety contract deployed to address:", touristSafety.target);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});