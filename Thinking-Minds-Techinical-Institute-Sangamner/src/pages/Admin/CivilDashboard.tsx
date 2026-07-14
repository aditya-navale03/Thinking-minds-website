import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

//dashbard new 

import DashboardCard from "../../components/Dashboard/DashboardCard";

import {
    Users,
    Bell,
    BookOpen,
    UserPlus,
} from "lucide-react";

//dashboard data new
import { db } from "../../firebase/firebaseConfig";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";


export default function CivilAdminDashboard() {
  const navigate = useNavigate();

  //dashboard new
  const [totalStudents, setTotalStudents] = useState(0);
const [totalFees, setTotalFees] = useState(0);
const [feesCollected, setFeesCollected] = useState(0);
const [pendingFees, setPendingFees] = useState(0);

//names on dashbard
const [students, setStudents] = useState<
  { fullName: string; course: string }[]
>([]);
//dashboard new 
const loadDashboard = async () => {
  try {
    // Total Students
    const counterRef = doc(db, "counters", "CIVIL_2026");
    const counterSnap = await getDoc(counterRef);
   

    if (counterSnap.exists()) {
      console.log(counterSnap.data());
      setTotalStudents(counterSnap.data().lastReceiptNo || 0);
    }

    // Student Data
    const q = query(
      collection(db, "students"),
      where("department", "==", "CIVIL")
    );

    const snapshot = await getDocs(q);
    console.log("Students Found:", snapshot.size);

    let total = 0;
    let paid = 0;
    let remaining = 0;
let studentList: { fullName: string; course: string }[] = [];
snapshot.forEach((student) => {
  const data = student.data();

  total += Number(data.totalFee || 0);
  paid += Number(data.feePaid || 0);
  remaining += Number(data.remainingFee || 0);

studentList.push({
  fullName: data.fullName,
  course: data.course,
});});

    setTotalFees(total);
    setFeesCollected(paid);
    setPendingFees(remaining);
    setStudents(studentList);

  } catch (err) {
    console.error(err);
  }
};

  // 🔒 CHECK IF ADMIN DEPARTMENT = "civil"
  useEffect(() => {
  const dept = localStorage.getItem("admin_department");

  if (!dept) {
    alert("You must login first!");
    navigate("/admin");
    return;
  }

  if (dept !== "civil") {
    alert("Access denied! You are not a Civil admin.");
    navigate("/admin");
    return;
  }

  loadDashboard();

}, [navigate]);

  return (
<div>

    <h1 className="text-4xl font-bold text-white">
        Welcome Back 👋
    </h1>

    <p className="text-slate-400 mt-2">
        Civil Department Dashboard
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

       <DashboardCard
    title="Total Students"
    value={totalStudents}
    icon={Users}
    color="bg-blue-600"
/>

<DashboardCard
    title="Total Fees"
    value={`₹${totalFees.toLocaleString()}`}
    icon={BookOpen}
    color="bg-green-600"
/>

<DashboardCard
    title="Fees Collected"
    value={`₹${feesCollected.toLocaleString()}`}
    icon={UserPlus}
    color="bg-violet-600"
/>

<DashboardCard
    title="Pending Fees"
    value={`₹${pendingFees.toLocaleString()}`}
    icon={Bell}
    color="bg-red-600"
/>

    </div>

    <div className="mt-10 bg-slate-900 rounded-2xl p-6 border border-slate-800">
  <h2 className="text-xl font-semibold text-white mb-4">
    Student List
  </h2>

  <table className="w-full">
  <thead>
    <tr className="text-slate-400 border-b border-slate-700">
      <th className="text-left py-2">#</th>
      <th className="text-left py-2">Student Name</th>
      <th className="text-left py-2">Course</th>
    </tr>
  </thead>

  <tbody>
    {students.map((student, index) => (
      <tr key={index} className="border-b border-slate-800">
        <td className="py-2 text-white">{index + 1}</td>
        <td className="py-2 text-white">{student.fullName}</td>
        <td className="py-2 text-slate-300">{student.course}</td>
      </tr>
    ))}
  </tbody>
</table>
</div>


</div>
);
}

