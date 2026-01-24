const InvoiceTemplate = ({ data }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 shadow-lg border">
      <div className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold">Your Coaching Institute</h1>
          <p className="text-sm">IT & Civil Classes</p>
          <p className="text-sm">GSTIN: 27XXXXXXXXXX</p>
        </div>
        <div className="text-right">
          <h2 className="text-xl font-semibold">TAX INVOICE</h2>
          <p>Invoice No: {data.invoiceNo}</p>
          <p>Date: {data.date}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-semibold">Bill To:</h3>
          <p>{data.studentName}</p>
          <p>Course: {data.course}</p>
        </div>
        <div>
          <h3 className="font-semibold">Institute Details:</h3>
          <p>Your Coaching Institute</p>
          <p>Address Line Here</p>
        </div>
      </div>

      <table className="w-full mt-6 border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">#</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2 text-center">1</td>
            <td className="border p-2">{data.course} Fees</td>
            <td className="border p-2 text-right">₹{data.amount}</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-4 flex justify-end">
        <div className="w-64 space-y-2">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span>₹{data.amount}</span>
          </div>
          <div className="flex justify-between">
            <span>CGST (9%):</span>
            <span>₹{(data.amount * 0.09).toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>SGST (9%):</span>
            <span>₹{(data.amount * 0.09).toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold border-t pt-2">
            <span>Total:</span>
            <span>
              ₹{(data.amount + data.amount * 0.18).toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-between items-center">
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
