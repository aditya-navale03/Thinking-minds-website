import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { db } from "../../firebase/firebaseConfig";
import {
  // collection,
  // getDocs,
  // deleteDoc,
  doc,
  
} from "firebase/firestore";

import { useParams } from "react-router-dom";


import SuccessScreen from "../../components/ui/SuccessScreen";

interface Student {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  aadhar: string;
  course: string;
  dob: string;
  rollNo: string;
  photoURL: string;
  totalFee: number;
  feePaid: number;
  firstInstallment: number;
  remainingFee: number;
}


// import { useLocation } from "react-router-dom";
import { getDoc } from "firebase/firestore";


export default function RemoveStudent() {
  const [search, setSearch] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [results, setResults] = useState<Student[]>([]);


  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [showDeletedPopup, setShowDeletedPopup] = useState(false);



  const { dept } = useParams();
  const department = dept || "";


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
    const dept = department?.toLowerCase();

    if (!dept) {
      console.error("Department missing. Pass {state: { dept: 'it' }} when navigating.");
      setLoading(false);
      return;
    }

    const docSnap = await getDoc(doc(db, "students", dept));

    const students = docSnap.exists() ? docSnap.data().students || [] : [];

    const term = raw.toUpperCase();

    const matches = students.filter((s: any) => {
  const name = (s.fullName || "").toUpperCase();

  // direct match anywhere in name
  if (name.includes(term)) return true;

  // match first/last parts starting with search term
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.some((p) => p.startsWith(term))) return true;

  return false;
});

if (matches.length === 0) {
  setNotFound(true);
  setLoading(false);
  return;
}

setResults(matches);      // store all matched students
setStudent(matches[0]);   // show the first match
console.log("STUDENT DATA:", matches[0]);


  } catch (err) {
    console.error("Search error:", err);
  } finally {
    setLoading(false);
  }
};



//   const location = useLocation();
// const department = location.state?.dept || "";

  

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
      
{student && (


  

  <div className="max-w-2xl mx-auto bg-white shadow-xl p-6 rounded-2xl border">

    <h2 className="text-2xl font-semibold">{student.fullName}</h2>
    <p className="text-gray-600">{student.email}</p>

    <div className="grid grid-cols-2 gap-4 mt-4">

      <div className="p-4 bg-gray-100 rounded-xl">
        <strong>Roll No:</strong> {student.rollNo}
      </div>

      <div className="p-4 bg-gray-100 rounded-xl">
        <strong>Mobile:</strong> {student.mobile}
      </div>

      <div className="p-4 bg-gray-100 rounded-xl">
        <strong>Aadhar:</strong> {student.aadhar}
      </div>

      <div className="p-4 bg-gray-100 rounded-xl">
        <strong>DOB:</strong> {student.dob}
      </div>

      <div className="p-4 bg-gray-100 rounded-xl">
        <strong>Course:</strong> {student.course}
      </div>

      <div className="p-4 bg-gray-100 rounded-xl">
        <strong>Total Fee:</strong> {student.totalFee}
      </div>

      <div className="p-4 bg-gray-100 rounded-xl">
        <strong>Paid:</strong> {student.feePaid}
      </div>

      <div className="p-4 bg-gray-100 rounded-xl">
        <strong>1st Installment:</strong> {student.firstInstallment}
      </div>

      <div className="p-4 bg-red-100 rounded-xl text-red-700 font-bold">
        <strong>Remaining Fee:</strong> {student.remainingFee}
      </div>



    </div>

    <div className="flex gap-4 mt-6 justify-center">
<Link to={`/admin/update-student/${encodeURIComponent(student.rollNo)}`}>
  <Button className="bg-blue-600 text-white px-8">Update</Button>
</Link>




    </div>

  </div>
)}


    </div>
  );
}
