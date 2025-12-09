import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { db } from "@/firebase/firebaseConfig";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";

import SuccessScreen from "@/components/ui/SuccessScreen";

interface Student {
  id: string;
  fullName: string;
  email: string;
  course: string;
  totalFee: number;
  feePaid: number;
}

export default function RemoveStudent() {
  const [search, setSearch] = useState("");
  const [student, setStudent] = useState<Student | null>(null);

  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showDeletedPopup, setShowDeletedPopup] = useState(false);

  // ---------------------------
  // VERIFY STUDENT (improved partial + case-insensitive search)
  // ---------------------------
  const verifyStudent = async () => {
    setStudent(null);
    setNotFound(false);
    setShowDeletedPopup(false);

    const raw = search.trim();
    if (!raw) return;

    setLoading(true);

    try {
      // fetch all students and filter client-side
      const snap = await getDocs(collection(db, "students"));

      const term = raw.toUpperCase();

      const all = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Student) }));

      const matches = all.filter((s) => {
        const name = (s.fullName || "").toUpperCase();
        const email = (s.email || "").toUpperCase();
        const course = (s.course || "").toUpperCase();

        // direct includes (anywhere in the string)
        if (name.includes(term) || email.includes(term) || course.includes(term))
          return true;

        // also match by individual name parts (first name, last name, initials)
        const parts = name.split(/\s+/).filter(Boolean);
        if (parts.some((p) => p.startsWith(term))) return true;

        return false;
      });

      if (matches.length === 0) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      // show first match (you can change to show list if you prefer)
      setStudent(matches[0]);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ---------------------------
  // DELETE STUDENT
  // ---------------------------
  const removeStudent = async () => {
    if (!student) return;

    try {
      await deleteDoc(doc(db, "students", student.id));
      setShowDeletedPopup(true);
      setStudent(null);
      setSearch("");
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Search Student</h1>

      {/* Search Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          verifyStudent();
        }}
        className="max-w-xl mx-auto flex gap-3 mb-7"
      >
        <input
          type="text"
          placeholder="Enter any part of name, email or course..."
          className="flex-1 p-3 border rounded-xl shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)} // keep user typing natural
        />

        <Button type="submit" className="bg-blue-600 text-white px-6">
          Verify
        </Button>
      </form>

      {/* Loading */}
      {loading && <p className="text-center text-gray-600">Searching...</p>}

      {/* Not Found Popup */}
      {notFound && (
        <SuccessScreen
          title="Not Found"
          message="No student found matching your search."
          buttonText="Close"
          onClose={() => setNotFound(false)}
        />
      )}

      {/* Student Card (Desktop Friendly) */}
      {student && (
        <div className="max-w-2xl mx-auto bg-white shadow-xl p-6 rounded-2xl border">
          <h2 className="text-2xl font-semibold">{student.fullName}</h2>
          <p className="text-gray-600">{student.email}</p>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="p-4 bg-gray-100 rounded-xl">
              <strong>Course:</strong> {student.course}
            </div>

            <div className="p-4 bg-gray-100 rounded-xl">
              <strong>Total Fee:</strong> {student.totalFee}
            </div>

            <div className="p-4 bg-gray-100 rounded-xl">
              <strong>Paid:</strong> {student.feePaid}
            </div>

            <div className="p-4 bg-red-100 rounded-xl text-red-700 font-bold">
              <strong>Due:</strong> {student.totalFee - student.feePaid}
            </div>
          </div>

          <div className="flex gap-4 mt-6 justify-center">
            <Link to={`/admin/update-student/${student.id}`}>
              <Button className="bg-blue-600 text-white px-8">Update</Button>
            </Link>

            <Button className="bg-red-600 text-white px-8" onClick={removeStudent}>
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Delete Success Popup */}
      {showDeletedPopup && (
        <SuccessScreen
          title="Student Removed"
          message="The student was successfully deleted."
          buttonText="Close"
          onClose={() => setShowDeletedPopup(false)}
        />
      )}
    </div>
  );
}
