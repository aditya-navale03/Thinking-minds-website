import { useState } from "react"
import InvoiceTemplate from "../components/invoice/InvoiceTemplate"

const CreateInvoice = () => {
  const [data, setData] = useState({
    studentName: "",
    course: "",
    amount: 0,
    invoiceNo: Math.floor(Math.random() * 100000),
    date: new Date().toLocaleDateString()
  })

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input className="border p-2" placeholder="Student Name"
          onChange={e => setData({ ...data, studentName: e.target.value })} />

        <input className="border p-2" placeholder="Course (IT / Civil)"
          onChange={e => setData({ ...data, course: e.target.value })} />

        <input className="border p-2" type="number" placeholder="Fees Amount"
          onChange={e => setData({ ...data, amount: Number(e.target.value) })} />
      </div>

      <InvoiceTemplate data={data} />

      <div className="flex gap-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Save to Firebase
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Print Invoice
        </button>
      </div>
    </div>
  )
}

export default CreateInvoice
