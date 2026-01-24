import { motion } from "framer-motion";
import galleryLab from "../assets/4.jpeg";
import galleryClassroom from "../assets/3.jpeg";
import galleryWorkshop from "../assets/1.jpeg";
import galleryReception from "../assets/2.jpeg";

const galleryImages = [
  { src: galleryLab, alt: "Students working in computer lab", caption: "Modern Computer Labs" },
  { src: galleryClassroom, alt: "Instructor teaching in classroom", caption: "Interactive Classrooms" },
  { src: galleryWorkshop, alt: "Workshop presentation", caption: "Industry Workshops" },
  { src: galleryReception, alt: "Institute reception area", caption: "Welcoming Environment" },
];

const Gallery = () => {
  return (
    <section id="gallery" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Our Facilities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Take a look at our state-of-the-art facilities and learning environment
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {galleryImages.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-lg aspect-[4/3] cursor-pointer"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                <p className="text-primary-foreground font-semibold p-4 w-full">
                  {image.caption}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Gallery;
