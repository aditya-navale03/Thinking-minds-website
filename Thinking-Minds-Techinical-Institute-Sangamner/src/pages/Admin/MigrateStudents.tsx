import { Button } from "../../components/ui/button";
import { migrateAllDepartments } from "../../utils/migrateStudents";

export default function MigrateStudents() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Students Migration Panel
      </h1>

      <p className="mb-4 text-gray-600">
        Run this once to convert old array students into
        document format.
      </p>

      <Button
        onClick={migrateAllDepartments}
        className="bg-red-600 text-white px-6 py-2"
      >
        Migrate Old Students
      </Button>
    </div>
  );
}
