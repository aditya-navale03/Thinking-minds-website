import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef } from "react";

import InvoiceTemplate
from "../../components/invoice/InvoiceTemplate";

import {
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../firebase/firebaseConfig";

export default function ManageCourse() {
  const { studentId, enrollmentId } =
    useParams();


const [amountError, setAmountError] =
  useState("");
  
  const [student, setStudent] =
    useState<any>(null);

  const [invoiceData, setInvoiceData] =
  useState<any>(null);

  const invoiceRef =
  useRef<HTMLDivElement | null>(null);


  const [enrollment, setEnrollment] =
    useState<any>(null);

    
        const [installmentAmount, setInstallmentAmount] =
  useState("");

const [paymentMode, setPaymentMode] =
  useState("Cash");

  
const amount = Number(installmentAmount);

const isInvalidAmount =
  installmentAmount !== "" &&
  amount > (enrollment?.remainingFee ?? 0);

  useEffect(() => {
    const loadData = async () => {
      const studentSnap =
        await getDoc(
          doc(
            db,
            "studentProfiles",
            studentId!
          )
        );


      const enrollmentSnap =
        await getDoc(
          doc(
            db,
            "enrollments",
            enrollmentId!
          )
        );

      if (studentSnap.exists()) {
        setStudent(studentSnap.data());
      }

      if (enrollmentSnap.exists()) {
        setEnrollment(
          enrollmentSnap.data()
        );
      }
    };

    loadData();
  }, []);

useEffect(() => {
  if (!invoiceData || !invoiceRef.current)
    return;

  const generate = async () => {
    try {
      const images =
        invoiceRef.current.querySelectorAll(
          "img"
        );

      await Promise.all(
        Array.from(images).map(
          (img) =>
            img.complete
              ? Promise.resolve()
              : new Promise((resolve) => {
                  img.onload = resolve;
                  img.onerror = resolve;
                })
        )
      );

      await new Promise((resolve) =>
        setTimeout(resolve, 800)
      );

      await generatePDF();
    } catch (err) {
      console.log(err);
    }
  };

  generate();
}, [invoiceData]);



if (!student || !enrollment) {
  return (
    <div className="
      min-h-screen
      bg-slate-950
      text-white
      flex
      items-center
      justify-center
    ">
      Loading...
    </div>
  );
}


  const updatedFeePaid =
  Number(enrollment?.feePaid || 0) +
  Number(installmentAmount || 0);


const updatedRemaining =
  enrollment.totalFee -
  updatedFeePaid;

  const saveInstallment = async () => {
    if (enrollment.remainingFee <= 0) {
  alert("This course is already fully paid.");
  return;
}
const amount = Number(installmentAmount);

if (amount > enrollment.remainingFee) {
  alert(
    `Installment cannot exceed remaining fee of ₹${enrollment.remainingFee}`
  );
  return;
} 

  if (!installmentAmount) {
    alert("Enter installment amount");
    return;
  }

  await updateDoc(
    doc(
      db,
      "enrollments",
      enrollmentId!
    ),
    {
      feePaid: updatedFeePaid,
      remainingFee: updatedRemaining,
      paymentMode,
    }
  );
const invoice = {
  studentName: student.fullName,

  email: student.email,

  mobile: student.mobile,

  course: enrollment.courseName,

  admissionNo: student.rollNo,

  totalFee: enrollment.totalFee,

  feesPaid: Number(
    installmentAmount
  ),

  remainingFee: updatedRemaining,

  receiptNo: student.receiptNo,

  date: new Date().toLocaleDateString(
    "en-GB",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ),

  paymentMode,
};


setInvoiceData(invoice);

  alert("Installment updated successfully.");

  setEnrollment({
    ...enrollment,
    feePaid: updatedFeePaid,
    remainingFee: updatedRemaining,
    paymentMode,
  });

  setInstallmentAmount("");
};

const generatePDF = async () => {
  if (!invoiceRef.current) return;

  console.log(invoiceRef.current);
console.log(
  invoiceRef.current?.offsetWidth,
  invoiceRef.current?.offsetHeight
);

  const canvas = await html2canvas(
    invoiceRef.current,
    {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    }
  );

  const imgData =
    canvas.toDataURL("image/png");

  const pdf = new jsPDF(
    "p",
    "mm",
    "a4"
  );

  const pdfWidth =
    pdf.internal.pageSize.getWidth();

  const pdfHeight =
    (canvas.height * pdfWidth) /
    canvas.width;

  pdf.addImage(
    imgData,
    "PNG",
    0,
    0,
    pdfWidth,
    pdfHeight
  );

  pdf.save(
    `receipt-${student.fullName}-${enrollment.courseName}.pdf`
  );

  const message = `Hello ${student.fullName},

Your installment payment receipt has been generated.

Course: ${enrollment.courseName}

Amount Paid: ₹${invoiceData?.feesPaid}

Remaining Fee: ₹${invoiceData?.remainingFee}

- Thinking Minds Institute`;

  const phone =
    `91${student.mobile}`;

  const url =
    `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  setTimeout(() => {
    window.open(
      url,
      "_blank"
    );
  }, );
};

return (
  <div className="min-h-screen bg-slate-950 p-4 text-slate-200">
    <div className="max-w-7xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            Manage Course
          </h1>

          <p className="text-slate-400 mt-1">
            Manage installments and receipts
          </p>
        </div>

        <div className="
          px-5 py-2
          rounded-2xl
          bg-indigo-600
          text-white
          font-semibold
          shadow-lg
        ">
          {enrollment.courseName}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="
        grid
        grid-cols-1
        md:grid-cols-3
        gap-6
        mb-8
      ">
        <div className="
          bg-slate-900
          border border-slate-800
          rounded-2xl
          p-6
        ">
          <p className="text-slate-400 text-sm">
            Total Fee
          </p>

          <h2 className="
            text-xl
            font-bold
            mt-3
            text-white
          ">
            ₹{enrollment.totalFee}
          </h2>
        </div>

        <div className="
          bg-slate-900
          border border-slate-800
          rounded-2xl
          p-6
        ">
          <p className="text-slate-400 text-sm">
            Fee Paid
          </p>

          <h2 className="
            text-3xl
            font-bold
            mt-3
            text-green-400
          ">
            ₹{enrollment.feePaid}
          </h2>
        </div>

        <div className="
          bg-slate-900
          border border-slate-800
          rounded-2xl
          p-6
        ">
          <p className="text-slate-400 text-sm">
            Remaining Fee
          </p>

          <h2 className="
            text-3xl
            font-bold
            mt-3
            text-red-400
          ">
            ₹{enrollment.remainingFee}
          </h2>
        </div>
      </div>

      {/* Main Content */}
      <div className="
        grid
        lg:grid-cols-2
        gap-4
      ">

        {/* Student Card */}
        <div className="
          bg-slate-900
          border border-slate-800
          rounded-2xl
          p-4
        ">
          <h2 className="
            text-2xl
            font-bold
            mb-6
          ">
            Student Details
          </h2>

          <div className="space-y-3">

            <div className="
              flex
              justify-between
              border-b border-slate-800
              pb-3
            ">
              <span className="text-slate-400">
                Student Name
              </span>

              <span className="font-semibold">
                {student.fullName}
              </span>
            </div>

            <div className="
              flex
              justify-between
              border-b border-slate-800
              pb-3
            ">
              <span className="text-slate-400">
                Roll Number
              </span>

              <span className="font-semibold">
                {student.rollNo}
              </span>
            </div>

            <div className="
              flex
              justify-between
              border-b border-slate-800
              pb-3
            ">
              <span className="text-slate-400">
                Receipt Number
              </span>

              <span className="font-semibold">
                {student.receiptNo}
              </span>
            </div>

            <div className="
              flex
              justify-between
            ">
              <span className="text-slate-400">
                Course
              </span>

              <span className="font-semibold">
                {enrollment.courseName}
              </span>
            </div>

          </div>
        </div>

        {/* Installment Card */}
        <div className="
          bg-slate-900
          border border-slate-800
          rounded-2xl
          p-4
        ">
          <h2 className="
            text-2xl
            font-bold
            mb-6
          ">
            Add Installment
          </h2>

          <div className="space-y-6">

            <div>
              <label className="
                text-slate-400
                text-sm
              ">
                Installment Amount
              </label>
<input
  value={installmentAmount}
 onChange={(e) => {
  const value =
    e.target.value.replace(/\D/g, "");

  if (
    value &&
    Number(value) >
      enrollment.remainingFee
  ) {
    setAmountError(
      `Maximum amount is ₹${enrollment.remainingFee}`
    );
    return;
  }

  setAmountError("");
  setInstallmentAmount(value);
}}
  className={`
    w-full
    mt-2
    bg-slate-950
    border
    rounded-2xl
    px-3
    py-2
    focus:outline-none
    ${
      isInvalidAmount
        ? "border-red-500 focus:border-red-500"
        : "border-slate-800 focus:border-indigo-500"
    }
  `}
/>

{amountError && (
  <p className="
    text-red-500
    text-sm
    mt-2
  ">
    {amountError}
  </p>
)}
            </div>

            <div>
              <label className="
                text-slate-400
                text-sm
              ">
                Payment Mode
              </label>

              <select
                value={paymentMode}
                onChange={(e) =>
                  setPaymentMode(e.target.value)
                }
                className="
                  w-full
                  mt-2
                  bg-slate-950
                  border border-slate-800
                  rounded-2xl
                  px-3
                  py-2
                  focus:outline-none
                  focus:border-indigo-500
                "
              >
                <option value="Cash">
                  Cash
                </option>

                <option value="Online">
                  Online
                </option>
              </select>
            </div>

            <div className="
              bg-slate-950
              border border-slate-800
              rounded-2xl
              p-5
            ">
              <div className="
                flex
                justify-between
                mb-3
              ">
                <span className="text-slate-400">
                  New Paid Amount
                </span>

                <span className="
                  text-green-400
                  font-bold
                ">
                  ₹{updatedFeePaid}
                </span>
              </div>

              <div className="
                flex
                justify-between
              ">
                <span className="text-slate-400">
                  Remaining Fee
                </span>

                <span className="
                  text-red-400
                  font-bold
                ">
                  ₹{updatedRemaining}
                </span>
              </div>
            </div>

            <button
              onClick={saveInstallment}
              className="
                w-full
                bg-indigo-600
                hover:bg-indigo-700
                rounded-2xl
                py-2.5
                font-semibold
                transition-all
                duration-300
              "
            >
              Save Installment
            </button>

          </div>
        </div>
 {invoiceData && (
          <div style={{ position: "fixed", left: "-9999px", top: 0 }}>
            <div ref={invoiceRef}>
              <InvoiceTemplate data={invoiceData} />
            </div>
          </div>
        )}

      </div>
    </div>
  </div>
)};