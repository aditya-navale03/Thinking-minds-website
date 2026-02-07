import { doc, runTransaction } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"

export const generateReceiptNumber = async (
  department: "IT" | "CIVIL"
) => {
  console.log("COUNTER FUNCTION CALLED:", department) // 👈 ADD

  const year = new Date().getFullYear()
  const docId = `${department}_${year}`
  const counterRef = doc(db, "counters", docId)

  const receiptNo = await runTransaction(db, async (transaction) => {
    console.log("TRANSACTION STARTED") // 👈 ADD

    const snap = await transaction.get(counterRef)

    const last = snap.exists()
      ? snap.data().lastReceiptNo
      : 0

    const next = last + 1

    transaction.set(
      counterRef,
      { lastReceiptNo: next },
      { merge: true }
    )

    console.log("COUNTER UPDATED:", next) // 👈 ADD

    return next
  })

  return `${
    department === "IT" ? "IT" : "CIV"
  }-${year}-${String(receiptNo).padStart(3, "0")}`
}
