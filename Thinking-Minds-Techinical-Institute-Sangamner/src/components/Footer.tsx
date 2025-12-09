import { Facebook, Instagram, Linkedin, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="font-display text-xl font-bold mb-4">Thinking Minds</h3>
            <p className="text-sm text-primary-foreground/80 mb-4">
              Leading technical training institute offering comprehensive IT and Civil Engineering software courses.
            </p>
            <p className="text-sm font-semibold text-accent">Learn Today, Lead Tomorrow</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display text-lg font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#home" className="hover:text-accent transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="#it-courses" className="hover:text-accent transition-colors">
                  IT Courses
                </a>
              </li>
              <li>
                <a href="#civil-courses" className="hover:text-accent transition-colors">
                  Civil Courses
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-accent transition-colors">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-accent transition-colors">
                  Testimonials
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-accent transition-colors">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="font-display text-lg font-bold mb-4">Popular Courses</h3>
            <ul className="space-y-2 text-sm">
              <li className="hover:text-accent transition-colors cursor-pointer">Java Full Stack</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Python Programming</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Web Development</li>
              <li className="hover:text-accent transition-colors cursor-pointer">AutoCAD 2D/3D</li>
              <li className="hover:text-accent transition-colors cursor-pointer">Revit Architecture</li>
              <li className="hover:text-accent transition-colors cursor-pointer">STAAD Pro</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-lg font-bold mb-4">Contact Info</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-1 flex-shrink-0" />
                <span className="text-primary-foreground/80">
                  123 Learning Street, Tech Park, Bangalore, Karnataka 560001
                </span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span className="text-primary-foreground/80">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span className="text-primary-foreground/80">info@thinkingminds.in</span>
              </li>
            </ul>

            {/* Social Media */}
            <div className="mt-4">
              <h4 className="font-semibold mb-3">Follow Us</h4>
              <div className="flex gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary-foreground/10 hover:bg-accent p-2 rounded-full transition-colors"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary-foreground/10 hover:bg-accent p-2 rounded-full transition-colors"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary-foreground/10 hover:bg-accent p-2 rounded-full transition-colors"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary-foreground/10 hover:bg-accent p-2 rounded-full transition-colors"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary-foreground/10 hover:bg-accent p-2 rounded-full transition-colors"
                >
                  <Youtube className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-primary-foreground/80">
            <p>© {currentYear} Thinking Minds Technical Institute. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-accent transition-colors">
                Privacy Policy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-accent transition-colors">
                Terms & Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
