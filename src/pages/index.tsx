import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThreeScene from "../components/ThreeScene";

gsap.registerPlugin(ScrollTrigger);

export default function HomePage() {
  const sectionRefs = useRef<HTMLElement[]>([]);
  const q = gsap.utils.selector(sectionRefs);
  const experience = [
    {
      company: "Sr. DevOps / Site Reliability Engineer - WIS International",
      period: "Apr 2023 – Present",
      points: [
        "Architected and deployed scalable cloud infrastructures on Microsoft Azure",
        "Implemented Azure Key Vault for enhanced security",
        "Directed CI/CD pipelines using Azure DevOps",
        "Integrated Azure Active Directory (AD) for optimized identity management",
      ],
    },
    // Add other experiences similarly
  ];

  const skills = [
    "Cloud Platforms: AWS, Azure, GCP",
    "DevOps Tools: Terraform, Kubernetes, Ansible, Jenkins",
    "Programming: Python, Bash, YAML",
    "Networking: VPN, SSH, DNS, Security Groups",
  ];

  useEffect(() => {
    // GSAP Animations
    gsap.from(sectionRefs.current, {
      opacity: 0,
      y: 100,
      stagger: 0.2,
      scrollTrigger: {
        trigger: sectionRefs.current,
        start: "top 80%",
      },
    });

    // Hover effects for experience items
    gsap.to(q(".experience-item"), {
      y: -5,
      duration: 0.3,
      ease: "power2.out",
      stagger: 0.1,
      scrollTrigger: {
        trigger: ".experience-item",
        start: "top 90%",
      },
    });
  }, [q]);

  return (
    <div className="container">
      <ThreeScene />

      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, ease: "circOut" }}
        className="hero-section"
      >
        <motion.img
          src="/images/image.jpeg"
          alt="Profile"
          className="profile-image"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
        />
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="cyber-glow"
        >
          Sacheth Reddy Pinnapureddy
        </motion.h1>
        <motion.p
          className="typewriter"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, delay: 1.2, ease: "circOut" }}
        >
          DevOps Engineer | Cloud | Kubernetes
        </motion.p>
      </motion.header>

      <main>
        {/* About Section */}
        <section
          ref={(el) => el && sectionRefs.current.push(el)}
          className="content-section"
        >
          <h2 className="section-title">About Me</h2>
          <motion.p className="section-text" whileHover={{ x: 10 }}>
            Certified AWS Solutions Architect, SysOps Administrator, and Google
            Cloud Engineer with 5+ years of experience designing and deploying
            fault-tolerant cloud infrastructure, optimizing CI/CD pipelines, and
            implementing security best practices.
          </motion.p>
        </section>

        {/* Experience Section */}
        <section
          ref={(el) => el && sectionRefs.current.push(el)}
          className="content-section"
        >
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
        <section
          ref={(el) => el && sectionRefs.current.push(el)}
          className="content-section"
        >
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
        <section
          ref={(el) => el && sectionRefs.current.push(el)}
          className="content-section"
        >
          <h2 className="section-title">Certifications</h2>
          <motion.ul className="certifications-list">
            {[
              "AWS Certified Solutions Architect",
              "AWS Certified SysOps Administrator",
              "AWS Certified Developer",
              "Google Certified Cloud Engineer",
            ].map((cert, index) => (
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
        <section
          ref={(el) => el && sectionRefs.current.push(el)}
          className="content-section"
        >
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
