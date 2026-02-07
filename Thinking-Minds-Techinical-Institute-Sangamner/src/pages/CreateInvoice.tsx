import { useState, useRef, useEffect } from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import InvoiceTemplate from "../components/invoice/InvoiceTemplate"
import { generateReceiptNumber } from "../utils/generateReceiptNumber"

import { db } from "../firebase/firebaseConfig"
import { collection, addDoc } from "firebase/firestore"

const CreateInvoice = () => {
  const invoiceRef = useRef<HTMLDivElement | null>(null)

  const [data, setData] = useState({
    studentName: "",
    course: "",
    totalFee: 0,
    feesPaid: 0,
    remainingFee: 0,
    date: new Date().toLocaleDateString("en-GB"),
    mobile: "",
    receiptNo: ""
  })

  const getDepartment = () =>
    data.course.toUpperCase().includes("IT")
      ? "IT"
      : "CIVIL"

  // 🔹 Generate + Save receipt
  const generateReceipt = async () => {
    if (!data.course) {
      alert("Enter course (IT or CIVIL)")
      return
    }

    const department = getDepartment()

    // 1️⃣ Generate number
    const receiptNo =
      await generateReceiptNumber(department)

    // 2️⃣ Save in Firestore
    await addDoc(collection(db, "receipts"), {
      studentName: data.studentName,
      course: data.course,
      totalFee: data.totalFee,
      feesPaid: data.totalFee,
      remainingFee: 0,
      mobile: data.mobile,
      receiptNo,
      department,
      date: new Date()
    })

    // 3️⃣ Update UI
    setData(prev => ({
      ...prev,
      receiptNo,
      feesPaid: prev.totalFee,
      remainingFee: 0
    }))
  }

  // 🔹 Print after receipt generated
  useEffect(() => {
  if (!data.receiptNo || !invoiceRef.current) return

  const generatePDF = async () => {
    const canvas = await html2canvas(
      invoiceRef.current,
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

    pdf.save(`receipt-${data.receiptNo}.pdf`)
  }

  generatePDF()
}, [data.receiptNo])

  return (
    <div className="p-6 space-y-6">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          className="border p-2"
          placeholder="Student Name"
          onChange={e =>
            setData({
              ...data,
              studentName: e.target.value
            })
          }
        />

        <input
          className="border p-2"
          placeholder="Course (IT / CIVIL)"
          onChange={e =>
            setData({
              ...data,
              course: e.target.value
            })
          }
        />

        <input
          className="border p-2"
          type="number"
          placeholder="Total Fee"
          onChange={e =>
            setData({
              ...data,
              totalFee: Number(e.target.value)
            })
          }
        />

        <input
          className="border p-2"
          placeholder="Mobile Number"
          onChange={e =>
            setData({
              ...data,
              mobile: e.target.value
            })
          }
        />
      </div>

      <div
  ref={invoiceRef}
  style={{
    position: "fixed",
    left: "-9999px",
    top: 0,
    width: "900px"
  }}
>
  <InvoiceTemplate data={data} />
</div>


      <button
        onClick={generateReceipt}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Generate Receipt PDF
      </button>

    </div>
  )
}

export default CreateInvoice
