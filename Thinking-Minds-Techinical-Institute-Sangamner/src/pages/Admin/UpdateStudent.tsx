import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Button } from "../../components/ui/button";

import InstallmentInvoiceTemplate
  from "../../components/invoice/InstallmentInvoiceTemplate"

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import InvoiceTemplate from "../../components/invoice/InvoiceTemplate";
import { useRef } from "react";

export default function UpdateStudent() {
  const { dept, id } = useParams();
  const docId = id || "";

  const navigate = useNavigate();

  const [student, setStudent] = useState<any>(null);


  const [invoiceData, setInvoiceData] = useState<any>(null);

  // Editable fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [aadhar, setAadhar] = useState("");
  const [dob, setDob] = useState("");
  const [course, setCourse] = useState("");
  const [totalFee, setTotalFee] = useState("");
  const [firstInstallment, setFirstInstallment] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  // -------- LOAD FROM FIREBASE --------
  const formatDateForInput = (dob: string) => {
    const [day, month, year] = dob.split("-");
    return `${year}-${month}-${day}`; // YYYY-MM-DD
  };

  const invoiceRef = useRef<HTMLDivElement | null>(null);

  const [nextInstallment, setNextInstallment] = useState("");
  const [paymentMode, setPaymentMode] = useState("");

  useEffect(() => {
    const loadStudent = async () => {
      if (!dept) {
        alert("Department missing");
        navigate(-1);
        return;
      }

      const ref = doc(
        db,
        "students",
        dept,
        "students",
        docId
      );

      const snap = await getDoc(ref);

      if (!snap.exists()) {
        alert("Student not found");
        navigate(-1);
        return;
      }

      const s = snap.data();

      setStudent(s);

      setFullName(s.fullName);
      setEmail(s.email);
      setMobile(s.mobile);
      setAadhar(s.aadhar);
      setDob(formatDateForInput(s.dob));
      setCourse(s.course);
      setTotalFee(String(s.totalFee));
      setFirstInstallment(String(s.firstInstallment));
      setPhotoURL(s.photoURL || "");
    };

    loadStudent();
  }, [dept, docId]);


  const updatedFirstInstallment =
    Number(firstInstallment) + Number(nextInstallment);

  const updatedRemaining =
    Number(totalFee) - updatedFirstInstallment;

  const save = async () => {
    if (!dept || !docId) {
      alert("Missing department or student id");
      return;
    }

    if (!paymentMode) {
      alert("Please select a payment mode before saving.");
      return;
    }



    const ref = doc(
      db,
      "students",
      dept,
      "students",
      docId
    );

    const installmentAmount =
      Number(nextInstallment || 0);

    const updatedFirstInstallment =
      Number(firstInstallment) + installmentAmount;

    const updatedRemaining =
      Number(totalFee) - updatedFirstInstallment;

    // 🔹 Update Firestore
    await updateDoc(ref, {
      fullName,
      email,
      mobile,
      aadhar,
      dob,
      course,
      totalFee: Number(totalFee),
      firstInstallment: updatedFirstInstallment,
      remainingFee: updatedRemaining,
      paymentMode,
    });

    // 🔹 Prepare Invoice Data
   setInvoiceData({
  studentName: fullName,
  course,
  mobile,
  paymentMode,
  date: new Date().toLocaleDateString("en-GB"),

  installmentPaid: installmentAmount,
  totalPaid: updatedFirstInstallment,
  totalFee: Number(totalFee),
  remainingFee: updatedRemaining,
});

};
const generatePDF = async () => {
  if (!invoiceRef.current) {
    console.log("Invoice ref missing");
    return;
  }

  const canvas = await html2canvas(
    invoiceRef.current,
    { scale: 2 }
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
    `installment-${fullName}.pdf`
  );
};

useEffect(() => {
  if (!invoiceData) return;

  const run = async () => {
    await generatePDF();
    alert("Receipt Generated ✅");
    navigate(-1);
  };

  run();
}, [invoiceData]);
if (!student) {
  return <p className="text-center mt-10">Loading...</p>;
}
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
              readOnly
              className="border w-full px-3 py-3 bg-gray-200 rounded-xl shadow-sm"
            />
          </div>

          <div>
            <label className="font-semibold">Next Installment</label>
            <input
              value={nextInstallment}
              onChange={(e) => setNextInstallment(e.target.value)}
              className="border w-full px-3 py-3 rounded-xl shadow-sm"
            />
          </div>

          <div>
            <label className="font-semibold">Remaining Fee</label>
            <input
              readOnly
              value={updatedRemaining}
              className="border w-full px-3 py-3 bg-gray-200 rounded-xl shadow-sm"
            />
          </div>

          <div>
            <label className="font-semibold">Department</label>
            <input
              readOnly
              value={dept.toUpperCase() || ""}
              className="border w-full px-3 py-3 bg-gray-200 rounded-xl shadow-sm"
            />
          </div>

          <div>
            <label className="font-semibold">Payment Mode</label>

            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="border w-full px-3 py-3 rounded-xl shadow-sm"
            >
              <option value="">Select Mode</option>
              <option value="Cash">Cash</option>
              <option value="online">Online</option>
            </select>
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

        <div
          ref={invoiceRef}
          style={{
            position: "fixed",
            left: "-9999px",
            top: 0,
            width: "900px",
          }}
        >
          {invoiceData && (
            <InstallmentInvoiceTemplate
              data={invoiceData}
            />
          )}        </div>

      </div>
    </div>
  );
}