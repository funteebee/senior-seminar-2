import hre from "hardhat";

async function main() {
  // Connect to Hardhat network and get ethers
  const { ethers } = await hre.network.connect();

  const [deployer] = await ethers.getSigners();

  console.log("Deploying DiplomaRegistry with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Deployer balance:", balance.toString());

  const DiplomaRegistry = await ethers.getContractFactory("DiplomaRegistry");
  const registry = await DiplomaRegistry.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  console.log("DiplomaRegistry deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
