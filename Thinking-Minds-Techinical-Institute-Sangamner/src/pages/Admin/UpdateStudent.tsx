import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig"; // ✅ FIXED PATH
import { Button } from "@/components/ui/button";

interface Student {
  id: number;
  dbId: string;
  name: string;
  dob: string;
  email: string;
  course: string;
  department: string;
  totalFee: number;
  feePaid: number;
  photoURL: string;
  createdAt: Timestamp;
}

interface Errors {
  name?: string;
  dob?: string;
  email?: string;
  course?: string;
  department?: string;
  totalFee?: string;
  addPayment?: string;
}

export default function UpdateStudent() {
  const { id } = useParams(); // Firestore doc ID
  const navigate = useNavigate();

  const [student, setStudent] = useState<Student | null>(null);
  const [errors, setErrors] = useState<Errors>({});

  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [department, setDepartment] = useState("");
  const [totalFee, setTotalFee] = useState("");
  const [feePaid, setFeePaid] = useState(0);
  const [addPayment, setAddPayment] = useState("");

  const formatIndian = (v: string) => {
    const d = v.replace(/\D/g, "");
    if (!d) return "";
    if (d.length <= 3) return d;
    const last3 = d.slice(-3);
    let other = d.slice(0, -3);
    other = other.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    return `${other},${last3}`;
  };

  const parseNum = (v: string) => Number(v.replace(/,/g, "") || "0");

  // Load student
  useEffect(() => {
    if (!id) return;

    const loadStudent = async () => {
      const ref = doc(db, "students", id);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        alert("Student not found");
        navigate(-1);
        return;
      }

      const data = snap.data() as Student;

      setStudent({ ...data, dbId: id });

      setName(data.name);
      setDob(data.dob);
      setEmail(data.email);
      setCourse(data.course);
      setDepartment(data.department);
      setTotalFee(formatIndian(String(data.totalFee)));
      setFeePaid(data.feePaid);
    };

    loadStudent();
  }, [id]);

  if (!student) return <p className="text-center mt-10">Loading...</p>;

  const due = parseNum(totalFee) - feePaid;

  // Save info
  const save = async () => {
    const err: Errors = {};

    if (!name.trim()) err.name = "Required";
    if (!dob.trim()) err.dob = "Required";
    if (!email.trim()) err.email = "Required";
    if (!course.trim()) err.course = "Required";
    if (!department.trim()) err.department = "Required";

    const tf = parseNum(totalFee);
    if (tf <= 0) err.totalFee = "Invalid total fee";

    setErrors(err);
    if (Object.keys(err).length) return;

    const ref = doc(db, "students", student.dbId);

    await updateDoc(ref, {
      name,
      dob,
      email,
      course,
      department,
      totalFee: tf,
      feePaid,
    });

    alert("Updated successfully");
    navigate(-1);
  };

  // Add payment
  const addPay = async () => {
    const amt = parseNum(addPayment);

    if (amt <= 0) {
      setErrors({ addPayment: "Invalid" });
      return;
    }
    if (amt > due) {
      setErrors({ addPayment: "Exceeds due amount" });
      return;
    }

    const ref = doc(db, "students", student.dbId);

    await updateDoc(ref, {
      feePaid: feePaid + amt,
    });

    setFeePaid(feePaid + amt);
    setAddPayment("");
    setErrors({});
  };

  return (
    <div className="min-h-screen px-10 py-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-8">Update Student</h1>

      <div className="grid grid-cols-2 gap-6 max-w-4xl mx-auto">
        <div>
          {errors.name && <p className="text-red-600">{errors.name}</p>}
          <label className="font-semibold">Full Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border w-full px-3 py-2 bg-white rounded"
          />
        </div>

        <div>
          {errors.dob && <p className="text-red-600">{errors.dob}</p>}
          <label className="font-semibold">DOB</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="border w-full px-3 py-2 bg-white rounded"
          />
        </div>

        <div>
          {errors.email && <p className="text-red-600">{errors.email}</p>}
          <label className="font-semibold">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border w-full px-3 py-2 bg-white rounded"
          />
        </div>

        <div>
          {errors.course && <p className="text-red-600">{errors.course}</p>}
          <label className="font-semibold">Course</label>
          <input
            value={course}
            onChange={(e) => setCourse(e.target.value)}
            className="border w-full px-3 py-2 bg-white rounded"
          />
        </div>

        <div>
          {errors.department && <p className="text-red-600">{errors.department}</p>}
          <label className="font-semibold">Department</label>
          <input
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="border w-full px-3 py-2 bg-white rounded"
          />
        </div>

        <div>
          {errors.totalFee && <p className="text-red-600">{errors.totalFee}</p>}
          <label className="font-semibold">Total Fee</label>
          <input
            value={totalFee}
            onChange={(e) => {
              const raw = e.target.value.replace(/,/g, "");
              if (!/^\d*$/.test(raw)) return;
              setTotalFee(formatIndian(raw));
            }}
            className="border w-full px-3 py-2 bg-white rounded"
          />
        </div>

        <div>
          <label className="font-semibold">Fee Paid</label>
          <input
            value={feePaid.toLocaleString("en-IN")}
            readOnly
            className="border w-full px-3 py-2 bg-gray-200 rounded"
          />
        </div>

        <div>
          <label className="font-semibold">Due Amount</label>
          <input
            value={due.toLocaleString("en-IN")}
            readOnly
            className="border w-full px-3 py-2 bg-gray-200 rounded"
          />
        </div>

        <div className="col-span-2">
          {errors.addPayment && <p className="text-red-600">{errors.addPayment}</p>}
          <label className="font-semibold">Add Payment</label>

          <div className="flex gap-3">
            <input
              value={addPayment}
              onChange={(e) => {
                const raw = e.target.value.replace(/,/g, "");
                if (!/^\d*$/.test(raw)) return;
                setAddPayment(formatIndian(raw));
              }}
              className="border w-full px-3 py-2 bg-white rounded"
            />

            <Button onClick={addPay}>Add</Button>
          </div>
        </div>

        <div className="col-span-2 flex justify-center gap-6 mt-5">
          <Button onClick={save} className="bg-blue-600 text-white px-8">
            Save
          </Button>

          <Button
            onClick={() => navigate(-1)}
            className="bg-gray-600 text-white px-8"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
