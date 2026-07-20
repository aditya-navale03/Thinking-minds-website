import { Button } from "../../components/ui/button";

import {
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../../firebase/firebaseConfig";

export default function MigrateRollNo() {

  const migrateRollNo = async () => {
    try {
      const studentsSnapshot =
        await getDocs(
          collection(db, "students")
        );

      let updated = 0;
      let skipped = 0;

      for (const studentDoc of studentsSnapshot.docs) {

        const studentData =
          studentDoc.data();

        const profileRef = doc(
          db,
          "studentProfiles",
          studentDoc.id
        );

        const profileSnap =
          await getDoc(profileRef);

        // student profile missing
        if (!profileSnap.exists()) {
          skipped++;
          continue;
        }

        // already migrated
        if (
          profileSnap.data().rollNo
        ) {
          skipped++;
          continue;
        }

        await updateDoc(
          profileRef,
          {
            rollNo:
              studentData.rollNo || "",
          }
        );

        updated++;
      }

      alert(
        `Migration Completed

Updated : ${updated}
Skipped : ${skipped}`
      );

    } catch (error) {
      console.error(error);

      alert(
        "Migration failed."
      );
    }
  };

  return (
    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-slate-950
    ">
      <div className="
        bg-slate-900
        p-10
        rounded-3xl
        border
        border-slate-800
        text-center
        space-y-6
      ">

        <h1 className="
          text-3xl
          font-bold
          text-white
        ">
          Roll Number Migration
        </h1>

        <p className="text-slate-400">
          This will copy roll numbers
          from students to
          studentProfiles.
        </p>

        <Button
          onClick={migrateRollNo}
          className="
            bg-green-600
            hover:bg-green-700
            text-white
          "
        >
          Start Migration
        </Button>

      </div>
    </div>
  );
}