import { useEffect, useState } from "react";
import { collection, getDocs, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useLocation } from "react-router-dom";

interface Student {
  totalFee?: number;
  feePaid?: number;
  remainingFee?: number;
}

export default function Dashboard() {
  const [totalStudents, setTotalStudents] = useState<number>(0);
  const [totalFees, setTotalFees] = useState<number>(0);
  const [totalPaidFees, setTotalPaidFees] = useState<number>(0);
  const [totalRemainingFees, setTotalRemainingFees] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);

  const location = useLocation();
  const department = location.state?.dept;

  useEffect(() => {
    const fetchDashboard = async () => {
      let studentsCount = 0;
      let feesSum = 0;
      let paidSum = 0;
      let remainingSum = 0;


      const snapshot = await getDocs(
        collection(db, "students", department, "students")
      );

      snapshot.forEach((studentDoc: QueryDocumentSnapshot) => {
        const data = studentDoc.data() as Student;

        studentsCount += 1;
        feesSum += Number(data.totalFee || 0);
        paidSum += Number(data.feePaid || 0);
        remainingSum += Number(data.remainingFee || 0);

      });

      setTotalStudents(studentsCount);
      setTotalFees(feesSum);
      setTotalPaidFees(paidSum);
      setTotalRemainingFees(remainingSum);

      setLoading(false);
    };

    if (department) {
      fetchDashboard();
    }
  }, [department]);

  if (loading) {
    return (
      <div className="p-6 text-center text-lg font-semibold">
        Loading Dashboard...
      </div>
    );
  }
const formatINR = (num: number) => {
  return num.toLocaleString("en-IN");
};

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">

      <div className="bg-white shadow rounded-2xl p-6 text-center">
        <h2 className="text-xl font-semibold">Total Students</h2>
        <p className="text-3xl mt-2">{totalStudents}</p>
      </div>

      <div className="bg-white shadow rounded-2xl p-6 text-center">
        <h2 className="text-xl font-semibold">Total Fees</h2>
        <p className="text-3xl mt-2">₹ {formatINR(totalFees)}
</p>
      </div>

      <div className="bg-white shadow rounded-2xl p-6 text-center">
        <h2 className="text-xl font-semibold">Total Paid Fees</h2>
        <p className="text-3xl mt-2">₹ {formatINR(totalPaidFees)}</p>
      </div>

<div className="bg-white shadow rounded-2xl p-6 text-center">
  <h2 className="text-xl font-semibold">Remaining Fees</h2>
  <p className="text-3xl mt-2">₹ {formatINR(totalRemainingFees)}</p>
</div>

    </div>
  );
}
