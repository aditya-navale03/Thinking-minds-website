import { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { doc, getDoc } from "firebase/firestore";

import { courses } from "../../data/courses";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import InvoiceTemplate from "../../components/invoice/InvoiceTemplate";

import {
    addDoc,
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";

import { db } from "../../firebase/firebaseConfig";



interface InvoiceData {
  studentName: string;
  email: string;
  mobile: string;
  course: string;
  admissionNo: string;
  totalFee: number;
  feesPaid: number;
  remainingFee: number;
  receiptNo: string;
  date: string;
  paymentMode: string;
}


export default function AddCourseToStudent() {
    const { dept, studentId } =
        useParams();


    const courseOptions = courses
        .filter(
            (course) =>
                course.category.toLowerCase() ===
                dept?.toLowerCase()
        )
        .map((course) => course.name);


    const navigate = useNavigate();

    const invoiceRef = useRef<HTMLDivElement>(null);

const [invoiceData, setInvoiceData] =
  useState<InvoiceData | null>(null);

    const [courseName, setCourseName] =
        useState("");

    const [courseError,
        setCourseError] =
        useState("");

    const [totalFee, setTotalFee] =
        useState("");

    const [firstInstallment,
        setFirstInstallment] =
        useState("");

    const remainingFee =
        Math.max(
            0,
            Number(totalFee || 0) -
            Number(firstInstallment || 0)
        );


    const [paymentMode,
        setPaymentMode] =
        useState("Cash");

        

    const addCourse = async () => {
        const paid =
            Number(firstInstallment);

        const total =
            Number(totalFee);
        const remaining =
            Math.max(0, total - paid);

        if (!courseName) {
            alert("Enter course name");
            return;
        }

        if (courseError) {
  return;
}
        if (total <= 0) {
            alert("Enter valid total fee");
            return;
        }

        if (paid > total) {
            alert(
                "First installment cannot exceed total fee"
            );
            return;
        }
        const studentSnap = await getDoc(
            doc(db, "studentProfiles", studentId!)
        );

        const studentData = studentSnap.data();

await addDoc(
    collection(db, "enrollments"),
    {
        receiptNo: studentData?.receiptNo || "",
        studentId,
        department: dept?.toUpperCase(),
        courseName: courseName.toUpperCase(),
        totalFee: total,
        feePaid: paid,
        remainingFee,
        paymentMode,
    }
);

const invoicePayload = {
    studentName: studentData.fullName,
    email: studentData.email,
    mobile: studentData.mobile,
    course: courseName.toUpperCase(),
    admissionNo: studentData.rollNo,
    totalFee: total,
    feesPaid: paid,
    remainingFee,
    receiptNo: studentData.receiptNo,
    date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }),
    paymentMode,
};

await generateAndSendInvoice(invoicePayload);



    };


      //invoice
  const generateAndSendInvoice = async (student: InvoiceData) => {
    setInvoiceData(student)

    setTimeout(async () => {
      if (!invoiceRef.current) {
        alert("Invoice not ready")
        return
      }

      try {
        const images = invoiceRef.current.querySelectorAll("img")
        await Promise.all(
          Array.from(images).map(
            img =>
              img.complete
                ? Promise.resolve()
                : new Promise(resolve => {
                  img.onload = resolve
                  img.onerror = resolve
                })
          )
        )
        console.log(invoiceRef.current);
        const canvas = await html2canvas(
          invoiceRef.current!,
          {
            scale: 2,
            useCORS: true
          }
        )

        const imgData = canvas.toDataURL("image/png")

        const pdf = new jsPDF("p", "mm", "a4")

        const pdfWidth = pdf.internal.pageSize.getWidth()
        const pdfHeight =
          (canvas.height * pdfWidth) / canvas.width

        pdf.addImage(
          imgData,
          "PNG",
          0,
          0,
          pdfWidth,
          pdfHeight
        )

        pdf.save(`receipt-${student.studentName}.pdf`)


  const msg = `
Dear ${student.studentName},

Congrats! 🎉 Your enrollment is successfully completed at
THINKING MINDS TECHNICAL TRAINING INSTITUTE

Admission Name : ${student.studentName}
Rollno No : ${student.admissionNo}
Course : ${student.course}
Total Course Fee : ₹${student.totalFee}/-

Please submit your Passport Size Photo & Aadhar Card Xerox at the institute office.

Thanks & Regards,
THINKING MINDS TECHNICAL TRAINING INSTITUTE
`

pdf.save(`receipt-${student.studentName}.pdf`);

window.open(
  `https://wa.me/91${student.mobile}?text=${encodeURIComponent(msg)}`,
  "_blank"
);

// Give the browser a moment to start the download and open WhatsApp
setTimeout(() => {
  navigate(-1);
}, 1000);
      }catch (err) {
  console.error(err);
  console.error("FULL ERROR", err);
if (err instanceof Error) {
  alert(err.message);
} else {
  alert(JSON.stringify(err));
}
}
    }, 1000)
  }

    return (
        <div className="
    min-h-screen
    bg-slate-950
    p-6
  ">

            <div className="
  flex
  justify-between
  items-center
  mb-8
">
                <div>
                    <h1 className="
      text-3xl
      font-bold
      text-white
    ">
                        Add Course
                    </h1>

                    <p className="
      text-slate-400
      mt-1
    ">
                        Create a new enrollment for this student
                    </p>
                </div>

                <button
                    onClick={() => navigate(-1)}
                    className="
      px-4
      py-2
      bg-slate-800
      border
      border-slate-700
      rounded-lg
      text-slate-300
      hover:bg-slate-700
      transition
    "
                >
                    Back
                </button>
            </div>

            {/* Form Card */}
            <div className="
 max-w-3xl
mx-auto
bg-slate-900
rounded-2xl
border
border-slate-800
p-8
">

                {/* Course */}
                <div className="mb-5">
                    <label className="
            block
            text-sm
            font-semibold
            text-slate-300
            mb-2
          ">
                        Course Name
                    </label>

                  <select
    value={courseName}
    onChange={async (e) => {
        const selectedCourse =
            e.target.value;

        setCourseName(selectedCourse);

        const q = query(
            collection(db, "enrollments"),
            where("studentId", "==", studentId),
            where(
                "courseName",
                "==",
                selectedCourse.toUpperCase()
            )
        );

        const snap = await getDocs(q);

        if (!snap.empty) {
            setCourseError(
                "Student already enrolled in this course"
            );
        } else {
            setCourseError("");
        }
    }}
    className={`
        w-full
        p-3
        bg-slate-800
        border
        ${
            courseError
                ? "border-red-500"
                : "border-slate-700"
        }
        text-white
        rounded-xl
    `}
>
    <option value="">
        Select Course
    </option>

    {courseOptions.map((course) => (
        <option
            key={course}
            value={course}
        >
            {course}
        </option>
    ))}
</select>
{courseError && (
  <p className="
    text-red-500
    text-sm
    mt-2
  ">
    {courseError}
  </p>
)}

                </div>

                {/* Fees */}
                <div className="
          grid
          md:grid-cols-2
          gap-5
          mb-5
        ">
                    <div>
                        <label className="
              block
              text-sm
              font-semibold
              text-slate-300
              mb-2
            ">
                            Total Fee
                        </label>

                        <input
                            value={totalFee}
                            onChange={(e) =>
                                setTotalFee(
                                    e.target.value.replace(/\D/g, "")
                                )
                            }
                            className="
                w-full
                p-3
                border
                bg-slate-800
border-slate-700
text-white
                rounded-xl
                focus:ring-2
                focus:ring-blue-500
              "
                        />
                    </div>

                    <div>
                        <label className="
              block
              text-sm
              font-semibold
              text-slate-300
              mb-2
            ">
                            First Installment
                        </label>

                        <input
                            value={firstInstallment}
                            onChange={(e) =>
                                setFirstInstallment(
                                    e.target.value.replace(/\D/g, "")
                                )
                            }
                            className="
                w-full
                p-3
                border
                bg-slate-800
border-slate-700
text-white
                rounded-xl
                focus:ring-2
                focus:ring-blue-500
              "
                        />
                    </div>
                </div>

                {/* Remaining Fee */}
                <div className="mb-5">
                    <label className="
            block
            text-sm
            font-semibold
            text-slate-300
            mb-2
          ">
                        Remaining Fee
                    </label>

                    <input
                        value={remainingFee}
                        readOnly
                        className="
              w-full
              p-3
              rounded-xl
             bg-slate-950
border
border-slate-700
text-green-400              font-semibold
            "
                    />
                </div>

                {/* Payment Mode */}
                <div className="mb-8">
                    <label className="
            block
            text-sm
            font-semibold
            text-slate-300
            mb-2
          ">
                        Payment Mode
                    </label>

                    <select
                        value={paymentMode}
                        onChange={(e) =>
                            setPaymentMode(
                                e.target.value
                            )
                        }
                        className="
              w-full
              p-3
              border
              bg-slate-800
border-slate-700
text-white
              rounded-xl
              focus:ring-2
              focus:ring-blue-500
            "
                    >
                        <option>Cash</option>
                        <option>Online</option>
                    </select>
                </div>

                {/* Submit */}
                <button
                    onClick={addCourse}
                    className="
            w-full
            bg-blue-600
            hover:bg-blue-700
            text-white
            font-semibold
            py-3
            rounded-xl
            transition
            duration-200
            shadow-md
          "
                >
                    Add Course
                </button>


            </div>
{invoiceData && (
  <div style={{ position: "fixed", left: "-9999px", top: 0 }}>
    <div ref={invoiceRef}>
      <InvoiceTemplate data={invoiceData} />
    </div>
  </div>
)}
        </div>
    )
};