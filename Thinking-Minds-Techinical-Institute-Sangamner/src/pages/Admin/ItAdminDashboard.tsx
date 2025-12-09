import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";

import { Button } from "@/components/ui/button";
import { UserPlus, UserMinus, LogOut, Users } from "lucide-react";

export default function ITAdminDashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">

        <h1 className="text-xl font-semibold text-center mb-6 text-gray-800">
          IT Admin Dashboard
        </h1>

        <div className="flex flex-col gap-4">

          {/* Add Student */}
          <Button
            className="w-full py-3 text-base flex items-center justify-center gap-3
                       bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl shadow-sm"
            onClick={() =>
              navigate("/admin/add-student", { state: { dept: "it" } })
            }
          >
            <UserPlus size={20} /> Add Student
          </Button>

          {/* View IT Students */}
          <Button
            className="w-full py-3 text-base flex items-center justify-center gap-3
                       bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl shadow-sm"
            onClick={() => navigate("/admin/students/it")}
          >
            <Users size={20} /> View IT Students
          </Button>

          {/* Remove Student */}
          <Button
            className="w-full py-3 text-base flex items-center justify-center gap-3
                       bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl shadow-sm"
            onClick={() =>
              navigate("/admin/remove-student", { state: { dept: "it" } })
            }
          >
            <UserMinus size={20} /> Remove Student
          </Button>

          {/* Logout */}
          <Button
            className="w-full py-3 text-base flex items-center justify-center gap-3
                       bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm"
            onClick={handleLogout}
          >
            <LogOut size={20} /> Logout
          </Button>

        </div>
      </div>
    </div>
  );
}
