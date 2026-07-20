import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import SuccessScreen from "../../components/ui/SuccessScreen";
   import { query, where } from "firebase/firestore";

import BackButton from "../../components/ui/backbutton";

interface Student {
  id: string;
  fullName: string;
  dob: string;
  email: string;
  mobile: string;
  aadhar: string;
  rollNo: string;
  department: string;
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


const q = query(
  collection(db, "studentProfiles"),
  where("department", "==", department.toUpperCase())
);

const snap = await getDocs(q);

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
type BoxProps = {
  label: string;
  value: string | number;
  highlight?: boolean;
};

const Box = ({ label, value, highlight }: BoxProps) => (
  <div
    className={`
      p-5
      rounded-xl
      border
      ${
        highlight
          ? "bg-red-900/20 border-red-700"
          : "bg-slate-800 border-slate-700"
      }
    `}
  >
    <p className="text-sm text-slate-400">
      {label}
    </p>

    <p className="font-semibold text-white mt-2 break-words">
      {value}
    </p>
  </div>
);
  return (
    <div className="min-h-screen bg-slate-950">
  <div className="max-w-7xl mx-auto px-6 py-8">
<div className="mb-8 flex justify-between items-start">

  <div>
    <h1 className="text-4xl font-bold text-white">
      View Students
    </h1>

    <p className="text-slate-400 mt-2">
      Search and manage student records.
    </p>
  </div>

  <BackButton />

</div>
      {/* SEARCH BOX */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          verifyStudent();
        }}
className="
max-w-7xl
mx-auto
flex
gap-4
mb-8
bg-slate-900
border
border-slate-800
rounded-2xl
p-6
shadow-2xl
"      >
        <input
          type="text"
          placeholder="Search student name..."
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
"          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

<Button className="bg-blue-700 text-white px-8 py-3">          Search
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
className="
bg-slate-900
border
border-slate-800
rounded-2xl
p-8
shadow-2xl
"            >

              {/* HEADER */}
              <div className="flex justify-between items-center mb-6">

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {student.fullName}
                  </h2>
                  <p className="text-slate-400">
                    {student.rollNo}
                  </p>
                </div>

               <Link
  to={`/admin/update-student/${department}/${student.id}`}
>
  <Button className="bg-blue-600 text-white">
    Update
  </Button>
</Link>
          
              </div>

              {/* GRID */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">


                <Box label="Full Name" value={student.fullName} />
                <Box label="DOB" value={student.dob} />
                <Box label="Email" value={student.email} />

                <Box label="Mobile" value={student.mobile} />
                <Box label="Aadhaar" value={student.aadhar} />

               




              </div>

            </div>
          ))}

        </div>
      )}
      </div>
    </div>
  );
}