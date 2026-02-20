import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useLocation } from "react-router-dom";

interface Student {
    fullName?: string;
    mobile?: string;
    remainingFee?: number;
}

export default function Reminders() {
    const location = useLocation();
    const department = location.state?.dept;

    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudents = async () => {
            const snapshot = await getDocs(
                collection(db, "students", department, "students")
            );

            const list: Student[] = [];

            snapshot.forEach((doc) => {
                const data = doc.data() as Student;
                list.push(data);
            });

            setStudents(list);
            setLoading(false);
        };

        if (department) {
            fetchStudents();
        }
    }, [department]);

    const sendReminder = (student: Student) => {
const message = `
Dear Student,

This is a reminder that your pending fees of ₹${(student.remainingFee || 0).toLocaleString("en-IN")} for the course is due. Kindly complete the payment at the earliest to avoid interruption in your classes.

If you have already paid, please ignore this message.

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
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6 text-center uppercase">
                {department} Defaulters List
            </h1>

            <div className="space-y-4">
                {students.map((student, index) => (
                    <div
                        key={index}
                        className="bg-white shadow rounded-xl p-4 flex justify-between items-center"
                    >
                        <div>
                            <p className="font-semibold">{student.fullName}</p>
                            <p
                                className={`font-semibold ${(student.remainingFee || 0) > 0
                                        ? "text-red-600"
                                        : "text-green-600"
                                    }`}
                            >
                                {student.remainingFee && student.remainingFee > 0
                                    ? `Pending: ₹ ${student.remainingFee.toLocaleString("en-IN")}`
                                    : "Paid"}
                            </p>

                        </div>

                        {(student.remainingFee || 0) > 0 ? (
                            <button
                                onClick={() => sendReminder(student)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                            >
                                Send Reminder
                            </button>
                        ) : (
                            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold">
                                Paid
                            </span>
                        )}

                    </div>
                ))}
            </div>
        </div>
    );
}
