import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

export async function migrateAllDepartments() {
  const departments = ["it", "civil"];

  for (const deptId of departments) {
    // Old department document
    const deptRef = doc(db, "students", deptId);

    const snap = await getDoc(deptRef);

    if (!snap.exists()) {
      console.log(`No data in ${deptId}`);
      continue;
    }

    const data = snap.data();
    const studentsArray = data.students || [];

    console.log(
      `Migrating ${studentsArray.length} students from ${deptId}`
    );

    for (const student of studentsArray) {
      const emailId = student.email.toLowerCase();

      // ✅ Correct subcollection path
      const newStudentRef = doc(
        db,
        "students",
        deptId,
        "students",
        emailId
      );

      await setDoc(newStudentRef, student, { merge: true });

      console.log(`Migrated: ${emailId}`);
    }

    console.log(`✅ ${deptId} migration done`);
  }

  console.log("🎉 All migration completed");
}
