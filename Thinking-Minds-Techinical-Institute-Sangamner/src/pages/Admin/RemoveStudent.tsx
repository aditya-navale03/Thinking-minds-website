import { useState } from "react";
import { Button } from "@/components/ui/button";
import PopupModal from "@/components/ui/removeStudent";

import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

interface Student {
  id: number;
  rollNo: string;
  fullName: string;
  dob: string;
  email: string;
  course: string;
  department: string;
  aadhar: string;
  mobile: string;
  totalFee: number;
  firstInstallment: number;
  remainingFee: number;
  feePaid: number;
  photoURL: string;
  dbId: string;
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

  // -------------------------------------------
  // SEARCH STUDENTS (Button Only)
  // -------------------------------------------
  const fetchStudents = async (skipNotFoundPopup = false) => {
    if (!search.trim()) {
      setError("Enter name, email or roll number");
      return;
    }

    setLoading(true);
    setError("");
    setStudents([]);
    setSelected(null);

    try {
      const q = query(
        collection(db, "students"),
        where("department", "==", department.toLowerCase())
      );

      const snapshot = await getDocs(q);

      const list = snapshot.docs.map((d) => ({
        ...(d.data() as Student),
        dbId: d.id,
      }));

      const term = search.toLowerCase();

      const results = list.filter(
        (s) =>
          s.fullName.toLowerCase().includes(term) ||
          s.email.toLowerCase().includes(term) ||
          s.rollNo.toLowerCase().includes(term)
      );

      setStudents(results);

      if (results.length === 0 && !skipNotFoundPopup) {
        setShowNotFound(true);
        setTimeout(() => setShowNotFound(false), 2000);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to search student");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------
  // REMOVE STUDENT
  // -------------------------------------------
  const handleRemove = async () => {
    if (!selected) return;

    try {
      await deleteDoc(doc(db, "students", selected.dbId));

      // Show success popup
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      // Refresh list WITHOUT showing not-found popup
      await fetchStudents(true);

      setSelected(null);
    } catch (err) {
      console.error(err);
      setError("Failed to remove student");
    }
  };

  return (
    <div className="min-h-screen bg-[#ececec] px-6 py-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold mb-6 text-gray-900">
          Remove Student
        </h1>

        {/* ERROR MESSAGE */}
        {error && (
          <p className="text-red-600 bg-red-100 p-3 rounded mb-4">{error}</p>
        )}

        {/* SUCCESS POPUP (inline message kept for backwards compatibility) */}
        {showSuccess && (
          <p className="text-green-700 bg-green-100 p-3 rounded mb-4">
            Student removed successfully.
          </p>
        )}

        {/* NOT FOUND POPUP (inline message kept for backwards compatibility) */}
        {showNotFound && (
          <p className="text-yellow-700 bg-yellow-100 p-3 rounded mb-4">
            No student found matching your search.
          </p>
        )}

        {/* SEARCH BOX */}
        <div className="mb-6">
          <label className="block text-gray-800 font-medium mb-1">
            Search Student (Name / Email / Roll No)
          </label>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter name, email or roll no"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl border bg-white 
                     focus:outline-none focus:ring-2 focus:ring-gray-500"
            />

            <Button
              onClick={() => fetchStudents(false)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl"
            >
              Search
            </Button>
          </div>
        </div>

        {/* RESULTS */}
        <div className="bg-white border rounded-xl p-5 mb-4">
          <h3 className="text-lg font-medium">Search Results</h3>

          {students.length === 0 ? (
            <p className="text-gray-600 mt-3">No student found.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {students.map((s) => (
                <li
                  key={s.dbId}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    selected?.dbId === s.dbId
                      ? "bg-red-100 border-red-500"
                      : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                  }`}
                  onClick={() => setSelected(s)}
                >
                  <p className="font-semibold text-gray-900">{s.fullName}</p>
                  <p className="text-gray-700 text-sm">
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
          className={`w-full py-3 text-lg rounded-xl text-white shadow ${
            selected
              ? "bg-red-600 hover:bg-red-700"
              : "bg-red-400 cursor-not-allowed"
          }`}
        >
          Remove Selected Student
        </Button>
      </div>

      {/* POPUPS */}

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
  );
}
