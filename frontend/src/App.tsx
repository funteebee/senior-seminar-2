import { useEffect, useState } from "react";
import { BrowserProvider, Contract, id, type Signer } from "ethers";

import {
  DIPLOMA_REGISTRY_ADDRESS,
  DIPLOMA_REGISTRY_ABI,
} from "./contractConfig";

declare global {
  interface Window {
    ethereum?: any;
  }
}

type DiplomaData = {
  studentWallet: string;
  studentId: string;
  program: string;
  degreeType: string;
  graduationYear: number;
  revoked: boolean;
  diplomaHash: string;
};

function App() {
  const [signer, setSigner] = useState<Signer | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);

  // Issue form state
  const [issueStudentWallet, setIssueStudentWallet] = useState("");
  const [issueStudentId, setIssueStudentId] = useState("");
  const [issueProgram, setIssueProgram] = useState("");
  const [issueDegreeType, setIssueDegreeType] = useState("");
  const [issueGraduationYear, setIssueGraduationYear] = useState("2026");
  const [issueDiplomaHashInput, setIssueDiplomaHashInput] = useState("");
  const [issueStatus, setIssueStatus] = useState("");

  // Verify state
  const [verifyId, setVerifyId] = useState("");
  const [verifyResult, setVerifyResult] = useState<DiplomaData | null>(null);
  const [verifyError, setVerifyError] = useState("");

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask.");
      return;
    }

    try {
      const _provider = new BrowserProvider(window.ethereum);
      await _provider.send("eth_requestAccounts", []);
      const _signer = await _provider.getSigner();
      const addr = await _signer.getAddress();

      const _contract = new Contract(
        DIPLOMA_REGISTRY_ADDRESS,
        DIPLOMA_REGISTRY_ABI,
        _signer
      );

      setSigner(_signer);
      setAccount(addr);
      setContract(_contract);

    } catch (err) {
      console.error(err);
      alert("Failed to connect wallet.");
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      (async () => {
        try {
          const _provider = new BrowserProvider(window.ethereum);
          const accounts = await _provider.listAccounts();
          if (accounts.length > 0) {
            const _signer = await _provider.getSigner();
            const addr = await _signer.getAddress();
            const _contract = new Contract(
              DIPLOMA_REGISTRY_ADDRESS,
              DIPLOMA_REGISTRY_ABI,
              _signer
            );
            setSigner(_signer);
            setAccount(addr);
            setContract(_contract);
        }

        } catch {
          // ignore eager connect errors
        }
      })();
    }
  }, []);

  const handleIssueDiploma = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !signer) {
      setIssueStatus("Please connect your wallet first.");
      return;
    }

    try {
      setIssueStatus("Issuing diploma...");

      const yearNum = Number(issueGraduationYear);
      if (
        !issueStudentWallet ||
        !issueStudentId ||
        !issueProgram ||
        !issueDegreeType ||
        !yearNum
      ) {
        setIssueStatus("Please fill all fields.");
        return;
      }

      const hashInput =
        issueDiplomaHashInput.trim() ||
        `${issueStudentId}-${issueGraduationYear}-${issueProgram}`;
      const diplomaHash = id(hashInput);

      const tx = await contract.issueDiploma(
        issueStudentWallet,
        issueStudentId,
        issueProgram,
        issueDegreeType,
        yearNum,
        diplomaHash
      );
      const receipt = await tx.wait();

      setIssueStatus("Diploma issued. Tx hash: " + receipt?.hash);
    } catch (err: any) {
      console.error(err);
      setIssueStatus("Error issuing diploma: " + (err?.message ?? "Unknown error"));
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setVerifyError("");
    setVerifyResult(null);

    if (!contract) {
      setVerifyError("Please connect your wallet first.");
      return;
    }

    try {
      const idNum = Number(verifyId);
      if (Number.isNaN(idNum)) {
        setVerifyError("Invalid diploma ID.");
        return;
      }

      const result = await contract.getDiploma(idNum);
      const data: DiplomaData = {
        studentWallet: result[0],
        studentId: result[1],
        program: result[2],
        degreeType: result[3],
        graduationYear: Number(result[4]),
        revoked: result[5],
        diplomaHash: result[6],
      };
      setVerifyResult(data);
    } catch (err: any) {
      console.error(err);
      setVerifyError("Error reading diploma: " + (err?.message ?? "Unknown error"));
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "2rem", fontFamily: "system-ui" }}>
      <h1>Diploma Registry UI (Local Hardhat)</h1>

      <section style={{ marginBottom: "2rem" }}>
        <button onClick={connectWallet}>
          {account
            ? `Connected: ${account.slice(0, 6)}...${account.slice(-4)}`
            : "Connect Wallet"}
        </button>
      </section>

      <section style={{ border: "1px solid #ccc", borderRadius: 8, padding: "1rem", marginBottom: "2rem" }}>
        <h2>Issue Diploma (Registrar)</h2>
        <form
          onSubmit={handleIssueDiploma}
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <label>
            Student Wallet
            <input
              type="text"
              value={issueStudentWallet}
              onChange={(e) => setIssueStudentWallet(e.target.value)}
              placeholder="0x..."
            />
          </label>
          <label>
            Student ID
            <input
              type="text"
              value={issueStudentId}
              onChange={(e) => setIssueStudentId(e.target.value)}
              placeholder="FISK12345"
            />
          </label>
          <label>
            Program
            <input
              type="text"
              value={issueProgram}
              onChange={(e) => setIssueProgram(e.target.value)}
              placeholder="BSc Computer Science"
            />
          </label>
          <label>
            Degree Type
            <input
              type="text"
              value={issueDegreeType}
              onChange={(e) => setIssueDegreeType(e.target.value)}
              placeholder="Bachelor's"
            />
          </label>
          <label>
            Graduation Year
            <input
              type="number"
              value={issueGraduationYear}
              onChange={(e) => setIssueGraduationYear(e.target.value)}
            />
          </label>
          <label>
            Diploma Hash Input (optional)
            <input
              type="text"
              value={issueDiplomaHashInput}
              onChange={(e) => setIssueDiplomaHashInput(e.target.value)}
              placeholder="If empty, we derive from ID/year/program"
            />
          </label>
          <button type="submit">Issue Diploma</button>
        </form>
        {issueStatus && <p style={{ marginTop: "0.5rem" }}>{issueStatus}</p>}
      </section>

      <section style={{ border: "1px solid #ccc", borderRadius: 8, padding: "1rem" }}>
        <h2>Verify Diploma by ID</h2>
        <form
          onSubmit={handleVerify}
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <label>
            Diploma ID
            <input
              type="number"
              value={verifyId}
              onChange={(e) => setVerifyId(e.target.value)}
              placeholder="0"
            />
          </label>
          <button type="submit">Verify</button>
        </form>

        {verifyError && (
          <p style={{ color: "red", marginTop: "0.5rem" }}>{verifyError}</p>
        )}

        {verifyResult && (
          <div style={{ marginTop: "1rem" }}>
            <h3>Diploma Info</h3>
            <p><strong>Student Wallet:</strong> {verifyResult.studentWallet}</p>
            <p><strong>Student ID:</strong> {verifyResult.studentId}</p>
            <p><strong>Program:</strong> {verifyResult.program}</p>
            <p><strong>Degree Type:</strong> {verifyResult.degreeType}</p>
            <p><strong>Graduation Year:</strong> {verifyResult.graduationYear}</p>
            <p><strong>Revoked:</strong> {verifyResult.revoked ? "Yes" : "No"}</p>
            <p><strong>Diploma Hash:</strong> {verifyResult.diplomaHash}</p>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
