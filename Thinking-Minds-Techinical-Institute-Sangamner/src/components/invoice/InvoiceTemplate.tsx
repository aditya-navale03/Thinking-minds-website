const InvoiceTemplate = ({ data }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white p-6 border text-sm">
      
      <h1 className="text-lg font-bold mb-2">FEE RECEIPT :</h1>

      <div className="flex justify-between mb-4">
        <div>
          <h2 className="font-bold text-base">Thinking Minds Techinical Training Instutute, Sangamner</h2> <br /><br />
          <p>opposite Amrutvahini College, Sangamner,</p>
          <p>Ghulewadi</p>
          <p>Maharashtra 422608</p>
          <p>Email: tminds2212@gmail.com</p>
          <p>CIVIL/Phone: +91 84129 78749 </p>
          <p>IT/Phone: +91 95524 95373</p>
        </div>



        <div className="text-right">
<img
  src="/receiptlogo.jpeg"
  className="h-60 w-60 object-contain"
  loading="eager"
/>
        </div>
      </div>

      <hr className="my-3" />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <h3 className="font-semibold">Billing To :</h3>
          <p className="font-medium">{data.studentName}</p>
          <p>{data.address || ""}</p>
          <p>{data.email || ""}</p>
          <p>{data.mobile}</p>
        </div>

        <div className="text-right">
  <p>
    <span className="font-semibold">Receipt No:</span> {data.receiptNo}
  </p>

  <p>
    <span className="font-semibold">Date:</span> {data.date}
  </p>

  <p>
    <span className="font-semibold">Payment Mode:</span> {data.paymentMode}
  </p>
</div>
      </div>

      <p className="mb-4">
        Dear <b>{data.studentName}</b>, Admission No. <b>{data.admissionNo}</b>, for the
        course <b>{data.course}</b>. Thank you for your payment.
        Below are the details of your transaction and fee summary.
      </p>

      <table className="w-full border text-center mb-4">
        <thead className="bg-gray-100">
          <tr>
            <th className="border p-2">Receipt No</th>
            <th className="border p-2">Date</th>
            <th className="border p-2">Tax</th>
            <th className="border p-2">Paid</th>
            <th className="border p-2">Total</th>
            <th className="border p-2">Due</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border p-2">{data.receiptNo}</td>
            <td className="border p-2">{data.date}</td>
            <td className="border p-2">0</td>
            <td className="border p-2">₹{data.feesPaid}</td>
            <td className="border p-2">₹{data.totalFee}</td>
            <td className="border p-2">₹{data.remainingFee}</td>
          </tr>
        </tbody>
      </table>

      <p className="mb-6 text-xs">All Tax included</p>

      <div className="flex justify-between mt-12">
        <div className="text-xs max-w-md">
          <p className="font-semibold mb-1">Terms and Conditions</p>
          <p>1. एकदा भरलेली कोर्स फी कोणत्याही कारणास्तव परत दिली जाणार नाही.</p>
          <p>2. विध्यार्थ्यांनी कोर्स कालावधीमध्ये येऊन आपला कोर्स पूर्ण करायचा आहे.</p>
          <p>3. अधिक माहितीसाठी संपर्क - +91 84129 78749 / +91 95524 95373</p>
        </div>

        <div className="text-right">
          <p className="font-semibold">Authorized Signature</p>
          <div className="h-16"></div>
        </div>
      </div>

      <p className="text-xs text-center mt-4">
        © This receipt is system generated.
      </p>
    </div>
  )
}

export default InvoiceTemplate
