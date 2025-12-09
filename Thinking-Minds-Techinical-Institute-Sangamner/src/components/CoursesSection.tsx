import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, HardHat } from "lucide-react";
import CourseCard from "./CourseCard";
import CourseModal from "./courseModal";   // <-- make sure this exists
import { Course, courses } from "@/data/courses";

const CoursesSection = () => {
  const [activeTab, setActiveTab] = useState("it");

  // NEW POPUP MODAL STATES
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openModal = (course) => {
    setSelectedCourse(course);
    setModalOpen(true);
  };

  useEffect(() => {
    const handleTabChange = (e: CustomEvent<string>) => {
      setActiveTab(e.detail);
    };
    window.addEventListener("change-course-tab", handleTabChange);

    return () => window.removeEventListener("change-course-tab", handleTabChange);
  }, []);

  const itCourses = courses.filter((course) => course.category === "IT");
  const civilCourses = courses.filter((course) => course.category === "Civil");

  return (
    <section id="courses-section" className="py-20 bg-secondary/30 scroll-mt-24">
      <div className="container mx-auto px-4">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Our Courses</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our comprehensive range of IT and Civil Engineering courses
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12 h-14">
            <TabsTrigger value="it" className="text-base">
              <Code className="h-5 w-5 mr-2" />
              IT Courses
            </TabsTrigger>

            <TabsTrigger value="civil" className="text-base">
              <HardHat className="h-5 w-5 mr-2" />
              Civil Courses
            </TabsTrigger>
          </TabsList>

          <TabsContent value="it">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {itCourses.map((course, index) => (
                <CourseCard
  key={course.id}
  course={course}
  index={index}
  onOpenModal={(course) => setSelectedCourse(course)}
/>

              ))}
            </div>
          </TabsContent>

          <TabsContent value="civil">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {civilCourses.map((course, index) => (
                <CourseCard
    key={course.id}
    course={course}
    index={index}
    onOpenModal={(course) => setSelectedCourse(course)}
  />

              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* MODAL */}
        <CourseModal 
  course={selectedCourse} 
  onClose={() => setSelectedCourse(null)} 
/>


      </div>
    </section>
  );
};

export default CoursesSection;
