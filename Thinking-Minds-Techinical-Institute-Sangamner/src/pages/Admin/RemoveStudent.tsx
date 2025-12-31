import { useState } from "react";
import { Button } from "../../components/ui/button";
import PopupModal from "../../components/ui/removeStudent";

import { db } from "../../firebase/firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";

export default function RemoveStudent() {
  const [search, setSearch] = useState("");
  const [students, setStudents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [showNotFound, setShowNotFound] = useState(false);

  const department = localStorage.getItem("admin_department") || "";

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
      const dep = department.toLowerCase();
      const ref = doc(db, "students", dep);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setError(`Department '${dep}' not found.`);
        setLoading(false);
        return;
      }

      const list = snap.data().students || [];
      const term = search.toLowerCase();

      const results = list.filter(
        (s) =>
          s.fullName?.toLowerCase().includes(term) ||
          s.email?.toLowerCase().includes(term) ||
          s.rollNo?.toLowerCase().includes(term)
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

  // DELETE STUDENT FROM ARRAY
  const handleRemove = async () => {
    if (!selected) return;

    try {
      const dep = department.toLowerCase();
      const ref = doc(db, "students", dep);
      const snap = await getDoc(ref);

      const list = snap.data().students;

      const updated = list.filter((s) => s.rollNo !== selected.rollNo);

      await updateDoc(ref, { students: updated });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);

      setSelected(null);
      setStudents(updated);
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

        {error && (
          <p className="text-red-600 bg-red-100 p-3 rounded mb-4">{error}</p>
        )}

        {showSuccess && (
          <p className="text-green-700 bg-green-100 p-3 rounded mb-4">
            Student removed successfully.
          </p>
        )}

        {showNotFound && (
          <p className="text-yellow-700 bg-yellow-100 p-3 rounded mb-4">
            No student found.
          </p>
        )}

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
              className="flex-1 px-4 py-3 rounded-xl border bg-white"
            />

            <Button
              onClick={fetchStudents}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl"
            >
              Search
            </Button>
          </div>
        </div>

        <div className="bg-white border rounded-xl p-5 mb-4">
          <h3 className="text-lg font-medium">Search Results</h3>

          {students.length === 0 ? (
            <p className="text-gray-600 mt-3">No student found.</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {students.map((s) => (
                <li
                  key={s.rollNo}
                  className={`p-3 rounded-lg border cursor-pointer transition ${
                    selected?.rollNo === s.rollNo
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
