import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";
import { Bell } from "lucide-react";


// dashboard
import { LayoutDashboard } from "lucide-react";


import { Button } from "../../components/ui/button";
import { UserPlus, UserMinus, LogOut, Users } from "lucide-react";

export default function CivilAdminDashboard() {
  const navigate = useNavigate();

  // 🔒 CHECK IF ADMIN DEPARTMENT = "civil"
  useEffect(() => {
    const dept = localStorage.getItem("admin_department");

    if (!dept) {
      alert("You must login first!");
      navigate("/admin");
      return;
    }

    if (dept !== "civil") {
      alert("Access denied! You are not a Civil admin.");
      navigate("/admin");
    }
  }, [navigate]);

  // 🔴 LOGOUT FUNCTION
  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem("admin_department");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">

        <h1 className="text-xl font-semibold text-center mb-6 text-gray-800">
          Civil Admin Dashboard
        </h1>

        <div className="flex flex-col gap-4">

          {/* Add Student */}
          <Button
            className="w-full py-3 text-base flex items-center justify-center gap-3
                       bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl shadow-sm"
            onClick={() =>
              navigate("/admin/add-student", { state: { dept: "civil" } })
            }
          >
            <UserPlus size={20} /> Add Student
          </Button>

          {/* View Civil Students */}
          <Button
          disabled
            className="w-full py-3 text-base flex items-center justify-center gap-3
                       bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl shadow-sm"
            onClick={() => navigate("/admin/students/civil")}
          >
            <Users size={20} /> View Civil Students(Under Maintainance)
          </Button>

          {/* Remove Student */}
          <Button
            className="w-full py-3 text-base flex items-center justify-center gap-3
                       bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl shadow-sm"
            onClick={() =>
              navigate("/admin/remove-student", { state: { dept: "civil" } })
            }
          >
            <UserMinus size={20} /> Remove Student
          </Button>
              

            {/* reminder */}
            

          {/* dashboard */}
          <Button
className="w-full py-3 text-base flex items-center justify-center gap-3
bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl shadow-sm"
onClick={() => navigate("/admin/dashboard", { state: { dept: "civil" } })}

>

<LayoutDashboard size={20} /> Dashboard Analytics </Button>

            {/* reminder */}
         <Button
  className="w-full py-3 text-base flex items-center justify-center gap-3
             bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl shadow-sm"
  onClick={() =>
    navigate("/admin/reminders", { state: { dept: "civil" } })
  }
>
  <Bell size={20} /> All Students Fee Reminders
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
