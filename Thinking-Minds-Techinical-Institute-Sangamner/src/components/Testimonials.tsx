import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Sharma",
    course: "Java Full Stack",
    image: "👨‍💻",
    rating: 5,
    text: "The Java Full Stack course was comprehensive and practical. The instructors were excellent, and the hands-on projects helped me secure a job as a software developer within 2 months of completion!",
    placement: "Software Developer at TCS"
  },
  {
    name: "Priya Patel",
    course: "AutoCAD 2D/3D",
    image: "👩‍💼",
    rating: 5,
    text: "I learned AutoCAD from scratch and now I'm working as a CAD technician. The practical training and live projects made all the difference. Highly recommended for civil engineering students!",
    placement: "CAD Technician at L&T"
  },
  {
    name: "Amit Kumar",
    course: "Python Programming",
    image: "👨‍🎓",
    rating: 5,
    text: "Best decision to join the Python course here. The curriculum is up-to-date with industry standards, and the placement support is excellent. Now working as a Python developer!",
    placement: "Python Developer at Infosys"
  },
  {
    name: "Sneha Reddy",
    course: "Revit Architecture",
    image: "👩‍🔧",
    rating: 5,
    text: "The BIM and Revit training was exceptional. The instructors have real industry experience and share practical insights. I got placed as a BIM Modeler immediately after completing the course.",
    placement: "BIM Modeler at Shapoorji Pallonji"
  },
  {
    name: "Vikram Singh",
    course: "Web Development",
    image: "👨‍🏫",
    rating: 5,
    text: "From HTML to React and Node.js, this course covered everything. The project-based learning approach made complex concepts easy to understand. Now freelancing successfully!",
    placement: "Freelance Full Stack Developer"
  },
  {
    name: "Anjali Verma",
    course: "STAAD Pro",
    image: "👩‍🔬",
    rating: 5,
    text: "The structural analysis training using STAAD Pro was detailed and practical. The course helped me transition from civil site work to design office. Great faculty and support!",
    placement: "Structural Design Engineer at KEC International"
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Student Success Stories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from our alumni who transformed their careers with our training programs
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <Quote className="h-8 w-8 text-primary/20 mb-4" />
                  
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>

                  <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                    "{testimonial.text}"
                  </p>

                  <div className="flex items-center gap-3 pt-4 border-t">
                    <div className="text-4xl">{testimonial.image}</div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-xs text-muted-foreground">{testimonial.course}</p>
                      <p className="text-xs text-success font-medium mt-1">{testimonial.placement}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
