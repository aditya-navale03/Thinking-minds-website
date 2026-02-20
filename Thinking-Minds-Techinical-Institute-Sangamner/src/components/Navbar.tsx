import { useState, useEffect } from "react";
import { Menu, X, GraduationCap } from "lucide-react";
import { Button } from "../components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

type CourseTab = "it" | "civil";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Navbar background on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock background scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [menuOpen]);



  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "IT Courses", href: "#courses-section", tab: "it" as CourseTab },
    { name: "Civil Courses", href: "#courses-section", tab: "civil" as CourseTab },
    { name: "Gallery", href: "#gallery" },
    { name: "Testimonials", href: "#testimonials" },
    { name: "Contact", href: "#contact" },
  ];

  const scrollToSection = (href: string, tab?: CourseTab) => {
    if (tab) {
      window.dispatchEvent(new CustomEvent<string>("change-course-tab", { detail: tab }));
    }
    const el = document.querySelector(href);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
    setMenuOpen(false);
  };

  return (
    <>
      {/* NAVBAR */}
      <nav
        className={`fixed top-0 left-0 right-0 z-[50] transition-all duration-300 ${
          scrolled ? "bg-background/95 backdrop-blur-md shadow-md" : "bg-primary/80 backdrop-blur-sm"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
           <a href="#home" className="flex items-center space-x-3 group">

  {/* LOGO CONTAINER */}
  <div
  className={`flex items-center justify-center rounded-xl p-2 h-12 w-12 md:h-14 md:w-14 transition-all duration-300

    ${
      scrolled
  ? "bg-white shadow-lg border"
  : "bg-white/80 backdrop-blur-md border border-white/40"

    }`}
  >
    <img
      src="/logo.png"
      alt="Thinking Minds Logo"
      className="h-12 w-12 md:h-14 md:w-14 object-contain transition-transform duration-300 group-hover:scale-105"
    />
  </div>

  {/* TEXT */}
  <div className="flex flex-col leading-tight">
    <span
      className={`font-display text-lg md:text-xl font-bold tracking-wide ${
        scrolled ? "text-foreground" : "text-primary-foreground"
      }`}
    >
      Thinking Minds
    </span>

    <span
      className={`text-[11px] md:text-xs tracking-wider ${
        scrolled
          ? "text-muted-foreground"
          : "text-primary-foreground/80"
      }`}
    >
      Technical  training Institute
    </span>
  </div>

</a>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollToSection(link.href, link.tab)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    scrolled
                      ? "text-foreground hover:text-primary hover:bg-secondary"
                      : "text-primary-foreground hover:text-accent hover:bg-primary-foreground/10"
                  }`}
                >
                  {link.name}
                </button>
              ))}
              <Button className={`ml-4 ${!scrolled ? "bg-accent hover:bg-accent/90" : ""}`} onClick={() => scrollToSection("#contact")}>
                Enroll Now
              </Button>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMenuOpen(true)}
              className={`md:hidden p-2 ${scrolled ? "text-foreground hover:text-primary" : "text-primary-foreground hover:text-accent"}`}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <AnimatePresence>
  {menuOpen && (
    <>
      {/* Slight blurred overlay behind menu */}
      <motion.div
        className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setMenuOpen(false)} // close menu on outside click
      />

      {/* Slide-in menu */}
      <motion.div
        className="fixed top-0 left-0 h-full w-[85%] max-w-sm bg-white z-50 p-6 flex flex-col space-y-6 shadow-xl rounded-r-2xl overflow-y-auto"
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "tween", duration: 0.3 }}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        {/* Close button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Menu</h2>
          <button onClick={() => setMenuOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Menu items */}
        {navLinks.map((link) => (
          <button
            key={link.name}
            onClick={() => scrollToSection(link.href, link.tab)}
            className="w-full text-left px-4 py-3 text-lg font-medium hover:bg-gray-100 rounded-lg"
          >
            {link.name}
          </button>
        ))}

        <Button
          className="w-full mt-4"
          onClick={() => scrollToSection("#contact")}
        >
          Enroll Now
        </Button>
      </motion.div>
    </>
  )}
</AnimatePresence>



    </>
  );
};

export default Navbar;
