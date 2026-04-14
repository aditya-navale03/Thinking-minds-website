import { useState } from "react";
import { Button } from "../../components/ui/button";
import { migrateStudents } from "../../utils/migrateStudents";

export default function MigrateStudents() {
  const [loading, setLoading] = useState<boolean>(false);

  const handleMigration = async (): Promise<void> => {
    const confirmRun = window.confirm(
      "Are you sure? This will migrate data."
    );
    if (!confirmRun) return;

    setLoading(true);
    await migrateStudents();
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Students Migration Panel
      </h1>

      <p className="mb-4 text-gray-600">
        Run this once to convert old array students into document format.
      </p>

      <Button
      
        onClick={handleMigration}
        disabled={loading}
        className="bg-red-600 text-white px-6 py-2"
      >
        {loading ? "Migrating..." : "Migrate Old Students"}
      </Button>
    </div>
  );
}