import { useState, FormEvent } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import BackButton from "@/components/ui/backbutton";

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

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

      if (!role) {
        alert("No role found");
        setLoading(false);
        return;
      }

      console.log("Logged in admin role:", role);

      // ✅ Save department for dashboard protection
      localStorage.setItem("admin_department", role);

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
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-10 w-full max-w-md">

        <BackButton className="mb-4" />

        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Admin Login
        </h2>

        <form onSubmit={loginAdmin} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter admin email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.currentTarget.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors duration-200"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-500 text-sm">
          Powered by <span className="font-semibold">Thinking Minds</span>
        </p>
      </div>
    </div>
  );
}

export default AdminLogin;
