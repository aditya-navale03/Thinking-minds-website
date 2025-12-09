import { useState } from "react";

interface StudentModel {
  name: string;
  dob: string;
  email: string;
  department: string;
  courses: string[];
  photoURL: string;
}

const StudentVerification = () => {
  const [rollNo, setRollNo] = useState("");
  const [student, setStudent] = useState<StudentModel | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // TEMP DUMMY DATA (Firebase integration will replace this later)
  const dummyStudents: Record<string, StudentModel> = {
    "101": {
      name: "Rahul Patil",
      dob: "2002-08-15",
      email: "rahul@example.com",
      department: "Civil Engineering",
      courses: ["AutoCAD", "Surveying", "Construction Planning"],
      photoURL: "/src/assets/download.jpeg",
    },
    "102": {
      name: "Sneha Deshmukh",
      dob: "2003-02-10",
      email: "sneha@example.com",
      department: "IT",
      courses: ["Java Full Stack", "DBMS"],
      photoURL: "https://via.placeholder.com/150",
    },
  };

  const verifyStudent = () => {
    if (!rollNo.trim()) {
      setError("❌ Please enter a Roll Number.");
      setStudent(null);
      return;
    }

    setLoading(true);
    setError("");
    setStudent(null);

    setTimeout(() => {
      if (dummyStudents[rollNo]) {
        setStudent(dummyStudents[rollNo]);
      } else {
        setError("❌ No student found with this Roll Number.");
      }
      setLoading(false);
    }, 700);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f7] p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Student Verification</h1>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6">
        <input
          type="text"
          placeholder="Enter Roll Number"
          value={rollNo}
          onChange={(e) => setRollNo(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
        />

        <button
          onClick={verifyStudent}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg transition"
        >
          {loading ? "Verifying..." : "Verify Student"}
        </button>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>

      {student && (
        <div className="w-full max-w-md mt-6 bg-white rounded-2xl shadow-lg p-6">
          <div className="flex flex-col items-center">
            <img
              src={student.photoURL}
              alt={student.name}
              className="w-32 h-32 object-cover rounded-full mb-4 border border-gray-200"
            />
            <h2 className="text-xl font-semibold text-gray-900">{student.name}</h2>
            <p className="text-gray-600 mt-1"><strong>Roll No:</strong> {rollNo}</p>
            <p className="text-gray-600"><strong>Email:</strong> {student.email}</p>
            <p className="text-gray-600"><strong>DOB:</strong> {student.dob}</p>
            <p className="text-gray-600"><strong>Department:</strong> {student.department}</p>

            <div className="mt-4 w-full">
              <p className="font-semibold text-gray-700 mb-2">Courses Enrolled:</p>
              <div className="flex flex-wrap gap-2">
                {student.courses.map((c, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentVerification;
