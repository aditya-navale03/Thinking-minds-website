const InvoiceTemplate = ({ data }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white p-8 border shadow">
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
<img src="/logo.png" className="h-16 w-16 object-contain" loading="eager" />

          
          <div>
            <h1 className="text-2xl font-bold">Your Coaching Institute</h1>
            <p className="text-sm">IT & Civil Classes</p>
          </div>
        </div>

        <div className="text-right">
          <h2 className="text-xl font-semibold">FEE RECEIPT</h2>
          <p>Bill No: {data.invoiceNo}</p>
          <p>Date: {data.date}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Bill To:</h3>
          <p className="font-medium">{data.studentName}</p>
          <p>Course: {data.course}</p>
        </div>

        <div className="text-right">
          <h3 className="font-semibold">Institute:</h3>
          <p>Your Coaching Institute</p>
          <p>Address Line Here</p>
        </div>
      </div>

      <table className="w-full mt-6 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2 text-center">Sr No</th>
            <th className="border p-2">Description</th>
            <th className="border p-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2 text-center">1</td>
            <td className="border p-2">{data.course} Full Course Fees</td>
            <td className="border p-2 text-right">₹{data.totalFee}</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-6 flex justify-end">
        <div className="w-80 space-y-2 border p-4">
          <div className="flex justify-between">
            <span>Total Fees:</span>
            <span>₹{data.totalFee}</span>
          </div>

          <div className="flex justify-between">
            <span>First Installment Paid:</span>
            <span>₹{data.feesPaid}</span>
          </div>

          <div className="flex justify-between font-bold border-t pt-2">
            <span>Remaining Fees:</span>
            <span>₹{data.remainingFee}</span>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-between items-center">
        <p className="text-sm">Student Signature</p>
        <div className="text-right">
          <p className="font-semibold">For Your Coaching Institute</p>
          <p className="mt-8">Authorized Sign</p>
        </div>
      </div>
    </div>
  )
}

export default InvoiceTemplate
