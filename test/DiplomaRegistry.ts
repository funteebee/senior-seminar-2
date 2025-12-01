import { expect } from "chai";
import hre from "hardhat";

describe("DiplomaRegistry", function () {
  it("should let the owner issue and read a diploma", async function () {
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

    // fake hash of some off-chain document identifier
    const diplomaHash = ethers.id("FISK12345-2026-CS");

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

    const [
      storedWallet,
      storedStudentId,
      storedProgram,
      storedDegreeType,
      storedGraduationYear,
      storedRevoked,
      storedDiplomaHash
    ] = await registry.getDiploma(diplomaId);

    expect(storedWallet).to.equal(studentWallet);
    expect(storedStudentId).to.equal(studentId);
    expect(storedProgram).to.equal(program);
    expect(storedDegreeType).to.equal(degreeType);
    expect(Number(storedGraduationYear)).to.equal(graduationYear);
    expect(storedRevoked).to.equal(false);
    expect(storedDiplomaHash).to.equal(diplomaHash);
  });

  it("should allow the owner to revoke a diploma", async function () {
    const { ethers } = await hre.network.connect();
    const [owner, student] = await ethers.getSigners();

    const DiplomaRegistry = await ethers.getContractFactory("DiplomaRegistry");
    const registry = await DiplomaRegistry.deploy();
    await registry.waitForDeployment();

    const diplomaHash = ethers.id("FISK67890-2026-CS");

    // issue a diploma
    const tx = await registry.issueDiploma(
      student.address,
      "FISK67890",
      "BSc Computer Science",
      "Bachelor's",
      2026,
      diplomaHash
    );
    await tx.wait();

    const diplomaId = 0n;

    // revoke it
    const revokeTx = await registry.revokeDiploma(diplomaId);
    await revokeTx.wait();

    // read it back
    const [, , , , , revoked, storedDiplomaHash] =
      await registry.getDiploma(diplomaId);

    expect(revoked).to.equal(true);
    expect(storedDiplomaHash).to.equal(diplomaHash);
  });
});
