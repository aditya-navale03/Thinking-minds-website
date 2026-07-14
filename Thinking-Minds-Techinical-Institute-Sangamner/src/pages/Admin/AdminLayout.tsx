import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/firebaseConfig";

import {
    LayoutDashboard,
    UserPlus,
    Users,
    UserMinus,
    Bell,
    LogOut,
} from "lucide-react";

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const dept = localStorage.getItem("admin_department");

    const handleLogout = async () => {
        await signOut(auth);
        localStorage.removeItem("admin_department");
        navigate("/admin");
    };

    const menuItems = [
        {
            title: "Dashboard Analytics",
            icon: LayoutDashboard,
            path:
                dept === "civil"
                    ? "/admin/dashboard-civil"
                    : "/admin/dashboard-it",
        },
        {
            title: "Add Student",
            icon: UserPlus,
            path: "/admin/add-student",
        },
        {
            title:
                dept === "civil"
                    ? "View Civil Students"
                    : "View IT Students",
            icon: Users,
            path: `/admin/students/${dept}`,
        },
        {
            title: "Remove Student",
            icon: UserMinus,
            path: "/admin/remove-student",
        },
        {
            title: "All Students Fee Reminders",
            icon: Bell,
            path: "/admin/reminders",
        },
    ];

    return (
        <div className="flex h-screen bg-slate-950 overflow-auto">

            {/* Sidebar */}
            <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col">

                {/* Logo */}
                <div className="p-6 border-b border-slate-800">

                    <h1 className="text-2xl font-bold text-white">
                        Thinking Minds
                    </h1>

                    <p className="text-slate-400 mt-1 capitalize">
                        {dept} Admin Panel
                    </p>

                </div>

                {/* Menu */}
                <div className="flex-1 px-4 py-6 space-y-2">

                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        const active = location.pathname === item.path;

                        return (
                            <button
                                key={item.title}
                                onClick={() => navigate(item.path)}
                                className={`w-full h-14 flex items-center gap-4 px-4 rounded-xl transition-all duration-300
    ${active
                                        ? "bg-violet-600 text-white shadow-lg"
                                        : "text-slate-300 hover:bg-slate-800 hover:text-white"
                                    }`}
                            >
                                <Icon size={20} className="min-w-[20px]" />

                                <span className="text-sm font-medium truncate">
                                    {item.title}
                                </span>
                            </button>
                        );
                    })}

                </div>

                {/* Logout */}

                <div className="p-4 border-t border-slate-800">

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-3 transition"
                    >
                        <LogOut size={20} />
                        Logout
                    </button>

                </div>

            </aside>

            {/* Main Area */}

            <div className="flex-1 flex flex-col">

                {/* Top Navbar */}

                <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-8">

                    <h2 className="text-white text-xl font-semibold">
                        Admin Dashboard
                    </h2>

                    <div className="text-slate-300 capitalize">
                        {dept} Department
                    </div>

                </header>

                {/* Page Content */}

                <main className="flex-1 overflow-auto">

                    <Outlet />

                </main>

            </div>

        </div>
    );
}