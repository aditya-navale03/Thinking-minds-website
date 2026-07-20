import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Button } from "../../components/ui/button";


import { courses } from "../../data/courses";

import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
} from "firebase/firestore";


export default function UpdateStudent() {
  const { dept, id } = useParams();
  const docId = id || "";
      const [receiptNo, setReceiptNo] = useState("");
      const [rollNo, setRollNo] = useState("");

  const courseOptions = courses
  .filter(
    (c) =>
      c.category.toLowerCase() ===
      dept?.toLowerCase()
  )
  .map((c) => c.name.toUpperCase());

  const navigate = useNavigate();
  const [showAddCourseModal, setShowAddCourseModal] =
  useState(false);

const [newCourse, setNewCourse] = useState("");
const [courseExists, setCourseExists] = useState(false);
const [newTotalFee, setNewTotalFee] = useState("");
const [newFirstInstallment, setNewFirstInstallment] =
  useState("");
const [newRemainingFee, setNewRemainingFee] =
  useState("");
const [newPaymentMode, setNewPaymentMode] =
  useState("Cash");

  // Editable fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [dob, setDob] = useState("");
  const [photoURL, setPhotoURL] = useState("");



  // -------- LOAD FROM FIREBASE --------
  const formatDateForInput = (dob: string) => {
  if (!dob) return "";

  const parts = dob.split("-");

  // already YYYY-MM-DD
  if (parts[0].length === 4) {
    return dob;
  }

  const [day, month, year] = parts;
  return `${year}-${month}-${day}`;
};

const formatDateForFirestore = (dob: string) => {
  if (!dob) return "";

  const parts = dob.split("-");

  // already DD-MM-YYYY
  if (parts[0].length === 2) {
    return dob;
  }

  const [year, month, day] = parts;
  return `${day}-${month}-${year}`;
};


  const [enrollments, setEnrollments] = useState<any[]>([]);
  useEffect(() => {
    const loadStudent = async () => {
      const studentRef = doc(
        db,
        "studentProfiles",
        docId
      );

      const studentSnap =
        await getDoc(studentRef);

      if (!studentSnap.exists()) {
        alert("Student not found");
        navigate(-1);
        return;
      }

      const s = studentSnap.data() as any;
      const q = query(
        collection(db, "enrollments"),
        where("studentId", "==", docId)
      );



      const enrollmentSnapshot =
        await getDocs(q);

      const enrollmentList =
        enrollmentSnapshot.docs.map(
          (doc) => ({
            id: doc.id,
            ...doc.data(),
          })
        );

      setEnrollments(enrollmentList);

      setFullName(s.fullName);
      setEmail(s.email);
      setMobile(s.mobile);
      setAadhar(s.aadhar);
      setDob(formatDateForInput(s.dob));
      setPhotoURL(s.photoURL || "");
      setReceiptNo(s.receiptNo || "");
      setRollNo(s.rollNo || "");
    };

    loadStudent();

  }, [docId]);



  const savePersonalInfo = async () => {
    if (!docId) return;

    await updateDoc(
      doc(db, "studentProfiles", docId),
      {
        fullName,
        email,
        mobile,
        aadhar,
        dob: formatDateForFirestore(dob),
      }
    );

    alert("Personal information updated successfully.");
  };
 
  if (!fullName) {
    return (
      <p className="text-center mt-10">
        Loading...
      </p>
    );
  }

  const updateNewRemainingFee = (
  total: string,
  first: string
) => {
  const totalValue = Number(total || 0);
  const firstValue = Number(first || 0);

  const remaining =
    Math.max(0, totalValue - firstValue);

  setNewRemainingFee(String(remaining));
};

const addNewCourse = async () => {


  const existingCourse = enrollments.find(
    (e) =>
      e.courseName.toUpperCase() ===
      newCourse.toUpperCase()
  );

  if (existingCourse) {
    alert(
      `Student is already enrolled in ${newCourse}.`
    );
    return;
  }
console.log("Student Receipt:", receiptNo);
await addDoc(
  collection(db, "enrollments"),
  {
    studentId: docId,
    courseName: newCourse.toUpperCase(),
    totalFee: Number(newTotalFee),
    feePaid: Number(newFirstInstallment),
    remainingFee: Number(newRemainingFee),
    paymentMode: newPaymentMode,
    receiptNo,
    department: dept?.toUpperCase(),
  }
);

const q = query(
  collection(db, "enrollments"),
  where("studentId", "==", docId)
);

const enrollmentSnapshot =
  await getDocs(q);

const enrollmentList =
  enrollmentSnapshot.docs.map(
    (doc) => ({
      id: doc.id,
      ...doc.data(),
    })
  );

setEnrollments(enrollmentList);

alert("Course added successfully.");
};
const deleteCourse = async (
  enrollmentId: string,
  courseName: string
) => {
  const confirmed = window.confirm(
    `Delete ${courseName} course?`
  );

  if (!confirmed) return;

  await deleteDoc(
    doc(db, "enrollments", enrollmentId)
  );

  setEnrollments((prev) =>
    prev.filter(
      (e) => e.id !== enrollmentId
    )
  );

  alert("Course deleted successfully.");
};

  return (
    <div className="
min-h-screen
bg-gradient-to-br
from-slate-950
via-slate-900
to-slate-950
px-4
sm:px-6
lg:px-8
py-8
text-white
">

      <div className="
max-w-7xl
mx-auto
space-y-10
">

        {/* HEADER */}
        <div className="
bg-slate-900/70
backdrop-blur-xl
border
border-slate-800
rounded-3xl
shadow-[0_10px_40px_rgba(0,0,0,0.35)]
p-6
md:p-8
">
          <h1 className="
text-3xl
md:text-5xl
font-bold
bg-gradient-to-r
from-blue-400
to-cyan-400
bg-clip-text
text-transparent
">
            Update Student
          </h1>

          <p className="text-slate-400 mt-3 text-lg">
            Manage student profile and enrolled courses
          </p>
        </div>

        {/* COURSES SECTION */}
        <div className="
bg-slate-900/70
backdrop-blur-xl
border
border-slate-800
rounded-3xl
shadow-[0_10px_40px_rgba(0,0,0,0.35)]
p-6
md:p-8
">

         <div className="flex items-center justify-between mb-6">
  <div>
    <h2 className="text-xl font-bold text-white">
      Student Courses
    </h2>

    <p className="text-slate-400 text-sm">
      Manage fees and installments
    </p>
  </div>

  <Button
onClick={() =>
  navigate(
    `/admin/add-course/${dept}/${docId}`
  )
}    className="
      bg-green-600
      hover:bg-green-700
      text-white
    "
  >
    + Add New Course
  </Button>
</div>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            {enrollments.map((enrollment) => (
              <div
                key={enrollment.id}
                className="
group
relative
overflow-hidden
rounded-3xl
border
border-slate-800
bg-gradient-to-br
from-slate-900
to-slate-950
p-6
transition-all
duration-300
hover:-translate-y-2
hover:border-blue-500
hover:shadow-[0_20px_50px_rgba(59,130,246,0.25)]
"            >
                <h3 className="text-xl font-semibold text-white">
                  {enrollment.courseName}
                </h3>

                <div className="mt-4 space-y-2 text-slate-300">

                  <div className="
flex
items-center
justify-between
py-2
border-b
border-slate-800
last:border-none
">
                    <span>Total Fee</span>
                    <span>₹{enrollment.totalFee}</span>
                  </div>

                  <div className="
flex
items-center
justify-between
py-2
border-b
border-slate-800
last:border-none
">
                    <span>Paid</span>
                    <span className="text-green-600 font-semibold">
                      ₹{enrollment.feePaid}
                    </span>
                  </div>

                <div className="
flex
items-center
justify-between
py-2
border-b
border-slate-800
last:border-none
">
  <span>Remaining</span>

  {enrollment.remainingFee === 0 ? (
    <span className="
      bg-green-500/20
      text-green-400
      px-3
      py-1
      rounded-full
      text-xs
      font-bold
    ">
      PAID
    </span>
  ) : (
    <span className="
      text-red-500
      font-semibold
    ">
      ₹{enrollment.remainingFee}
    </span>
  )}
</div>
                </div>

                <Button
                  className="
w-full
mt-8
h-12
rounded-xl
font-semibold
bg-gradient-to-r
from-blue-600
to-cyan-600
hover:from-blue-700
hover:to-cyan-700
shadow-lg
"onClick={() =>
  navigate(
    `/admin/manage-course/${docId}/${enrollment.id}`
  )
}
                >
                  Manage Course Enrollment
                </Button>

                <Button
  className="
    w-full
    mt-3
    bg-red-600
    hover:bg-red-700
    text-white
  "
  onClick={() =>
    deleteCourse(
      enrollment.id,
      enrollment.courseName
    )
  }
>
  Delete Course
</Button>
              </div>
            ))}

          </div>
        </div>

        {/* PERSONAL INFORMATION */}
        <div className="
bg-slate-900/70
backdrop-blur-xl
border
border-slate-800
rounded-3xl
shadow-[0_10px_40px_rgba(0,0,0,0.35)]
p-6
md:p-8
">

          <h2 className="text-xl font-bold text-white mb-6">
            Personal Information
          </h2>

          <div className="grid
grid-cols-1
md:grid-cols-2
xl:grid-cols-3
gap-8">

            <div>
              <label className="block text-sm
font-medium
text-slate-300
tracking-wide mb-2">
                Full Name
              </label>

              <input
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value.toUpperCase())
                }
                className="
w-full
bg-[#0f172a]
border
border-slate-700
text-white
rounded-2xl
px-5
py-3.5
text-base
transition-all
duration-200
hover:border-slate-500
focus:scale-[1.01]
focus:outline-none
focus:ring-2
focus:ring-blue-500
focus:border-blue-500
placeholder:text-slate-500
"
              />
            </div>

            <div>
              <label className="block text-sm
font-medium
text-slate-300
tracking-wide mb-2">
                Email
              </label>

              <input
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value.toLowerCase())
                }
                className="
w-full
bg-[#0f172a]
border
border-slate-700
text-white
rounded-2xl
px-5
py-3.5
text-base
transition-all
duration-200
hover:border-slate-500
focus:scale-[1.01]
focus:outline-none
focus:ring-2
focus:ring-blue-500
focus:border-blue-500
placeholder:text-slate-500
"
              />
            </div>

            <div>
              <label className="block text-sm
font-medium
text-slate-300
tracking-wide mb-2">
                Mobile
              </label>

              <input
                value={mobile}
                onChange={(e) =>
                  setMobile(
                    e.target.value.replace(/\D/g, "")
                  )
                }
                className="
w-full
bg-[#0f172a]
border
border-slate-700
text-white
rounded-2xl
px-5
py-3.5
text-base
transition-all
duration-200
hover:border-slate-500
focus:scale-[1.01]
focus:outline-none
focus:ring-2
focus:ring-blue-500
focus:border-blue-500
placeholder:text-slate-500
"
              />
            </div>

            <div>
              <label className="block text-sm
font-medium
text-slate-300
tracking-wide mb-2">
                Aadhaar
              </label>
              <input
                value={aadhar.replace(/(\d{4})(?=\d)/g, "$1 ")}
                onChange={(e) => {
                  const rawValue = e.target.value
                    .replace(/\s/g, "")
                    .replace(/\D/g, "")
                    .slice(0, 12);

                  setAadhar(rawValue);
                }}
                maxLength={14}
                className="
w-full
border
border-slate-700
rounded-2xl
px-5
py-3.5
text-base
transition-all
duration-200
hover:border-slate-500
focus:scale-[1.01]
bg-slate-800
text-white
focus:outline-none
focus:ring-2
focus:ring-blue-500
focus:border-blue-500
transition
"
              />
            </div>

            <div>
              <label className="block text-sm
font-medium
text-slate-300
tracking-wide mb-2">
                Date Of Birth
              </label>

              <input
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                className="
w-full
bg-[#0f172a]
border
border-slate-700
text-white
rounded-2xl
px-5
py-3.5
text-base
transition-all
duration-200
hover:border-slate-500
focus:scale-[1.01]
focus:outline-none
focus:ring-2
focus:ring-blue-500
focus:border-blue-500
placeholder:text-slate-500
"
              />
            </div>

            <div>
              <label className="block text-sm
font-medium
text-slate-300
tracking-wide mb-2">
                Department
              </label>

              <input
                value={dept?.toUpperCase() || ""}
                readOnly
                className="
  w-full
  bg-[#0f172a]
  border
  border-slate-700
  rounded-xl
  px-4
  py-3
  text-slate-300
  shadow-inner
  cursor-not-allowed
  "
              />
            </div>

          </div>

          <div className="flex justify-end gap-4 mt-8">

            <Button
              onClick={savePersonalInfo}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Save Personal Info
            </Button>

            <Button
              onClick={() => navigate(-1)}
              className="bg-slate-600 hover:bg-slate-700"
            >
              Cancel
            </Button>

          </div>

        </div>
        </div>

      </div>
  )};