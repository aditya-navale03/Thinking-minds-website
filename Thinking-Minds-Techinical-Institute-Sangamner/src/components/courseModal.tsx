import { motion } from "framer-motion";
import { X } from "lucide-react";
import { Course } from "../data/courses";
import { Button } from "../components/ui/button";

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
}

const CourseModal = ({ course, onClose }: CourseModalProps) => {
  if (!course) return null;

  const handleEnroll = () => {
    const message = `Hello! I would like to enroll in the ${course.name} course. My name is `;
    const whatsappUrl = `https://wa.me/919876543210?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl w-[90%] max-w-2xl max-h-[85vh] overflow-hidden relative flex flex-col"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sticky Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-500 p-6 flex justify-between items-center rounded-t-3xl shadow-md z-10">
          <h2 className="text-2xl font-bold text-white">{course.name}</h2>
          <button
            className="text-white hover:text-gray-200 transition"
            onClick={onClose}
          >
            <X size={28} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6" style={{ maxHeight: "60vh" }}>
          <p className="text-gray-700">{course.description}</p>

          {/* Syllabus */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Syllabus</h3>
            <ul className="text-gray-700 ml-6 list-disc space-y-1">
              {course.syllabus.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Projects */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Hands-on Projects</h3>
            <ul className="text-gray-700 ml-6 list-disc space-y-1">
              {course.projects.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Certifications */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Certifications</h3>
            <ul className="text-gray-700 ml-6 list-disc space-y-1">
              {course.certifications.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>

          {/* Career Opportunities */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Career Opportunities</h3>
            <ul className="text-gray-700 ml-6 list-disc space-y-1">
              {course.careerOpportunities.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sticky Enroll Button */}
<div className="sticky bottom-0 bg-white p-6 border-t flex justify-center shadow-md z-10 rounded-b-3xl">
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="w-full max-w-xs bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-md hover:bg-blue-700 transition-colors"
    onClick={handleEnroll}
  >
    Enroll Now
  </motion.button>
</div>

      </motion.div>
    </motion.div>
  );
};

export default CourseModal;
