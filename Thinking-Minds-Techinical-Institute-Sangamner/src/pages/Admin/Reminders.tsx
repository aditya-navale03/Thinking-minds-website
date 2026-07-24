import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useLocation } from "react-router-dom";

import { query, where } from "firebase/firestore";


interface Student {
    id: string;
    fullName?: string;
    mobile?: string;
    department?: string;
    enrollments: {
        courseName: string;
        remainingFee: number;
    }[];
}

export default function Reminders() {
    const location = useLocation();
const department = localStorage.getItem("admin_department")?.toUpperCase();    console.log("Department:", department);

    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchStudents = async () => {
    const studentsSnapshot = await getDocs(
        query(
            collection(db, "studentProfiles"),
            where("department", "==", department?.toUpperCase())
        )
    );

    const enrollmentsSnapshot = await getDocs(
        query(
            collection(db, "enrollments"),
            where("department", "==", department?.toUpperCase())
        )
    );

    const enrollmentsMap: Record<
        string,
        { courseName: string; remainingFee: number }[]
    > = {};

    enrollmentsSnapshot.forEach((doc) => {
        const data = doc.data();

        if (!enrollmentsMap[data.studentId]) {
            enrollmentsMap[data.studentId] = [];
        }

        enrollmentsMap[data.studentId].push({
            courseName: data.courseName,
            remainingFee: data.remainingFee || 0,
        });
    });

    const list: Student[] = [];

    studentsSnapshot.forEach((doc) => {
        const data = doc.data();

        list.push({
            id: doc.id,
            fullName: data.fullName,
            mobile: data.mobile,
            department: data.department,
            enrollments: enrollmentsMap[doc.id] || [],
        });
    });

    setStudents(list);
    setLoading(false);
};

        if (department) {
            fetchStudents();
        }
    }, [department]);
const sendReminder = (
    student: Student,
    courseName: string,
    remainingFee: number
) => {
const message = `
Dear ${student.fullName},

This is a reminder that your pending fees of ₹${remainingFee.toLocaleString(
    "en-IN"
)} for ${courseName} is due.

Kindly complete the payment at the earliest.

Thinking Minds Technical Training Institute
`;



        window.open(
            `https://wa.me/91${student.mobile}?text=${encodeURIComponent(message)}`,
            "_blank"
        );
    };

    if (loading) {
        return (
            <div className="p-6 text-center text-lg font-semibold">
                Loading Students...
            </div>
        );
    }

    return (
        <div className="min-h-full bg-slate-950 p-6">
    <div className="max-w-7xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
    <div>
        <h1 className="text-3xl font-bold text-white">
            Fee Reminders
        </h1>
        <p className="text-slate-300 mt-1">
            {department} Department
        </p>
    </div>

    <span className="bg-slate-800 text-slate-700 px-4 py-2 rounded-lg text-sm font-semibold">
        {students.length} Students
    </span>
</div>

            <div className="space-y-3">
               {students.map((student) => (
    <div
        key={student.id}
        className="bg-slate-900 border border-slate-800 rounded-xl hover:border-violet-500 transition-all duration-300"
    >
        <div className="flex items-center justify-between bg-slate-800 border-b border-slate-700 text-white px-5 py-3 rounded-t-xl">
    <div>
        <h2 className="font-semibold text-lg text-white">
            {student.fullName}
        </h2>
        <p className="text-sm text-slate-300">
            {student.mobile}
        </p>
    </div>

    <span className="text-xs bg-violet-600 text-white px-3 py-1 rounded-full font-semibold">
        {student.enrollments.length} Course{student.enrollments.length > 1 ? "s" : ""}
    </span>
</div>

        <div className="grid grid-cols-[2fr_1fr_140px] bg-slate-800 px-5 py-2 text-xs uppercase tracking-wider text-slate-300 font-bold">
    <div>Course</div>
    <div>Status</div>
    <div className="text-right">Action</div>
</div>

        {student.enrollments.map((course, index) => (
            <div
                key={index}
                className="grid grid-cols-[2fr_1fr_140px] items-center px-5 py-3 border-t border-slate-800 hover:bg-slate-800 transition"
            >
                <div className="text-slate-100 font-medium">
    {course.courseName}
</div>

      <div>
    {course.remainingFee > 0 ? (
        <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            ₹ {course.remainingFee.toLocaleString("en-IN")}
        </span>
    ) : (
        <span className="bg-emerald-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
            ✓ Paid
        </span>
    )}
</div>
<div className="text-right">
    {course.remainingFee > 0 ? (
        <button
            onClick={() =>
                sendReminder(
                    student,
                    course.courseName,
                    course.remainingFee
                )
            }
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
        >
            Reminder
        </button>
    ) : (
        <span className="bg-slate-800 text-slate-600 px-3 py-1 rounded-md text-xs font-semibold">
    Completed
</span>
    )}
</div>
            </div>
        ))}
    </div>
))}
            </div>
        </div>
        </div>
    );
    
}
