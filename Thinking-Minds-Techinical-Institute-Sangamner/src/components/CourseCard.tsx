import { motion } from "framer-motion";
import { Clock, DollarSign, ChevronDown } from "lucide-react";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Course } from "../data/courses";

interface CourseCardProps {
  course: Course;
  index: number;
  onOpenModal: (course: Course) => void;
}

const CourseCard = ({ course, index, onOpenModal }: CourseCardProps) => {
  const handleEnroll = () => {
    const msg = `Hello! I would like to enroll in the ${course.name} course.`;
    const wa = `https://wa.me/919876543210?text=${encodeURIComponent(msg)}`;
    window.open(wa, "_blank");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl font-display mb-2">{course.name}</CardTitle>
              <CardDescription className="text-base">{course.description}</CardDescription>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                course.category === "IT" ? "bg-primary/10 text-primary" : "bg-accent/10 text-accent"
              }`}
            >
              {course.category}
            </span>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{course.duration}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">{course.fees}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="default" className="flex-1" onClick={handleEnroll}>
              Enroll Now
            </Button>

            <Button variant="outline" className="flex-1" onClick={() => onOpenModal(course)}>
  Learn More
</Button>

          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CourseCard;
