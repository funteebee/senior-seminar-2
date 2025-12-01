// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @title DiplomaRegistry - basic on-chain registry of student diplomas
/// @notice The account that deploys this contract acts as the Registrar.
contract DiplomaRegistry {
    address public owner;

    struct Diploma {
        address studentWallet;   // student wallet address
        string studentId;        // e.g. school ID or email
        string program;          // e.g. "BSc Computer Science"
        string degreeType;       // e.g. "Bachelor's", "Master's"
        uint16 graduationYear;
        bool revoked;
    }

    // simple auto-increment ID, 0, 1, 2, ...
    uint256 public nextDiplomaId;
    mapping(uint256 => Diploma) private diplomas;

    event DiplomaIssued(
        uint256 indexed diplomaId,
        address indexed studentWallet,
        string studentId,
        string program,
        string degreeType,
        uint16 graduationYear
    );

    event DiplomaRevoked(uint256 indexed diplomaId);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can do this");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /// @notice Issue a new diploma
    function issueDiploma(
        address studentWallet,
        string calldata studentId,
        string calldata program,
        string calldata degreeType,
        uint16 graduationYear
    ) external onlyOwner returns (uint256 diplomaId) {
        diplomaId = nextDiplomaId;

        diplomas[diplomaId] = Diploma({
            studentWallet: studentWallet,
            studentId: studentId,
            program: program,
            degreeType: degreeType,
            graduationYear: graduationYear,
            revoked: false
        });

        nextDiplomaId += 1;

        emit DiplomaIssued(
            diplomaId,
            studentWallet,
            studentId,
            program,
            degreeType,
            graduationYear
        );
    }

    /// @notice Revoke a diploma that was already issued
    function revokeDiploma(uint256 diplomaId) external onlyOwner {
        require(diplomaId < nextDiplomaId, "Invalid diplomaId");
        require(!diplomas[diplomaId].revoked, "Already revoked");

        diplomas[diplomaId].revoked = true;
        emit DiplomaRevoked(diplomaId);
    }

    /// @notice View diploma info (for employers / verifiers)
    function getDiploma(uint256 diplomaId)
        external
        view
        returns (
            address studentWallet,
            string memory studentId,
            string memory program,
            string memory degreeType,
            uint16 graduationYear,
            bool revoked
        )
    {
        require(diplomaId < nextDiplomaId, "Invalid diplomaId");

        Diploma memory d = diplomas[diplomaId];
        return (
            d.studentWallet,
            d.studentId,
            d.program,
            d.degreeType,
            d.graduationYear,
            d.revoked
        );
    }
}
