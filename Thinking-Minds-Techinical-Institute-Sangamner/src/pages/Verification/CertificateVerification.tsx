import { useState } from "react";

interface CertificateModel {
  certificateID: string;
  studentName: string;
  course: string;
  department: string;
  batch: string;
  issueDate: string;
}

const CertificateVerification = () => {
  const [certID, setCertID] = useState("");
  const [certificate, setCertificate] = useState<CertificateModel | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // TEMP DUMMY DATA (Replace with Firebase later)
  const dummyCertificates: Record<string, CertificateModel> = {
    "CERT-2025-001": {
      certificateID: "CERT-2025-001",
      studentName: "Rahul Patil",
      course: "Civil Engineering",
      department: "Civil",
      batch: "Batch A",
      issueDate: "2025-12-05",
    },
    "CERT-2025-002": {
      certificateID: "CERT-2025-002",
      studentName: "Sneha Deshmukh",
      course: "Java Full Stack",
      department: "IT",
      batch: "Batch B",
      issueDate: "2025-12-05",
    },
  };

  const verifyCertificate = () => {
    setLoading(true);
    setError("");
    setCertificate(null);

    setTimeout(() => {
      if (dummyCertificates[certID]) {
        setCertificate(dummyCertificates[certID]);
      } else {
        setError("❌ Invalid Certificate ID.");
      }
      setLoading(false);
    }, 700); // simulate network delay
  };

  return (
    <div className="min-h-screen p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">Certificate Verification</h1>

      <input
        type="text"
        placeholder="Enter Certificate ID"
        value={certID}
        onChange={(e) => setCertID(e.target.value)}
        className="w-full p-3 border rounded mb-4"
      />

      <button
        onClick={verifyCertificate}
        className="w-full bg-blue-600 text-white p-3 rounded-lg"
      >
        {loading ? "Verifying..." : "Verify Certificate"}
      </button>

      {error && <p className="text-red-500 mt-4 text-center">{error}</p>}

      {certificate && (
        <div className="mt-6 p-4 border rounded-lg shadow bg-[#fafafa]">
          <h2 className="text-xl font-semibold text-center mb-2">{certificate.studentName}</h2>
          <p><strong>Certificate ID:</strong> {certificate.certificateID}</p>
          <p><strong>Course:</strong> {certificate.course}</p>
          <p><strong>Department:</strong> {certificate.department}</p>
          <p><strong>Batch:</strong> {certificate.batch}</p>
          <p><strong>Issued On:</strong> {certificate.issueDate}</p>
        </div>
      )}
    </div>
  );
};

export default CertificateVerification;
