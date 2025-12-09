import Navbar from "@/components/Navbar";
import HeroSlider from "@/components/HeroSlider";
import CoursesSection from "@/components/CoursesSection";
import Gallery from "@/components/Gallery";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      <Navbar />
      <HeroSlider />

      {/* Verification & Admin Buttons Section */}
      <div className="w-full flex flex-col md:flex-row gap-4 justify-center mt-12 px-4">
        <Button
          onClick={() => navigate("/student-verification")}
          className="px-8 py-6 text-lg rounded-xl bg-blue-600 text-white hover:bg-blue-700"
        >
          Student Verification
        </Button>

        <Button
          onClick={() => navigate("/certificate-verification")}
          className="px-8 py-6 text-lg rounded-xl bg-blue-600 text-white hover:bg-blue-700"
        >
          Certificate Verification
        </Button>

        <Button
          onClick={() => navigate("/admin")}
          className="px-8 py-6 text-lg rounded-xl bg-blue-600 text-white hover:bg-blue-700"
        >
          Admin Login
        </Button>
      </div>

      <CoursesSection />
      <Gallery />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
