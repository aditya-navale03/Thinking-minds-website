import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

//reminder
import Reminders from "./pages/Admin/Reminders";


import MigrateStudents from "./pages/Admin/MigrateStudents";

// import { useEffect } from "react";

//dashboard
import Dashboard from "./pages/Admin/Dashboard";

// import TricolorConfetti from "./components/TricolorConfetti";


//snowfall
// import Snowfall from "react-snowfall";


//26 january unique
// import IndiaBuildsIntro from "./components/IndiaBuildsIntro";


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

//maintance mode on
const MAINTENANCE_MODE = true;

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>

      {/* snowfall
      <Snowfall
  snowflakeCount={200}
  style={{
    position: "fixed",
    width: "100vw",
    height: "100vh",
    zIndex: 9999,
    pointerEvents: "none"
  }}
/> */}



      {/* <IndiaBuildsIntro />
<TricolorConfetti show={true} /> */}



      <Toaster />
      <Sonner />

      {/*  maintance mode */}
        
<BrowserRouter>

  {MAINTENANCE_MODE &&
    !window.location.pathname.startsWith("/admin") ? (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center px-6">
          <h1 className="text-4xl font-bold mb-4">
            Thinking Minds Website is Under Maintenance
          </h1>

          <p className="text-muted-foreground text-lg">
            We are updating our system. Please visit again later.
          </p>
        </div>
      </div>
    ) : (
      
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

          {/* dashboard route */}
          <Route path="/admin/dashboard" element={<Dashboard />} />

          {/* reminder */}
          <Route path="/admin/reminders" element={<Reminders />} />


          {/* Update student needs ID */}
          <Route path="/admin/update-student/:dept/:id" element={<UpdateStudent />} />
          <Route path="*" element={<NotFound />} />


          <Route
            path="/migrate-students"
            element={<MigrateStudents />}
          />


        </Routes>

    )}





      </BrowserRouter>
    </TooltipProvider>


  </QueryClientProvider>



);



export default App;
