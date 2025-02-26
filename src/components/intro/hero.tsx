import React, { useState, useEffect, useRef } from "react";
import { useAnimation, motion, AnimatePresence } from "framer-motion";
import { Link as ScrollLink } from "react-scroll";
import CloudConnectionVisual from "./CloudConnectionVisual";
/*import SecurityScanVisual from "./SecurityScanVisual";
import ArchitectureVisual from "./ArchitectureVisual";*/

const HeroSequence = () => {
  const [step, setStep] = useState(0);
  const [typing, setTyping] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const narrativeRef = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  // Terminal-style typing effect
  useEffect(() => {
    if (step === 0) {
      const text = "Initializing cloud infrastructure...";
      let i = 0;
      const typeInterval = setInterval(() => {
        setTyping(text.substring(0, i));
        i++;
        if (i > text.length) {
          clearInterval(typeInterval);
          setTimeout(() => {
            setStep(1);
          }, 800);
        }
      }, 50);
      return () => clearInterval(typeInterval);
    }
  }, [step]);

  // Sequence of animated panels
  const narrativeSequence = [
    {
      title: "Connecting to cloud systems...",
      description:
        "Establishing secure connection to AWS, Azure and GCP networks",
      visual: <CloudConnectionVisual />,
    },
    /*    {
      title: "Access granted.",
      description: "Welcome to Sacheth Reddy's digital workspace",
      visual: <SecurityScanVisual />,
    },
    {
      title: "Infrastructure architect and problem solver",
      description:
        "Specialized in building resilient, scalable cloud systems",
      visual: <ArchitectureVisual />,
    },*/
  ];

  // When step is 0, show the terminal intro; otherwise, use step-1 to index into the sequence
  const currentNarrative =
    step > 0 && step <= narrativeSequence.length
      ? narrativeSequence[step - 1]
      : null;

  // Show profile page after completing the narrative sequence
  useEffect(() => {
    if (step > narrativeSequence.length) {
      // Short delay before showing profile to allow exit animation of narrative
      const timer = setTimeout(() => {
        setShowProfile(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [step]);

  return (
    <section className="hero-narrative" ref={narrativeRef}>
      <AnimatePresence mode="wait">
        {step === 0 ? (
          <motion.div
            key="terminal"
            className="terminal-intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="terminal-window">
              <div className="terminal-header">
                <div className="terminal-button red"></div>
                <div className="terminal-button yellow"></div>
                <div className="terminal-button green"></div>
              </div>
              <div className="terminal-content">
                <p className="terminal-text">
                  <span className="terminal-prompt">$ </span>
                  {typing}
                  <span className="terminal-cursor">_</span>
                </p>
              </div>
            </div>
          </motion.div>
        ) : currentNarrative ? (
          <motion.div
            key={`narrative-${step}`}
            className="narrative-sequence"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="narrative-visual"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              {currentNarrative.visual}
            </motion.div>

            <motion.div
              className="narrative-content"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <h2 className="narrative-title">{currentNarrative.title}</h2>
              <p className="narrative-description">
                {currentNarrative.description}
              </p>

              {step < narrativeSequence.length ? (
                <motion.button
                  className="continue-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setStep(step + 1)}
                >
                  Continue
                </motion.button>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  <motion.button
                    className="explore-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setStep(step + 1)}
                  >
                    Enter My Workspace
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        ) : showProfile ? (
          // Enhanced Hero Profile View in hero.tsx
          <motion.div
            key="profile"
            className="hero-content-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="hero-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ duration: 1.2 }}
            />

            <motion.div
              className="hero-image-container"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.6, 0.05, 0.01, 0.9] }}
            >
              <motion.div className="image-glow-effect" />
              <motion.img
                src="/images/image.jpg"
                alt="Sacheth Reddy Pinnapureddy"
                className="profile-image"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null;
                  target.src =
                    "https://via.placeholder.com/400x500?text=Sacheth+Reddy";
                }}
                whileHover={{
                  scale: 1.03,
                  boxShadow: "0 20px 50px rgba(0, 255, 157, 0.3)",
                }}
              />
            </motion.div>

            <motion.div
              className="hero-text-container"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <motion.div className="name-container">
                <motion.h1
                  className="name-heading"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  Sacheth Reddy Pinnapureddy
                </motion.h1>
                <motion.div
                  className="name-underline"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.7, duration: 1 }}
                />
              </motion.div>

              <motion.p
                className="welcome-text"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
              >
                Welcome to my digital space
              </motion.p>

              <motion.div
                className="title-container"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.8 }}
              >
                <motion.p className="subtitle">
                  Cloud Architect & DevOps Specialist
                </motion.p>
                <motion.p className="credentials">
                  <motion.span
                    className="credential-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1, duration: 0.4 }}
                  >
                    3X AWS Certified
                  </motion.span>
                  <motion.span className="credential-separator">|</motion.span>
                  <motion.span
                    className="credential-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3, duration: 0.4 }}
                  >
                    GCP Certified
                  </motion.span>
                  <motion.span className="credential-separator">|</motion.span>
                  <motion.span
                    className="credential-item"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5, duration: 0.4 }}
                  >
                    Ex-Amazon
                  </motion.span>
                </motion.p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.8 }}
                className="cta-container"
              >
                <ScrollLink
                  to="about-section"
                  smooth={true}
                  duration={800}
                  offset={-100}
                >
                  <motion.button
                    className="primary-button"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 30px rgba(0, 255, 157, 0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    View My Work
                  </motion.button>
                </ScrollLink>

                <ScrollLink
                  to="contact-section"
                  smooth={true}
                  duration={800}
                  offset={-100}
                >
                  <motion.button
                    className="secondary-button"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 30px rgba(0, 102, 255, 0.4)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Get In Touch
                  </motion.button>
                </ScrollLink>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
};

export default HeroSequence;
