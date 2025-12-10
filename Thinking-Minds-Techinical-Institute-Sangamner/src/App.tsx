import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/Admin/AdminLogin";
import CivilDashboard from "./pages/Admin/CivilAdminDashboard";
import ITDashboard from "./pages/Admin/ItAdminDashboard";
import AddStudent from "./pages/Admin/AddStudent";
import RemoveStudent from "./pages/Admin/RemoveStudent";
import UpdateStudent from "./pages/Admin/UpdateStudent";

// Student Listing Page (NEW)
import ViewStudents from "./pages/Admin/ViewStudents";

// Verification Pages
import StudentVerification from "./pages/Verification/StudentVerification";
import CertificateVerification from "./pages/Verification/CertificateVerification";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Home */}
          <Route path="/" element={<Index />} />

          {/* Verification */}
          <Route path="/student-verification" element={<StudentVerification />} />
          <Route path="/certificate-verification" element={<CertificateVerification />} />

          {/* Admin Login */}
          <Route path="/admin" element={<AdminLogin />} />

          {/* Dashboards */}
          <Route path="/admin/dashboard-civil" element={<CivilDashboard />} />
          <Route path="/admin/dashboard-it" element={<ITDashboard />} />

          {/* View students department-wise */}
          <Route path="/admin/students/:dept" element={<ViewStudents />} />

          {/* Student Actions */}
          <Route path="/admin/add-student" element={<AddStudent />} />
          <Route path="/admin/remove-student" element={<RemoveStudent />} />

          {/* Update student needs ID */}
          <Route path="/admin/update-student/:id" element={<UpdateStudent />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
