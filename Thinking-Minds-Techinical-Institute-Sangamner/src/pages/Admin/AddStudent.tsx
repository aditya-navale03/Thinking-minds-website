// ------------------------------------------------------
// ADD STUDENT PAGE (Firebase Version — CLEAN, CORRECT & RESPONSIVE)
// ------------------------------------------------------
import imageCompression from "browser-image-compression";
import { useState, FormEvent } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../components/ui/button";
import SuccessScreen from "../../components/ui/SuccessScreen";
import { courses } from "../../data/courses";
import BackButton from "../../components/ui/backbutton";


//imports for invoice template generator
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { useRef } from "react"
import InvoiceTemplate from "../../components/invoice/InvoiceTemplate"


import { doc, setDoc, arrayUnion } from "firebase/firestore";

// const CLOUDINARY_CLOUD_NAME = "deqklavmi"; 
// const CLOUDINARY_UPLOAD_PRESET = "students"; // UNSIGNED preset name



// Firebase
import { db, storage } from "../../firebase/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
//import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

//recept
import { generateReceiptNumber } from "../../utils/generateReceiptNumber";


interface FormErrors {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  dob?: string;
  email?: string;
  course?: string;
  totalFee?: string;
  firstInstallment?: string;
  paymentMode?: string;
  mobile?: string;
  aadhar?: string;
}

export default function AddStudent() {


  // invoice
  const invoiceRef = useRef<HTMLDivElement>(null)
  const [invoiceData, setInvoiceData] = useState<any>(null)


  //payment mode
  const [paymentMode, setPaymentMode] = useState<"Cash" | "Online">("Cash");


  const navigate = useNavigate();
  const location = useLocation();
  const department = location.state?.dept || "";

  // ---------------- STATES ----------------
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");

  const [dob, setDob] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");

  const [aadhar, setAadhar] = useState("");
  const [mobile, setMobile] = useState("");

  const [totalFee, setTotalFee] = useState("");
  const [firstInstallment, setFirstInstallment] = useState("");
  const [remainingFee, setRemainingFee] = useState("");

  const [rollNo, setRollNo] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);


  
  // ---------------- HELPERS ----------------
  const formatIndianNumber = (num: string) => {
    const s = String(num || "").replace(/\D/g, "");
    if (!s) return "";
    if (s.length <= 3) return s;

    const last3 = s.slice(-3);
    let other = s.slice(0, -3);
    other = other.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    return `${other},${last3}`;
  };

//course option
const courseOptions = courses
  .filter((c) => c.category.toLowerCase() === department.toLowerCase())
  .map((c) => c.name.toUpperCase());


  const updateRemainingFee = (total: string, first: string) => {
    const totalValue = Number(total.replace(/,/g, "") || 0);
    const firstValue = Number(first.replace(/,/g, "") || 0);

    let remaining = totalValue - firstValue;
    if (remaining < 0) remaining = 0;

    setRemainingFee(formatIndianNumber(String(remaining)));
  };
const [filteredCourses, setFilteredCourses] = useState<string[]>(courseOptions);

  const getAadhar4 = (aad: string) => aad.replace(/\D/g, "").slice(0, 4);

  const generateRollNoValue = (f: string, aad: string, l: string, dept?: string) => {
  const first = f.trim().charAt(0)?.toUpperCase() || "";
  const last = l.trim().charAt(0)?.toUpperCase() || "";
  const aad4 = getAadhar4(aad);

  if (!(first && last && aad4.length === 4)) return "";

  let prefix = "";
  if (dept?.toLowerCase() === "it") prefix = "IT/";
  else if (dept?.toLowerCase() === "civil") prefix = "CIVIL/";

  return `${prefix}${first}${aad4}${last}`;
};

  const updateRollNo = (f: string, aad: string, l: string) => {
  setRollNo(generateRollNoValue(f, aad, l, department));
};

  // ---------------- IMAGE HANDLING ----------------
  const handlePhoto = (file: File | null) => {
    setPhoto(file);
    setPhotoPreview(file ? URL.createObjectURL(file) : "");
  };

  async function compressImage(file: File) {
    const options = {
      maxSizeMB: 0.07,
      maxWidthOrHeight: 900,
      maxIteration: 10,
      initialQuality: 0.6,
      useWebWorker: true
    };

    try {
      const compressed = await imageCompression(file, options);
      if (compressed.size > 75 * 1024) {
        return await imageCompression(compressed, {
          maxSizeMB: 0.06,
          maxWidthOrHeight: 800,
          useWebWorker: true
        });
      }
      return compressed;
    } catch {
      return file;
    }
  }


  // ---------------- VALIDATE ----------------
  const validate = () => {
    const temp: FormErrors = {};

    //payment
    if (!paymentMode) temp.paymentMode = "Payment mode required";


    if (!firstName.trim()) temp.firstName = "First name required";

    // ⭐ Middle Name validation added
    if (middleName && !/^[A-Za-z ]+$/.test(middleName))
      temp.middleName = "Only letters allowed";

    if (!lastName.trim()) temp.lastName = "Last name required";

    if (!dob.trim()) temp.dob = "DOB required";
// EMAIL VALIDATION
if (!email.trim()) {
  temp.email = "Email required";
} else {
  if (email !== email.toLowerCase()) {
    temp.email = "Email must be lowercase";
  }

  const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;

  if (!emailRegex.test(email)) {
    temp.email = "Invalid email format";
  }
}
    if (!course.trim()) temp.course = "Course required";
    if (!totalFee.trim()) temp.totalFee = "Total fee required";

    if (mobile && mobile.length !== 10) temp.mobile = "Mobile must be 10 digits";

    if (aadhar && aadhar.replace(/\D/g, "").length !== 12)
      temp.aadhar = "Aadhaar must be 12 digits";

    const first = Number(firstInstallment.replace(/,/g, "") || 0);
    const total = Number(totalFee.replace(/,/g, "") || 0);

    if (first > total)
      temp.firstInstallment = "Installment cannot exceed Total Fee";

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  // ---------------- SUBMIT ----------------
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // ✔ Stop here if validation fails
  if (!validate()) return;

  setLoading(true);

  console.log("VALIDATION PASSED");
  console.log("START SUBMIT");

  // ---------------- COMPUTE VALUES ----------------
  const feeValue = Number(totalFee.replace(/,/g, "") || 0);
  const firstInstall = Number(firstInstallment.replace(/,/g, "") || 0);

  const fullName = `${firstName} ${middleName} ${lastName}`
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();

  const finalRollNo =
    rollNo || generateRollNoValue(firstName, aadhar, lastName, department);

// 🔢 Generate Receipt Number
const dept =
  department.toUpperCase().includes("IT") ? "IT" : "CIVIL";

const receiptNo = await generateReceiptNumber(dept);

    //the sample code for uploading to firebase section wise

await setDoc(
  doc(db, "students", department.toLowerCase()),
  {
    students: arrayUnion({
  rollNo: finalRollNo,
  fullName,
  dob,
  email: email.toLowerCase(),
  course: course.toUpperCase(),
  aadhar: aadhar.replace(/\D/g, ""),
  mobile,
  totalFee: feeValue,
  firstInstallment: firstInstall,
  remainingFee: Math.max(0, feeValue - firstInstall),
  feePaid: firstInstall,
  paymentMode,
  receiptNo,        // 👈 ADD THIS
  photoURL: ""
})
  },
  { merge: true }
);


  // // ---------------- SAVE TO FIRESTORE ----------------
  // await addDoc(collection(db, "students"), {
  //   id: Date.now(),
  //   rollNo: finalRollNo,
  //   fullName: fullName,
  //   dob,
  //   email: email.toLowerCase(),
  //   course: course.toUpperCase(),
  //   department,
  //   aadhar: aadhar.replace(/\D/g, ""),
  //   mobile,
  //   totalFee: feeValue,
  //   firstInstallment: firstInstall,
  //   remainingFee: feeValue - firstInstall < 0 ? 0 : feeValue - firstInstall,
  //   feePaid: firstInstall,
  //   photoURL: "", //photoURL,
  // });

  console.log("Student saved successfully!");

  // ❌ remove alert and navigate
  // ❌ remove page redirect


  //invoice
 const invoicePayload = {
  studentName: fullName,
  email,
  mobile,
  course,
  admissionNo: finalRollNo,
  totalFee: feeValue,
  feesPaid: firstInstall,
  remainingFee: feeValue - firstInstall,
  receiptNo,
  date: new Date().toLocaleDateString("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric"
}),

  paymentMode
}



generateAndSendInvoice(invoicePayload)


  // ✔ show success popup
  setShowSuccess(true);

  setLoading(false);
};


//invoice
const generateAndSendInvoice = async (student: any) => {
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
Enrollment No : ${student.admissionNo}
Course : ${student.course}
Total Course Fee : ₹${student.totalFee}/-

Please submit your Passport Size Photo & Aadhar Card Xerox at the institute office.

Thanks & Regards,
THINKING MINDS TECHNICAL TRAINING INSTITUTE
`

      window.open(
        `https://wa.me/91${student.mobile}?text=${encodeURIComponent(msg)}`,
        "_blank"
      )
    } catch (err) {
      console.error("IMAGE ERROR:", err)
      alert("Invoice image generation failed")
    }
  }, 800)
}



  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gray-100 px-3 py-6 md:px-6">
      
      <div className="max-w-6xl mx-auto mb-3">
  <BackButton />
</div>

      
      <h1 className="text-2xl md:text-3xl font-bold text-center mb-6">
        Add Student ({department.toUpperCase()})
      </h1>

      <form
        onSubmit={handleSubmit}
        className="
          max-w-6xl mx-auto 
          grid grid-cols-1 
          sm:grid-cols-2 
          lg:grid-cols-3 
          gap-4 p-4 bg-white shadow rounded-xl
        "
      >
        {/* BASIC FIELDS */}
        <div>
          {errors.firstName && (
            <p className="text-red-600 text-sm">{errors.firstName}</p>
          )}
          <label>First Name</label>
          <input
            value={firstName}
            onChange={(e) => {
              const v = e.target.value;
              if (/^[A-Za-z ]*$/.test(v)) {
                setFirstName(v.toUpperCase());
                updateRollNo(v, aadhar, lastName);
              }
            }}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          {errors.middleName && (
            <p className="text-red-600 text-sm">{errors.middleName}</p>
          )}
          <label>Middle Name</label>
          <input
            value={middleName}
            onChange={(e) => {
              const v = e.target.value;
              if (/^[A-Za-z ]*$/.test(v)) setMiddleName(v.toUpperCase());

            }}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          {errors.lastName && (
            <p className="text-red-600 text-sm">{errors.lastName}</p>
          )}
          <label>Last Name</label>
          <input
            value={lastName}
            onChange={(e) => {
              const v = e.target.value;
              if (/^[A-Za-z ]*$/.test(v)) {
                setLastName(v.toUpperCase());
                updateRollNo(firstName, aadhar, v);
              }
            }}
            className="w-full border px-3 py-2 rounded"
          />
        </div>


        {/* ---------------- REST OF YOUR CODE CONTINUES BELOW WITHOUT CHANGE ---------------- */}
        {/* DOB */}
        <div>
          {errors.dob && <p className="text-red-600 text-sm">{errors.dob}</p>}
          <label>DOB (DD-MM-YYYY)</label>
          <input
            value={dob}
            onChange={(e) => {
              let input = e.target.value.replace(/[^\d-]/g, "");
              if (input.length === 2 && dob.length === 1) input += "-";
              if (input.length === 5 && dob.length === 4) input += "-";
              if (input.length <= 10) setDob(input);
            }}
            placeholder="DD-MM-YYYY"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* EMAIL */}
        <div>
          {errors.email && (
            <p className="text-red-600 text-sm">{errors.email}</p>
          )}
          <label>Email</label>
          <input
            value={email}
        onChange={(e) => {
  const value = e.target.value.toLowerCase();
  setEmail(value);

  // LIVE VALIDATION
const emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.(com|in|org|net|edu|gov)$/;

  setErrors((prev) => ({
    ...prev,
    email:
      !value.trim()
        ? "Email required"
        : !emailRegex.test(value)
        ? "Invalid email format"
        : undefined
  }));
}}


            className="w-full border px-3 py-2 rounded"
          />
        </div>

  {/* COURSE */}
<div className="relative">
  {errors.course && (
    <p className="text-red-600 text-sm mb-1">{errors.course}</p>
  )}

  <label>Course</label>

  <input
    type="text"
    value={course}
    onFocus={() => {
      setShowDropdown(true);     // 👉 dropdown opens ONLY when clicked
      setFilteredCourses(courseOptions);
    }}
    onChange={(e) => {
      const v = e.target.value;
      setCourse(v.toUpperCase());

      const filtered = courseOptions.filter((c) =>
        c.toLowerCase().includes(v.toLowerCase())
      );
      setFilteredCourses(filtered);

      setShowDropdown(true);     // 👉 typing also shows dropdown

      setErrors((prev) => ({
        ...prev,
        course:
          v.trim() === ""
            ? "Course required"
            : courseOptions.includes(v.toUpperCase())
            ? ""
            : "Please select a valid course",
      }));
    }}
    onKeyDown={(e) => {
  if (e.key === "Enter" && filteredCourses.length === 1) {
    setCourse(filteredCourses[0]);
    setFilteredCourses([]);
    setShowDropdown(false);
  }
}}

    placeholder="Type or select a course"
    className="w-full border px-3 py-2 rounded"
  />

  {/* DROPDOWN */}
  {showDropdown && filteredCourses.length > 0 && (
    <div className="absolute z-50 w-full border bg-white rounded shadow-md mt-1 max-h-40 overflow-y-auto">
      {filteredCourses.map((c) => (
        <div
          key={c}
          onClick={() => {
            setCourse(c);
            setFilteredCourses([]);
            setShowDropdown(false); // close after selection
          }}
          className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
        >
          {c}
        </div>
      ))}
    </div>
  )}
</div>

        {/* TOTAL FEE */}
        <div>
          {errors.totalFee && (
            <p className="text-red-600 text-sm">{errors.totalFee}</p>
          )}
          <label>Total Fee</label>
          <input
            value={totalFee}
            onChange={(e) => {
              const raw = e.target.value.replace(/,/g, "");
              if (!/^\d*$/.test(raw)) return;

              const formatted = formatIndianNumber(raw);
              setTotalFee(formatted);
              updateRemainingFee(formatted, firstInstallment);

              if (
                Number(firstInstallment.replace(/,/g, "")) <= Number(raw)
              ) {
                setErrors((prev) => ({
                  ...prev,
                  firstInstallment: undefined,
                }));
              }
            }}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* AADHAAR */}
        <div>
          <label>Aadhaar Number</label>
          {errors.aadhar && (
            <p className="text-red-600 text-sm">{errors.aadhar}</p>
          )}
          <input
            value={aadhar.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim()}
            maxLength={14}
            onChange={(e) => {
              const raw = e.target.value.replace(/\D/g, "");
              if (raw.length <= 12) {
                setAadhar(raw);
                updateRollNo(firstName, raw, lastName);
              }
            }}
            className="w-full border px-3 py-2 rounded tracking-wider"
          />
        </div>


        {/* MOBILE */}
        <div>
          <label>Mobile Number</label>
          {errors.mobile && (
            <p className="text-red-600 text-sm">{errors.mobile}</p>
          )}
          <input
            value={mobile}
            maxLength={10}
            onChange={(e) => {
              const v = e.target.value;
              if (/^\d*$/.test(v)) setMobile(v);
            }}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* FIRST INSTALLMENT */}
        <div>
          {errors.firstInstallment && (
            <p className="text-red-600 text-sm">{errors.firstInstallment}</p>
          )}
          <label>First Installment</label>
          <input
            value={firstInstallment}
            onChange={(e) => {
              const raw = e.target.value.replace(/,/g, "");
              if (!/^\d*$/.test(raw)) return;

              const formatted = formatIndianNumber(raw);
              setFirstInstallment(formatted);
              updateRemainingFee(totalFee, formatted);

              const total = Number(totalFee.replace(/,/g, "") || 0);
              const first = Number(raw || 0);

              if (first > total) {
                setErrors((prev) => ({
                  ...prev,
                  firstInstallment: "Installment cannot exceed Total Fee",
                }));
              } else {
                setErrors((prev) => ({
                  ...prev,
                  firstInstallment: undefined,
                }));
              }
            }}
            className="w-full border px-3 py-2 rounded"
          />
 </div>

{/* PAYMENT MODE + REMAINING FEE (SIDE BY SIDE) */}
<div>
  {errors.paymentMode && (
    <p className="text-red-600 text-sm">{errors.paymentMode}</p>
  )}
  <label>Payment Mode</label>
  <select
    value={paymentMode}
    onChange={(e) =>
      setPaymentMode(e.target.value as "Cash" | "Online")
    }
    className="w-full border px-3 py-2 rounded"
  >
    <option value="Cash">Cash</option>
    <option value="Online">Online</option>
  </select>
</div>

<div>
  <label>Remaining Fee</label>
  <input
    value={remainingFee}
    readOnly
    className="w-full border px-3 py-2 rounded bg-gray-100"
  />
</div>

          

  {/* DEPARTMENT */}
<div>
  <label>Department</label>
  <input
    value={department}
    disabled
    className="w-full border px-3 py-2 rounded bg-gray-200"
  />
</div>

{/* ROLL NUMBER */}
<div>
  <label>Roll Number</label>
  <input
    value={rollNo}
    readOnly
    className="w-full border px-3 py-2 rounded bg-gray-100"
  />
</div>




{/* new code  */}
{/* AUTO-GENERATED / FIXED FIELDS (Always at bottom) */}
<div className="col-span-1 sm:col-span-2 lg:col-span-3 
                grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">


  {/* Student Photo */}
  <div>
    <label>Student Photo</label>

    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file) handlePhoto(file);
      }}
      className={`
        border-2 border-dashed p-4 rounded text-center cursor-pointer 
        ${isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
      `}
    >
      {!photoPreview ? (
        <p className="text-gray-600">Drag & Drop Only</p>
      ) : (
        <img
          src={photoPreview}
          className="w-28 h-28 object-cover rounded mx-auto"
        />
      )}
    </div>

    <input
      id="photoInput"
      type="file"
      accept="image/*"
      className="hidden"
      onChange={(e) => handlePhoto(e.target.files?.[0] || null)}
    />
  </div>

</div>


        {/* BUTTONS */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-3 flex justify-center gap-4 mt-3">
          <Button
            type="submit"
            className="bg-blue-700 text-white px-8 py-2"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Submit"}
          </Button>

          <Button
            type="button"
            className="bg-gray-600 text-white px-6 py-2"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>

          
        </div>
     </form>

{/* SUCCESS POPUP */}
{showSuccess && (
  <SuccessScreen
    title="Student Added!"
    message="The student record has been successfully saved."
    buttonText="OK"
    onClose={() => setShowSuccess(false)}
  />
)}
{invoiceData && (
  <div style={{ position: "fixed", left: "-9999px", top: 0 }}>
    <div ref={invoiceRef}>
      <InvoiceTemplate data={invoiceData} />
    </div>
  </div>
)}



</div>

  );
  }
