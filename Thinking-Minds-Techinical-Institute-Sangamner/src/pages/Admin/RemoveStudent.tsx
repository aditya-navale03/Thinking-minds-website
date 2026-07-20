import { useState } from "react";
import { Button } from "../../components/ui/button";
import PopupModal from "../../components/ui/removeStudent";

import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";

// import { useNavigate } from "react-router-dom";

interface Student {
  id: string;
  fullName: string;
  email: string;
  rollNo: string;
  department: string;
}

export default function RemoveStudent() {
  const [search, setSearch] = useState("");
const [students, setStudents] = useState<Student[]>([]);
const [selected, setSelected] = useState<Student | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showNotFound, setShowNotFound] = useState(false);

  const department = localStorage.getItem("admin_department") || "";

  // temprorary
  console.log("Department:", department);

  const fetchStudents = async () => {
    if (!search.trim()) {
      setError("Enter name, email or roll number");
      return;
    }

    if (!department) {
      setError("Department missing.");
      return;
    }

    setLoading(true);
    setError("");
    setStudents([]);
    setSelected(null);

    try {

      console.log("Remove Page Department:", department);

      const q = query(
  collection(db, "studentProfiles"),
  where("department", "==", department.toUpperCase())
);

const snap = await getDocs(q);

const list: Student[] = snap.docs.map((studentDoc) => ({
  id: studentDoc.id,
  ...(studentDoc.data() as Omit<Student, "id">),
}));

const term = search.toLowerCase();

const results = list.filter(
  (s) =>
    s.fullName.toLowerCase().includes(term) ||
    s.email.toLowerCase().includes(term) ||
    s.rollNo.toLowerCase().includes(term)
);

      setStudents(results);

      if (results.length === 0) {
        setShowNotFound(true);
        setTimeout(() => setShowNotFound(false), 2000);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to search student.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
  if (!selected) return;

  try {
    // Delete all enrollments
    const enrollmentQuery = query(
      collection(db, "enrollments"),
      where("studentId", "==", selected.id)
    );

    const enrollmentSnap =
      await getDocs(enrollmentQuery);

    for (const enrollmentDoc of enrollmentSnap.docs) {
      await deleteDoc(
        doc(
          db,
          "enrollments",
          enrollmentDoc.id
        )
      );
    }

    // Delete student profile
    await deleteDoc(
      doc(
        db,
        "studentProfiles",
        selected.id
      )
    );

    // Update counter
    const counterRef = doc(
      db,
      "counters",
      `${department.toUpperCase()}_2026`
    );

    await updateDoc(counterRef, {
      lastReceiptNo: increment(-1),
    });

    // Update UI
    setStudents((prev) =>
      prev.filter(
        (student) =>
          student.id !== selected.id
      )
    );

    setSelected(null);
    setShowSuccess(true);

  } catch (err) {
    console.error(err);
    setError(
      "Failed to remove student"
    );
  }
};
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white">
              Remove Student
            </h1>

            <p className="text-slate-400 mt-2">
              Search and permanently remove student records.
            </p>
          </div>

          {error && (
            <p className="text-red-300 bg-red-900/30 border border-red-800 p-4 rounded-xl mb-4">{error}</p>
          )}

          {showSuccess && (
            <p className="text-green-300 bg-green-900/30 border border-green-800 p-4 rounded-xl mb-4">
              Student removed successfully.
            </p>
          )}

          {showNotFound && (
            <p className="text-yellow-300 bg-yellow-900/30 border border-yellow-800 p-4 rounded-xl mb-4">
              No student found.
            </p>
          )}

          <div className="
bg-slate-900
border
border-slate-800
rounded-2xl
p-6
shadow-2xl
mb-8
">
            <label className="block text-slate-300 font-medium mb-3">
              Search Student (Name / Email / Roll No)
            </label>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter name, email or roll no"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
flex-1
bg-slate-800
border
border-slate-700
rounded-xl
px-4
py-3
text-white
placeholder:text-slate-500
focus:outline-none
focus:ring-2
focus:ring-violet-500
focus:border-violet-500
transition
"
              />

              <Button
                onClick={fetchStudents}
                className="px-8 py-3 bg-blue-700 hover:bg-blue-800 text-white rounded-xl"
              >
                Search
              </Button>
            </div>
          </div>

          <div className="
bg-slate-900
border
border-slate-800
rounded-2xl
p-6
shadow-2xl
mb-6
">
            <h3 className="text-xl font-semibold text-white">Search Results</h3>

            {students.length === 0 ? (
              <p className="text-slate-400 mt-3">No student found.</p>
            ) : (
              <ul className="mt-3 space-y-2">
                {students.map((s) => (
                  <li
                    key={s.rollNo}
                    className={`p-3 rounded-lg border cursor-pointer transition ${selected?.rollNo === s.rollNo
                        ? "bg-red-900/30 border-red-600"
                        : "bg-slate-800 border-slate-700 hover:bg-slate-700"
                      }`}
                    onClick={() => setSelected(s)}
                  >
                    <p className="font-semibold text-white">{s.fullName}</p>
                    <p className="text-slate-300 text-sm mt-1">
                      Roll No: {s.rollNo} • {s.email}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button
            disabled={!selected}
            onClick={handleRemove}
            className={`w-full py-3 text-lg rounded-xl text-white shadow ${selected
                ? "bg-red-600 hover:bg-red-700"
                : "bg-slate-700 text-slate-500 cursor-not-allowed"
              }`}
          >
            Remove Selected Student
          </Button>
        </div>

        <PopupModal
          show={showSuccess}
          type="success"
          title="Student Removed!"
          message="The student has been successfully deleted."
          buttonText="OK"
          onClose={() => setShowSuccess(false)}
        />

        <PopupModal
          show={showNotFound}
          type="warning"
          title="Not Found"
          message="No student matched the search query."
          buttonText="Close"
          onClose={() => setShowNotFound(false)}
        />
      </div>
    </div>
  )};