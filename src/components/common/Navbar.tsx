import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";

interface NavbarProps {
  activeSection: string;
}

const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", target: "about-section" },
    { name: "Experience", target: "experience-section" },
    { name: "Skills", target: "skills-section" },
    { name: "Case Studies", target: "case-studies-section" },
    { name: "Certifications", target: "certifications-section" },
    { name: "Testimonials", target: "testimonials-section" },
    { name: "Contact", target: "contact-section" },
  ];

  return (
    <motion.nav
      className={`site-navbar ${scrolled ? "scrolled" : ""} ${
        menuOpen ? "menu-open" : ""
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="navbar-container">
        <ScrollLink to="hero-section" smooth={true} duration={800}>
          <motion.div
            className="logo"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            SR
          </motion.div>
        </ScrollLink>

        <div className="nav-links desktop-nav">
          {navLinks.map((link) => (
            <ScrollLink
              key={link.target}
              to={link.target}
              smooth={true}
              duration={800}
              offset={-100}
              spy={true}
              activeClass="active"
            >
              <motion.div
                className={`nav-item ${
                  activeSection === link.target.split("-")[0] ? "active" : ""
                }`}
                whileHover={{ y: -3 }}
                whileTap={{ y: 0 }}
              >
                {link.name}
                {activeSection === link.target.split("-")[0] && (
                  <motion.div
                    className="nav-indicator"
                    layoutId="nav-indicator"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </motion.div>
            </ScrollLink>
          ))}
        </div>

        <motion.a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="resume-button desktop-only"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Resume
        </motion.a>

        <motion.div
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <div className={`hamburger ${menuOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </motion.div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className={`mobile-menu ${menuOpen ? "open" : ""}`}
        initial={{ opacity: 0, height: 0 }}
        animate={{
          opacity: menuOpen ? 1 : 0,
          height: menuOpen ? "auto" : 0,
        }}
        transition={{ duration: 0.3 }}
      >
        {navLinks.map((link) => (
          <ScrollLink
            key={link.target}
            to={link.target}
            smooth={true}
            duration={800}
            offset={-100}
            spy={true}
            activeClass="active"
            onClick={() => setMenuOpen(false)}
          >
            <motion.div
              className={`mobile-nav-item ${
                activeSection === link.target.split("-")[0] ? "active" : ""
              }`}
              whileHover={{ x: 5 }}
              whileTap={{ x: 0 }}
            >
              {link.name}
            </motion.div>
          </ScrollLink>
        ))}

        <motion.a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-nav-item resume-link"
          onClick={() => setMenuOpen(false)}
          whileHover={{ x: 5 }}
          whileTap={{ x: 0 }}
        >
          Resume
        </motion.a>
      </motion.div>
    </motion.nav>
  );
};

export default Navbar;
