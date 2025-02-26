import { useRef, useEffect, useState, RefObject, lazy, Suspense } from "react";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Link as ScrollLink } from "react-scroll";
import throttle from "lodash/throttle";

// Core components
import Navbar from "../components/common/Navbar";
import ThreeScene from "../components/common/ThreeScene";
import MatrixBackground from "../components/common/Matrixbackground";
import Footer from "../components/common/footer";
import LoadingSpinner from "../components/common/loadingspinner";

// Lazy-loaded feature components for better performance
const HeroSequence = lazy(() => import("../components/intro/hero"));
const ExperienceJourney = lazy(
  () => import("../components/experience/experiencejourney")
);
const SkillGalaxy = lazy(() => import("../components/skills/skillgalaxy"));
const CaseStudies = lazy(() => import("../components/casestudies/casestudies"));
const CertificationJourney = lazy(
  () => import("../components/certifications/certificationsjourney")
);
const InteractiveCommunication = lazy(
  () => import("../components/contact/interactivecommunication")
);

const TestimonialsSection = lazy(
  () => import("../components/testimonials/TestimonialsSection")
);

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Custom hook for scroll-triggered animations
function useScrollAnimation(
  threshold: number = 0.2
): [RefObject<HTMLElement>, boolean] {
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
  const [activeSection, setActiveSection] = useState("about");
  const controls = useAnimation();
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Device detection for responsive optimizations
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkDevice();
    window.addEventListener("resize", throttle(checkDevice, 200));
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Initial loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // Set up ScrollTrigger for section animations
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sections = [
        "about",
        "experience",
        "skills",
        "case-studies",
        "certifications",
        "testimonials",
        "contact",
      ];
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      sections.forEach((section) => {
        ScrollTrigger.create({
          trigger: `#${section}-section`,
          start: "top 60%",
          onEnter: () => {
            setActiveSection(section);
            gsap.to(`#${section}-section`, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
            });
          },
          onLeaveBack: () => {
            if (section !== "about") {
              const prevIndex = sections.indexOf(section) - 1;
              setActiveSection(sections[prevIndex]);
            }
          },
        });
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    }
  }, []);

  // Define animations for sections
  const sectionVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: [0.6, 0.05, 0.01, 0.9],
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // Use scroll animations for each section
  const [aboutRef, aboutVisible] = useScrollAnimation();
  const [experienceRef, experienceVisible] = useScrollAnimation();
  const [skillsRef, skillsVisible] = useScrollAnimation();
  const [caseStudiesRef, caseStudiesVisible] = useScrollAnimation();
  const [certRef, certVisible] = useScrollAnimation();
  const [testimonialsRef, testimonialsVisible] = useScrollAnimation();
  const [contactRef, contactVisible] = useScrollAnimation();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loader-container">
          <div className="logo-loader">SR</div>
          <p className="loading-text">Initializing Cloud Environment...</p>
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-wrapper">
      {/* Background elements */}
      <ThreeScene isMobile={isMobile} />
      <MatrixBackground density={isMobile ? "low" : "high"} />

      <div className="background-orb orb-1"></div>
      <div className="background-orb orb-2"></div>
      <div className="background-orb orb-3"></div>
      <div className="noise-texture"></div>

      {/* Navigation */}
      <Navbar activeSection={activeSection} />

      <div className="container">
        {/* Hero Section */}
        <section id="hero-section" className="hero-section">
          <Suspense fallback={<LoadingSpinner />}>
            <HeroSequence />
          </Suspense>
        </section>

        {/* About Section */}
        <motion.section
          id="about-section"
          ref={aboutRef as RefObject<HTMLDivElement>}
          className="content-section"
          initial="hidden"
          animate={aboutVisible ? "visible" : "hidden"}
          variants={sectionVariants}
        >
          <motion.h2 className="section-title" variants={itemVariants}>
            About Me
          </motion.h2>
          <motion.div className="about-content" variants={itemVariants}>
            <motion.p className="section-text" variants={itemVariants}>
              I'm a seasoned Cloud Architect and DevOps specialist with over 5
              years of experience designing and implementing highly scalable,
              fault-tolerant cloud infrastructure. My expertise spans across
              AWS, Azure, and Google Cloud platforms, where I've successfully
              led complex migration projects, optimized CI/CD pipelines, and
              implemented robust security practices.
            </motion.p>
            <motion.p className="section-text" variants={itemVariants}>
              My professional journey includes working at Amazon AWS, where I
              gained deep insights into cloud architecture best practices and
              enterprise-scale deployments. I specialize in infrastructure
              automation, containerization strategies, and building resilient
              systems that can withstand high-traffic demands while maintaining
              peak performance.
            </motion.p>
            <motion.div className="approach-pillars" variants={itemVariants}>
              <motion.div
                className="approach-pillar"
                whileHover={{
                  y: -10,
                  boxShadow: "0 10px 30px rgba(0, 255, 157, 0.2)",
                }}
              >
                <div className="pillar-icon">🛡️</div>
                <h3 className="pillar-title">Security-First</h3>
                <p className="pillar-text">
                  Building systems with security as a foundational principle,
                  not an afterthought
                </p>
              </motion.div>
              <motion.div
                className="approach-pillar"
                whileHover={{
                  y: -10,
                  boxShadow: "0 10px 30px rgba(0, 102, 255, 0.2)",
                }}
              >
                <div className="pillar-icon">⚙️</div>
                <h3 className="pillar-title">Automation</h3>
                <p className="pillar-text">
                  Creating self-healing systems that minimize manual
                  intervention
                </p>
              </motion.div>
              <motion.div
                className="approach-pillar"
                whileHover={{
                  y: -10,
                  boxShadow: "0 10px 30px rgba(255, 62, 85, 0.2)",
                }}
              >
                <div className="pillar-icon">📈</div>
                <h3 className="pillar-title">Scalability</h3>
                <p className="pillar-text">
                  Designing for growth with elastic infrastructure that scales
                  on demand
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Experience Journey Section */}
        <section
          id="experience-section"
          ref={experienceRef as RefObject<HTMLDivElement>}
          className="content-section"
        >
          <Suspense fallback={<LoadingSpinner />}>
            <ExperienceJourney />
          </Suspense>
        </section>

        {/* Skills Galaxy Section */}
        <section
          id="skills-section"
          ref={skillsRef as RefObject<HTMLDivElement>}
          className="content-section"
        >
          <Suspense fallback={<LoadingSpinner />}>
            <SkillGalaxy isMobile={isMobile} />
          </Suspense>
        </section>

        {/* Case Studies Section */}
        <section
          id="case-studies-section"
          ref={caseStudiesRef as RefObject<HTMLDivElement>}
          className="content-section"
        >
          <Suspense fallback={<LoadingSpinner />}>
            <CaseStudies />
          </Suspense>
        </section>

        {/* Certifications Journey Section */}
        <section
          id="certifications-section"
          ref={certRef as RefObject<HTMLDivElement>}
          className="content-section"
        >
          <Suspense fallback={<LoadingSpinner />}>
            <CertificationJourney />
          </Suspense>
        </section>

        {/* Testimonials Section */}
        <section
          id="testimonials-section"
          ref={testimonialsRef as RefObject<HTMLDivElement>}
          className="content-section"
        >
          <Suspense fallback={<LoadingSpinner />}>
            <TestimonialsSection />
          </Suspense>
        </section>
        {/* Interactive Communication Section */}
        <section
          id="contact-section"
          ref={contactRef as RefObject<HTMLDivElement>}
          className="content-section"
        >
          <Suspense fallback={<LoadingSpinner />}>
            <InteractiveCommunication />
          </Suspense>
        </section>
      </div>

      {/* Footer */}
      <Footer />

      {/* Quick navigation for better UX */}
      <div className="quick-nav">
        <ScrollLink to="hero-section" smooth={true} duration={800}>
          <motion.button
            className="top-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            ↑
          </motion.button>
        </ScrollLink>
      </div>
    </div>
  );
}
