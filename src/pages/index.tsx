import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import ThreeScene from "../components/ThreeScene";

export default function HomePage() {
  // Use a single ref for all sections

  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      import("gsap/ScrollTrigger").then((module) => {
        const ScrollTrigger = module.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);

        const q = gsap.utils.selector(containerRef);
        gsap.fromTo(
          q(".experience-item"),
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: containerRef.current,
              start: "top 80%",
            },
          }
        );
      });
    }
  }, []);

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

  return (
    <div ref={containerRef} className="container">
      <ThreeScene />

      <motion.header className="hero-section">
        <motion.img
          src="me/images/image.jpg"
          className="profile-image"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
        />

        <div className="hero-content">
          <motion.h1 className="cyber-glow">
            Sacheth Reddy Pinnapureddy
          </motion.h1>

          <motion.p className="typewriter">
            3X AWS, GCP | Ex Amazon | DevOps | SRE
          </motion.p>

          {/* Add any other header content here */}
        </div>
      </motion.header>

      <main>
        {/* About Section */}
        <section className="content-section">
          <h2 className="section-title">About Me</h2>
          <motion.p className="section-text" whileHover={{ x: 10 }}>
            Certified AWS Solutions Architect, SysOps Administrator, and Google
            Cloud Engineer with 5+ years of experience designing and deploying
            fault-tolerant cloud infrastructure, optimizing CI/CD pipelines, and
            implementing security best practices.
          </motion.p>
        </section>

        {/* Experience Section */}
        <section className="content-section">
          <h2 className="section-title">Experience</h2>
          {experience.map((exp, index) => (
            <motion.div
              key={index}
              className="experience-item"
              whileHover={{ scale: 1.02 }}
            >
              <h3 className="company-title">{exp.company}</h3>
              <p className="experience-period">{exp.period}</p>
              <ul className="experience-list">
                {exp.points.map((point, i) => (
                  <motion.li
                    key={i}
                    className="experience-point"
                    whileHover={{ x: 10 }}
                  >
                    {point}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </section>

        {/* Skills Section */}
        <section className="content-section">
          <h2 className="section-title">Skills</h2>
          <div className="skills-grid">
            {skills.map((skill, index) => (
              <motion.div
                key={index}
                className="skill-card"
                whileHover={{ scale: 1.05 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {skill}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Certifications Section */}
        <section className="content-section">
          <h2 className="section-title">Certifications</h2>
          <motion.ul className="certifications-list">
            {certifications.map((cert, index) => (
              <motion.li
                key={index}
                className="certification-item"
                whileHover={{ scale: 1.05 }}
              >
                {cert}
              </motion.li>
            ))}
          </motion.ul>
        </section>

        {/* Contact Section */}
        <section className="content-section">
          <h2 className="section-title">Contact</h2>
          <motion.div
            className="contact-links"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <a href="mailto:sachethreddy98@gmail.com" className="contact-link">
              📧 sachethreddy98@gmail.com
            </a>
            <a
              href="https://www.linkedin.com/in/sacheth-reddy/"
              className="contact-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              🔗 linkedin.com/in/sacheth-reddy
            </a>
            <a
              href="https://github.com/sacheth"
              className="contact-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              💻 github.com/sacheth
            </a>
          </motion.div>
        </section>
      </main>
    </div>
  );
}
