import { db } from "../firebase/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  DocumentData,
} from "firebase/firestore";

export async function migrateStudents(): Promise<void> {
  try {
    const departments: string[] = ["it", "civil"];

    for (const dept of departments) {
      const oldRef = collection(db, "students", dept, "students");
      const snapshot = await getDocs(oldRef);

      console.log("Migrating:", dept);

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data() as DocumentData;

        const newRef = collection(db, "students");

        // 🔍 Check duplicate using email
        const q = query(newRef, where("email", "==", data.email));
        const existing = await getDocs(q);

        if (existing.empty) {
          await addDoc(newRef, {
            ...data,
            department: dept.toUpperCase(),
          });

          console.log("Moved:", data.email);
        } else {
          console.log("Skipped:", data.email);
        }
      }
    }

    console.log("✅ Migration Completed");
  } catch (error) {
    console.error("❌ Migration error:", error);
  }
}