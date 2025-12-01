// src/contractConfig.ts

// TEMP: we'll put the real address here after we deploy to localhost
export const DIPLOMA_REGISTRY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";


// Minimal ABI for the functions we use
export const DIPLOMA_REGISTRY_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "nextDiplomaId",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "studentWallet", "type": "address" },
      { "internalType": "string", "name": "studentId", "type": "string" },
      { "internalType": "string", "name": "program", "type": "string" },
      { "internalType": "string", "name": "degreeType", "type": "string" },
      { "internalType": "uint16", "name": "graduationYear", "type": "uint16" },
      { "internalType": "bytes32", "name": "diplomaHash", "type": "bytes32" }
    ],
    "name": "issueDiploma",
    "outputs": [
      { "internalType": "uint256", "name": "diplomaId", "type": "uint256" }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "diplomaId", "type": "uint256" }
    ],
    "name": "revokeDiploma",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "diplomaId", "type": "uint256" }
    ],
    "name": "getDiploma",
    "outputs": [
      { "internalType": "address", "name": "studentWallet", "type": "address" },
      { "internalType": "string", "name": "studentId", "type": "string" },
      { "internalType": "string", "name": "program", "type": "string" },
      { "internalType": "string", "name": "degreeType", "type": "string" },
      { "internalType": "uint16", "name": "graduationYear", "type": "uint16" },
      { "internalType": "bool", "name": "revoked", "type": "bool" },
      { "internalType": "bytes32", "name": "diplomaHash", "type": "bytes32" }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];
