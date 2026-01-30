import { useState, useRef } from "react"
import { toJpeg } from "html-to-image"
import InvoiceTemplate from "../components/invoice/InvoiceTemplate"

const CreateInvoice = () => {
  const invoiceRef = useRef()

  const [data, setData] = useState({
    studentName: "",
    course: "",
    amount: 0,
    invoiceNo: Math.floor(Math.random() * 100000),
    date: new Date().toLocaleDateString(),
    mobile: ""
  })

  const generateInvoiceImage = async () => {
    const dataUrl = await toJpeg(invoiceRef.current, { quality: 0.95 })
    const link = document.createElement("a")
    link.download = `invoice-${data.studentName}.jpg`
    link.href = dataUrl
    link.click()
  }

  const sendOnWhatsApp = () => {
    if (!data.mobile) {
      alert("Enter mobile number")
      return
    }
    const msg = "Your fees invoice"
    window.open(`https://wa.me/91${data.mobile}?text=${encodeURIComponent(msg)}`, "_blank")
  }

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input className="border p-2" placeholder="Student Name"
          onChange={e => setData({ ...data, studentName: e.target.value })} />

        <input className="border p-2" placeholder="Course (IT / Civil)"
          onChange={e => setData({ ...data, course: e.target.value })} />

        <input className="border p-2" type="number" placeholder="Fees Amount"
          onChange={e => setData({ ...data, amount: Number(e.target.value) })} />

        <input className="border p-2" placeholder="Mobile Number"
          onChange={e => setData({ ...data, mobile: e.target.value })} />
      </div>

      <div ref={invoiceRef}>
        <InvoiceTemplate data={data} />
      </div>

      <div className="flex gap-4">
        <button
          onClick={generateInvoiceImage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Generate Invoice JPG
        </button>

        <button
          onClick={sendOnWhatsApp}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Send on WhatsApp
        </button>
      </div>
    </div>
  )
}

export default CreateInvoice
