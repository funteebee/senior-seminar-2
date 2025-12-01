# Senior Seminar 2 – Blockchain Diploma Registry

This project is a simple blockchain-based diploma registry for my senior seminar.  
It uses Solidity and Hardhat to model how a university could issue and manage digital diplomas on-chain.

## What the contract does

The main smart contract is `DiplomaRegistry.sol`.

- The account that deploys the contract acts as the **Registrar** (owner).
- The registrar can:
  - **Issue** a diploma for a student.
  - **Revoke** a diploma if it was issued in error or needs to be invalidated.
- Each diploma stores:
  - `studentWallet` – the student’s wallet address
  - `studentId` – an off-chain identifier (e.g. school ID or email)
  - `program` – e.g. `"BSc Computer Science"`
  - `degreeType` – e.g. `"Bachelor's"`, `"Master's"`
  - `graduationYear` – e.g. `2026`
  - `revoked` – `true` if the diploma has been revoked

Employers or other verifiers can call `getDiploma(diplomaId)` to check the on-chain record.

## Tests

The project uses Hardhat (v3) with Mocha for testing.

Current tests in `test/DiplomaRegistry.ts`:

- Deploy `DiplomaRegistry`
- Issue a diploma for a test student
- Read the diploma back and check all fields
- Revoke a diploma and confirm the `revoked` flag becomes `true`

To run the tests:

```bash
npx hardhat test
