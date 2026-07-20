import { useState, FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import BackButton from "../../components/ui/backbutton";

import { Eye, EyeOff } from "lucide-react";


function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  //show password
  const [showPassword, setShowPassword] = useState<boolean>(false);


  const loginAdmin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Authenticate
      await signInWithEmailAndPassword(auth, email, password);

      // Fetch role
      const emailId = email.trim().toLowerCase();
      const ref = doc(db, "Roles", emailId);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        alert("Admin role not found in Firestore");
        setLoading(false);
        return;
      }

      const role = snap.data().role?.toLowerCase().trim();
      console.log("Firestore Role:", role);

      if (!role) {
        alert("No role found");
        setLoading(false);
        return;
      }

      console.log("Logged in admin role:", role);

      // ✅ Save department for dashboard protection
      localStorage.removeItem("admin_department");
localStorage.setItem("admin_department", role.toLowerCase());
      console.log(
  "Saved Department:",
  localStorage.getItem("admin_department")
);

      // ✅ Redirect only ONCE
      navigate(`/admin/dashboard-${role}`);

    } catch (error) {
      if (error instanceof Error) {
        alert("Login failed: " + error.message);
      } else {
        alert("Unknown error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-4">     
<div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900/80 backdrop-blur-xl shadow-2xl p-8">
        <BackButton className="mb-6" />
<div className="text-center mb-8">

    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
        TM
    </div>

    <h2 className="text-3xl font-bold text-white mt-5">
        Welcome Back
    </h2>

    <p className="text-slate-400 mt-2">
        Sign in to your admin account
    </p>

</div>

        <form onSubmit={loginAdmin} className="space-y-5">
          <div>
            <label className="block text-slate-300 mb-2 font-medium">Email</label>
            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
             className="w-full h-12 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 px-4 focus:outline-none focus:ring-2 focus:ring-violet-500"
              required
            />
          </div>

          <div>
  <label className="block text-slate-300 mb-2 font-medium"></label><label className="block text-gray-700 mb-1">Password</label>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      placeholder="Enter password"
      value={password}
      onChange={(e) => setPassword(e.currentTarget.value)}
    className="w-full h-12 rounded-xl border border-slate-700 bg-slate-800 text-white placeholder:text-slate-500 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-violet-500"
      required
    />

    <button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-4 top-3 text-slate-400 hover:text-white transition"
>
  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
  </button>
  </div>
</div>

          <button
            type="submit"
            disabled={loading}
className="
w-full
h-12
rounded-xl
bg-gradient-to-r
from-violet-600
to-blue-600
hover:from-violet-500
hover:to-blue-500
text-white
font-semibold
shadow-lg
transition-all
duration-300
hover:scale-[1.02]
"          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-8 text-center text-slate-500 text-sm">
    Powered by
    <span className="text-violet-400 font-semibold">
        {" "}Thinking Minds
    </span>
</p>
      </div>
    </div>
  );
}

export default AdminLogin;
