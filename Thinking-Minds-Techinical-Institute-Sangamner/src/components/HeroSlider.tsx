import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import sliderIt from "../assets/slider-it-courses.jpg";
import sliderCivil from "../assets/slider-civil-software.jpg";
import sliderLabs from "../assets/slider-practical-labs.jpg";
import sliderCertifications from "../assets/slider-certifications.jpg";
import sliderWorkshops from "../assets/slider-workshops.jpg";

// import StudentScrollView from "./StudentScrollView"; // import the scroll view

const slides = [
  { image: sliderIt, title: "IT Courses", subtitle: "Master Programming & Web Development" },
  { image: sliderCivil, title: "Civil Software Training", subtitle: "Professional CAD & Design Tools" },
  { image: sliderLabs, title: "Practical Labs", subtitle: "Hands-on Learning Experience" },
  { image: sliderCertifications, title: "Industry Certifications", subtitle: "Boost Your Career" },
  { image: sliderWorkshops, title: "Expert Workshops", subtitle: "Learn from Industry Professionals" },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const handleDragEnd = (event: PointerEvent, info: PanInfo) => {
    if (info.offset.x < -50) setCurrentSlide((prev) => (prev + 1) % slides.length);
    if (info.offset.x > 50) setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div id="home" className="relative h-[700px] md:h-[750px] overflow-hidden bg-primary">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/60" />
          </div>

          <div className="relative h-full flex items-center">
            <div className="container mx-auto px-4">
              <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="max-w-3xl"
              >
                <h1 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">
                  {slides[currentSlide].title}
                </h1>
                <p className="text-lg md:text-xl text-primary-foreground/90 mb-6">
                  {slides[currentSlide].subtitle}
                </p>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-xl md:text-2xl font-display font-bold text-accent mb-8"
                >
                  Learn Today, Lead Tomorrow
                </motion.p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Add the Student Scroll View at the bottom of hero section */}
      {/* <StudentScrollView /> removed as per instructions for photo section will be used in future */}
    </div>
  );
};

export default HeroSlider;
