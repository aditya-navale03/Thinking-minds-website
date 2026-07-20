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
      collection(db, "enrollments"),
      where("department", "==", "CIVIL")
    );

    const snapshot = await getDocs(q);
    console.log("Students Found:", snapshot.size);

    let total = 0;
    let paid = 0;
    let remaining = 0;

    snapshot.forEach((student) => {
  const data = student.data();

  total += Number(data.totalFee || 0);
  paid += Number(data.feePaid || 0);
  remaining += Number(data.remainingFee || 0);

});

    setTotalFees(total);
    setFeesCollected(paid);
    setPendingFees(remaining);

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
<div className="p-6 space-y-8">

    <h1 className="text-4xl font-bold text-white mb-2">
        Welcome Back 👋
    </h1>

    <p className="text-slate-400">
        Civil Department Dashboard
    </p>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 pt-2">

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
</div>
);
}

