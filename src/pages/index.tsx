import { useRef, useEffect, useState, RefObject } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import ThreeScene from "../components/ThreeScene";
import VideoBackground from "../components/VideoBackground";

// Updated custom hook with explicit typing for the ref
function useScrollAnimation(threshold: number = 0.2): [RefObject<HTMLElement>, boolean] {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold]);

  return [ref, isVisible];
}

export default function HomePage() {
  const containerRef = useRef(null);
  const [visibleSection, setVisibleSection] = useState("hero");
  const controls = useAnimation();

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("gsap/ScrollTrigger").then((module) => {
        const ScrollTrigger = module.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);

        // Create scroll-triggered animations
        const sections = ["about", "experience", "skills", "certifications", "contact"];
        
        sections.forEach((section) => {
          ScrollTrigger.create({
            trigger: `#${section}-section`,
            start: "top 80%",
            onEnter: () => {
              setVisibleSection(section);
              gsap.to(`#${section}-section`, {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: "power2.out",
              });
            },
            onLeaveBack: () => {
              if (section !== "about") {
                const prevIndex = sections.indexOf(section) - 1;
                setVisibleSection(sections[prevIndex]);
              }
            }
          });
        });

        // Create animations for experience items
        const experienceItems = document.querySelectorAll(".experience-item");
        experienceItems.forEach((item, index) => {
          gsap.fromTo(
            item,
            { opacity: 0, x: -50 },
            {
              opacity: 1,
              x: 0,
              duration: 0.5,
              delay: index * 0.1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: item,
                start: "top 80%",
              },
            }
          );
        });
      });
    }
  }, []);

  // Define entrance animations for each section
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    }
  };

  const experience = [
    {
      company: "Sr. DevOps / Site Reliability Engineer - WIS International",
      period: "Apr 2023 – Present",
      points: [
        "Architected scalable cloud infrastructures on Microsoft Azure.",
        "Implemented Azure Key Vault for enhanced security.",
        "Directed CI/CD pipelines using Azure DevOps.",
        "Integrated Azure Active Directory (AD) for optimized identity management.",
      ],
    },
  ];

  const skills = [
    "Cloud Platforms: AWS, Azure, GCP",
    "DevOps Tools: Terraform, Kubernetes, Ansible, Jenkins",
    "Programming: Python, Bash, YAML",
    "Networking: VPN, SSH, DNS, Security Groups",
  ];

  const certifications = [
    "AWS Certified Solutions Architect",
    "AWS Certified SysOps Administrator",
    "AWS Certified Developer",
    "Google Certified Cloud Engineer",
  ];

  // Use scroll animations for each section with the updated hook
  const [aboutRef, aboutVisible] = useScrollAnimation();
  const [experienceRef, experienceVisible] = useScrollAnimation();
  const [skillsRef, skillsVisible] = useScrollAnimation();
  const [certRef, certVisible] = useScrollAnimation();
  const [contactRef, contactVisible] = useScrollAnimation();

  return (
    <div ref={containerRef} className="container">
      <ThreeScene />
      <VideoBackground />

      <AnimatePresence>
        <motion.header 
          className="hero-section"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.div 
            className="profile-container"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.img
              src="/me/images/image.jpg"
              className="profile-image"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: {
                  duration: 1,
                  ease: "easeOut"
                }
              }}
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 80px rgba(0, 255, 157, 0.6)",
                transition: { duration: 0.3 }
              }}
            />
          </motion.div>

          <div className="hero-content">
            <motion.h1 
              className="cyber-glow"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              Sacheth Reddy Pinnapureddy
            </motion.h1>

            <motion.p 
              className="typewriter"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "100%" }}
              transition={{ delay: 1, duration: 1 }}
            >
              3X AWS, GCP | Ex Amazon | DevOps | SRE
            </motion.p>

            <motion.div
              className="hero-cta"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <motion.a 
                href="#about-section" 
                className="view-work-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                View My Work
              </motion.a>
            </motion.div>
          </div>
        </motion.header>

        <main>
          {/* About Section */}
          <motion.section 
            id="about-section"
            ref={aboutRef}
            className="content-section"
            initial="hidden"
            animate={aboutVisible ? "visible" : "hidden"}
            variants={sectionVariants}
          >
            <motion.h2 className="section-title" variants={itemVariants}>
              About Me
            </motion.h2>
            <motion.div 
              className="about-content"
              variants={itemVariants}
            >
              <motion.p 
                className="section-text" 
                whileHover={{ x: 10 }}
                variants={itemVariants}
              >
                Certified AWS Solutions Architect, SysOps Administrator, and Google
                Cloud Engineer with 5+ years of experience designing and deploying
                fault-tolerant cloud infrastructure, optimizing CI/CD pipelines, and
                implementing security best practices.
              </motion.p>
              
              <motion.div 
                className="tech-logos"
                variants={itemVariants}
              >
                {/* Cloud logos animation here */}
                <motion.div 
                  className="logo-container"
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  {/* Placeholder for cloud service logos */}
                  <span className="tech-logo aws">AWS</span>
                  <span className="tech-logo azure">Azure</span>
                  <span className="tech-logo gcp">GCP</span>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.section>

          {/* Experience Section */}
          <motion.section 
            id="experience-section"
            ref={experienceRef}
            className="content-section"
            initial="hidden"
            animate={experienceVisible ? "visible" : "hidden"}
            variants={sectionVariants}
          >
            <motion.h2 className="section-title" variants={itemVariants}>
              Experience
            </motion.h2>
            
            {experience.map((exp, index) => (
              <motion.div
                key={index}
                className="experience-item"
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: "0 10px 30px rgba(0, 255, 157, 0.2)"
                }}
              >
                <motion.h3 
                  className="company-title"
                  variants={itemVariants}
                >
                  {exp.company}
                </motion.h3>
                <motion.p 
                  className="experience-period"
                  variants={itemVariants}
                >
                  {exp.period}
                </motion.p>
                <motion.ul className="experience-list">
                  {exp.points.map((point, i) => (
                    <motion.li
                      key={i}
                      className="experience-point"
                      variants={itemVariants}
                      whileHover={{ 
                        x: 15,
                        color: "#00ff9d",
                        transition: { duration: 0.2 } 
                      }}
                    >
                      {point}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.div>
            ))}
          </motion.section>

          {/* Skills Section */}
          <motion.section 
            id="skills-section"
            ref={skillsRef}
            className="content-section"
            initial="hidden"
            animate={skillsVisible ? "visible" : "hidden"}
            variants={sectionVariants}
          >
            <motion.h2 className="section-title" variants={itemVariants}>
              Skills
            </motion.h2>
            <motion.div className="skills-grid">
              {skills.map((skill, index) => (
                <motion.div
                  key={index}
                  className="skill-card"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: "0 0 30px rgba(0, 255, 157, 0.3)"
                  }}
                >
                  <motion.div 
                    className="skill-icon"
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {/* Skill icon would go here */}
                  </motion.div>
                  <motion.span className="skill-text">
                    {skill}
                  </motion.span>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Certifications Section */}
          <motion.section 
            id="certifications-section"
            ref={certRef}
            className="content-section"
            initial="hidden"
            animate={certVisible ? "visible" : "hidden"}
            variants={sectionVariants}
          >
            <motion.h2 className="section-title" variants={itemVariants}>
              Certifications
            </motion.h2>
            <motion.div className="certifications-list">
              {certifications.map((cert, index) => (
                <motion.div
                  key={index}
                  className="certification-item"
                  variants={itemVariants}
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: 10,
                    rotateX: 5,
                    z: 20,
                    boxShadow: "0 10px 30px rgba(0, 102, 255, 0.3)"
                  }}
                >
                  <motion.div className="cert-content">
                    <motion.div 
                      className="cert-icon"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      {/* Certificate icon would go here */}
                    </motion.div>
                    <motion.span className="cert-name">
                      {cert}
                    </motion.span>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Contact Section */}
          <motion.section 
            id="contact-section"
            ref={contactRef}
            className="content-section"
            initial="hidden"
            animate={contactVisible ? "visible" : "hidden"}
            variants={sectionVariants}
          >
            <motion.h2 className="section-title" variants={itemVariants}>
              Contact
            </motion.h2>
            <motion.div className="contact-links">
              <motion.a 
                href="mailto:sachethreddy98@gmail.com" 
                className="contact-link"
                variants={itemVariants}
                whileHover={{ 
                  x: 15,
                  backgroundColor: "rgba(0, 255, 157, 0.3)",
                  transition: { duration: 0.2 }
                }}
              >
                📧 sachethreddy98@gmail.com
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/sacheth-reddy/"
                className="contact-link"
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={{ 
                  x: 15,
                  backgroundColor: "rgba(0, 255, 157, 0.3)",
                  transition: { duration: 0.2 }
                }}
              >
                🔗 linkedin.com/in/sacheth-reddy
              </motion.a>
              <motion.a
                href="https://github.com/sacheth"
                className="contact-link"
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                whileHover={{ 
                  x: 15,
                  backgroundColor: "rgba(0, 255, 157, 0.3)",
                  transition: { duration: 0.2 }
                }}
              >
                💻 github.com/sacheth
              </motion.a>
            </motion.div>
          </motion.section>
        </main>
      </AnimatePresence>
    </div>
  );
}
