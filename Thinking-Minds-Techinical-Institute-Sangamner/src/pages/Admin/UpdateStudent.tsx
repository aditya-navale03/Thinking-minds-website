import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Button } from "../../components/ui/button";

export default function UpdateStudent() {
  const { id } = useParams();
  const rollNo = decodeURIComponent(id || "");

  const { state } = useLocation();
  // const dept = state?.dept; // 👈 department coming from RemoveStudent
const dept = rollNo.split("/")[0].toLowerCase();


  const navigate = useNavigate();

  const [student, setStudent] = useState<any>(null);

  // Editable fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [dob, setDob] = useState("");
  const [course, setCourse] = useState("");
  const [totalFee, setTotalFee] = useState("");
  const [firstInstallment, setFirstInstallment] = useState("");
  const [feePaid, setFeePaid] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  // -------- LOAD FROM FIREBASE --------
  const formatDateForInput = (dob: string) => {
  const [day, month, year] = dob.split("-");
  return `${year}-${month}-${day}`; // YYYY-MM-DD
};


  useEffect(() => {
    const loadStudent = async () => {
      // if (!dept) {
      //   alert("Department missing");
      //   navigate(-1);
      //   return;
      // }

      const ref = doc(db, "students", dept);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        alert("Department not found");
        navigate(-1);
        return;
      }

      const list = snap.data().students || [];
      const s = list.find((x: any) => x.rollNo === rollNo);

      if (!s) {
        alert("Student not found");
        navigate(-1);
        return;
      }

      setStudent(s);

      // Fill form fields
      setFullName(s.fullName);
      setEmail(s.email);
      setMobile(s.mobile);
      setAadhar(s.aadhar);
      setDob(formatDateForInput(s.dob));
      setCourse(s.course);
      setTotalFee(String(s.totalFee));
      setFirstInstallment(String(s.firstInstallment));
      setFeePaid(String(s.feePaid));
      setPhotoURL(s.photoURL || "");
    };

    loadStudent();
  }, []);

  if (!student) return <p className="text-center mt-10">Loading...</p>;

  const remainingFee =
    Number(totalFee) - Number(firstInstallment) - Number(feePaid);

  // -------- SAVE UPDATE --------
  const save = async () => {
    const ref = doc(db, "students", dept);
    const snap = await getDoc(ref);
    const list = snap.data().students;

    const updatedList = list.map((s: any) =>
      s.rollNo === rollNo
        ? {
            ...s,
            fullName,
            email,
            mobile,
            aadhar,
            dob,
            course,
            totalFee: Number(totalFee),
            firstInstallment: Number(firstInstallment),
            feePaid: Number(feePaid),
            remainingFee,
            photoURL,
          }
        : s
    );

    await updateDoc(ref, { students: updatedList });

    alert("Student updated successfully");
    navigate(-1);
  };

  return (
  <div className="min-h-screen bg-gray-100 px-6 py-10 flex justify-center">
    <div className="w-full max-w-5xl bg-white shadow-xl rounded-2xl p-10 border">

      <h1 className="text-3xl font-bold mb-8 text-center">Update Student</h1>

      {/* 3 Column Form Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

        <div>
          <label className="font-semibold">Full Name</label>
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="border w-full px-3 py-3 rounded-xl shadow-sm"
          />
        </div>

        <div>
          <label className="font-semibold">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border w-full px-3 py-3 rounded-xl shadow-sm"
          />
        </div>

        <div>
          <label className="font-semibold">Mobile</label>
          <input
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="border w-full px-3 py-3 rounded-xl shadow-sm"
          />
        </div>

        <div>
          <label className="font-semibold">Aadhar</label>
          <input
            value={aadhar}
            onChange={(e) => setAadhar(e.target.value)}
            className="border w-full px-3 py-3 rounded-xl shadow-sm"
          />
        </div>

        <div>
          <label className="font-semibold">Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="border w-full px-3 py-3 rounded-xl shadow-sm"
          />
        </div>

        <div>
          <label className="font-semibold">Course</label>
          <input
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="border w-full px-3 py-3 rounded-xl shadow-sm"
          />
        </div>

        <div>
          <label className="font-semibold">Total Fee</label>
          <input
            value={totalFee}
            onChange={(e) => setTotalFee(e.target.value)}
            className="border w-full px-3 py-3 rounded-xl shadow-sm"
          />
        </div>

        <div>
          <label className="font-semibold">1st Installment</label>
          <input
            value={firstInstallment}
            onChange={(e) => setFirstInstallment(e.target.value)}
            className="border w-full px-3 py-3 rounded-xl shadow-sm"
          />
        </div>

        <div>
          <label className="font-semibold">Fee Paid</label>
          <input
            value={feePaid}
            onChange={(e) => setFeePaid(e.target.value)}
            className="border w-full px-3 py-3 rounded-xl shadow-sm"
          />
        </div>

        <div>
          <label className="font-semibold">Remaining Fee</label>
          <input
            readOnly
            value={remainingFee}
            className="border w-full px-3 py-3 bg-gray-200 rounded-xl shadow-sm"
          />
        </div>

        <div>
          <label className="font-semibold">Department</label>
          <input
            readOnly
            value={dept.toUpperCase()}
            className="border w-full px-3 py-3 bg-gray-200 rounded-xl shadow-sm"
          />
        </div>

      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-6 mt-10">
        <Button onClick={save} className="bg-blue-600 text-white px-10 py-3 text-lg rounded-xl">
          Save
        </Button>

        <Button
          onClick={() => navigate(-1)}
          className="bg-gray-600 text-white px-10 py-3 text-lg rounded-xl"
        >
          Cancel
        </Button>
      </div>

    </div>
  </div>
);
}