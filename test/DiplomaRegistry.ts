import { expect } from "chai";
import hre from "hardhat";

describe("DiplomaRegistry", function () {
  it("should let the owner issue and read a diploma", async function () {
    // Connect to Hardhat's local simulated network for this test
    const { ethers } = await hre.network.connect();

    const [owner, student] = await ethers.getSigners();

    const DiplomaRegistry = await ethers.getContractFactory("DiplomaRegistry");
    const registry = await DiplomaRegistry.deploy();
    await registry.waitForDeployment();

    const studentWallet = student.address;
    const studentId = "FISK12345";
    const program = "BSc Computer Science";
    const degreeType = "Bachelor's";
    const graduationYear = 2026;

    const tx = await registry.issueDiploma(
      studentWallet,
      studentId,
      program,
      degreeType,
      graduationYear
    );
    await tx.wait();

    const diplomaId = 0n; // first one is ID 0

    const [
      storedWallet,
      storedStudentId,
      storedProgram,
      storedDegreeType,
      storedGraduationYear,
      storedRevoked
    ] = await registry.getDiploma(diplomaId);

    expect(storedWallet).to.equal(studentWallet);
    expect(storedStudentId).to.equal(studentId);
    expect(storedProgram).to.equal(program);
    expect(storedDegreeType).to.equal(degreeType);
    expect(Number(storedGraduationYear)).to.equal(graduationYear);
    expect(storedRevoked).to.equal(false);
  });
});
