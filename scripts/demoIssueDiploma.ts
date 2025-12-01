import hre from "hardhat";

async function main() {
  const { ethers } = await hre.network.connect();

  const [deployer, student] = await ethers.getSigners();

  console.log("Using deployer (registrar):", deployer.address);
  console.log("Using student address:", student.address);

  // Deploy the registry
  const DiplomaRegistry = await ethers.getContractFactory("DiplomaRegistry");
  const registry = await DiplomaRegistry.deploy();
  await registry.waitForDeployment();

  const registryAddress = await registry.getAddress();
  console.log("DiplomaRegistry deployed to:", registryAddress);

  // Example diploma data
  const studentWallet = student.address;
  const studentId = "FISK12345";
  const program = "BSc Computer Science";
  const degreeType = "Bachelor's";
  const graduationYear = 2026;
  const diplomaHash = ethers.id("FISK12345-2026-CS");

  console.log("\nIssuing diploma...");
  const tx = await registry.issueDiploma(
    studentWallet,
    studentId,
    program,
    degreeType,
    graduationYear,
    diplomaHash
  );
  await tx.wait();

  const diplomaId = 0n;
  console.log("Diploma issued with ID:", diplomaId.toString());

  const [
    storedWallet,
    storedStudentId,
    storedProgram,
    storedDegreeType,
    storedGraduationYear,
    storedRevoked,
    storedDiplomaHash
  ] = await registry.getDiploma(diplomaId);

  console.log("\nOn-chain diploma data:");
  console.log(" studentWallet   :", storedWallet);
  console.log(" studentId       :", storedStudentId);
  console.log(" program         :", storedProgram);
  console.log(" degreeType      :", storedDegreeType);
  console.log(" graduationYear  :", Number(storedGraduationYear));
  console.log(" revoked         :", storedRevoked);
  console.log(" diplomaHash     :", storedDiplomaHash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
