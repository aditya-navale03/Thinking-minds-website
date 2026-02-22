import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import SuccessScreen from "../../components/ui/SuccessScreen";

import BackButton from "../../components/ui/backbutton";

interface Student {
  id: string;
  fullName: string;
  dob: string;
  email: string;
  course: string;
  mobile: string;
  aadhar: string;
  totalFee: number;
  firstInstallment: number;
  remainingFee: number;
  paymentMode: string;
  rollNo: string;
}

export default function RemoveStudent() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const { dept } = useParams();
  const department = dept || "";

  // SEARCH
  const verifyStudent = async () => {
    const raw = search.trim();
    if (!raw) return;

    setLoading(true);
    setNotFound(false);

    const snap = await getDocs(
      collection(db, "students", department, "students")
    );

    const students: Student[] = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as Omit<Student, "id">),
    }));

    const term = raw.toUpperCase();

    const matches = students.filter((s) =>
      s.fullName?.toUpperCase().includes(term)
    );

    if (matches.length === 0) setNotFound(true);
    else setResults(matches);

    setLoading(false);
  };

  // INFO BOX
  const Box = ({ label, value, highlight }: any) => (
    <div
      className={`p-4 rounded-xl border ${highlight
        ? "bg-red-50 border-red-200"
        : "bg-gray-50 border-gray-200"
        }`}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className="font-semibold text-gray-800 mt-1">{value}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">

      {/* SEARCH HEADER WITH BACK BUTTON */}
      <div className="max-w-5xl mx-auto mb-8 bg-white shadow rounded-2xl p-6">

        <div className="flex items-center justify-between">

          {/* Back Button Left */}
          <BackButton />

          {/* Title Center */}
          <div className="flex-1 text-center">
            <h1 className="text-3xl font-bold text-gray-800">
              Student Search Panel
            </h1>
            <p className="text-gray-500 text-sm">
              Search student records & fee details
            </p>
          </div>

          {/* Spacer Right (balances layout) */}
          <div className="w-10"></div>

        </div>

      </div>
      {/* SEARCH BOX */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          verifyStudent();
        }}
        className="max-w-2xl mx-auto flex gap-3 mb-10 bg-white p-3 rounded-2xl shadow"
      >
        <input
          type="text"
          placeholder="Search student name..."
          className="flex-1 p-3 border rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Button className="bg-blue-600 text-white px-6">
          Search
        </Button>
      </form>

      {loading && <p className="text-center">Searching...</p>}

      {notFound && (
        <SuccessScreen
          title="Not Found"
          message="No student found"
          buttonText="Close"
          onClose={() => setNotFound(false)}
        />
      )}

      {/* RESULTS */}
      {results.length > 0 && (
        <div className="max-w-5xl mx-auto space-y-8">

          {results.map((student) => (
            <div
              key={student.id}
              className="bg-white shadow-xl rounded-3xl p-8 border"
            >

              {/* HEADER */}
              <div className="flex justify-between items-center mb-6">

                <div>
                  <h2 className="text-2xl font-bold">
                    {student.fullName}
                  </h2>
                  <p className="text-gray-500">
                    {student.rollNo}
                  </p>
                </div>

                {student.remainingFee > 0 ? (
                  <Link
                    to={`/admin/update-student/${department}/${student.id}`}                  >
                    <Button className="bg-blue-600 text-white">
                      Update
                    </Button>
                  </Link>
                ) : (
                  <span className="px-5 py-2 bg-green-100 text-green-700 rounded-full">
                    Paid
                  </span>
                )}

              </div>

              {/* GRID */}
              <div className="grid md:grid-cols-3 gap-4">


                <Box label="Full Name" value={student.fullName} />
                <Box label="DOB" value={student.dob} />
                <Box label="Email" value={student.email} />

                <Box label="Course" value={student.course} />
                <Box label="Mobile" value={student.mobile} />
                <Box label="Aadhaar" value={student.aadhar} />

                <Box
                  label="Total Fee"
                  value={`₹ ${student.totalFee?.toLocaleString("en-IN")}`}
                />

                <Box
                  label="First Installment"
                  value={`₹ ${student.firstInstallment?.toLocaleString("en-IN")}`}
                />


                <Box
                  label="Remaining Fee"
                  value={`₹ ${(
                    student.totalFee - student.firstInstallment
                  ).toLocaleString("en-IN")}`}
                  highlight={
                    student.totalFee - student.firstInstallment > 0
                  }
                />

                <Box label="Payment Mode" value={student.paymentMode} />
                <Box label="Roll No" value={student.rollNo} />

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
}