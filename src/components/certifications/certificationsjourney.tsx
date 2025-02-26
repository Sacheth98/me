import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const CertificationJourney = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const certifications = [
    {
      name: "AWS Certified Solutions Architect",
      date: "2022",
      logo: "/images/aws-cert.png",
      color: "#FF9900",
      description:
        "Designing robust, cost-efficient, and scalable distributed systems on AWS",
      skills: ["EC2", "S3", "VPC", "Route53", "ELB", "Auto Scaling", "RDS"],
      achievement: "Scored in the top 10% of all candidates globally",
    },
    {
      name: "AWS Certified SysOps Administrator",
      date: "2022",
      logo: "/images/aws-sys.png",
      color: "#FF9900",
      description: "Deploying, managing, and operating scalable systems on AWS",
      skills: [
        "CloudWatch",
        "CloudTrail",
        "Config",
        "Trusted Advisor",
        "Systems Manager",
      ],
      achievement:
        "Completed certification with perfect score in Monitoring & Reporting",
    },
    {
      name: "AWS Certified Developer",
      date: "2021",
      logo: "/images/aws-dev.png",
      color: "#FF9900",
      description: "Developing and maintaining AWS-based applications",
      skills: ["Lambda", "API Gateway", "DynamoDB", "CloudFormation", "X-Ray"],
      achievement: "First attempt success with only 3 weeks of preparation",
    },
    {
      name: "Google Certified Cloud Engineer",
      date: "2022",
      logo: "/images/gcp-cert.png",
      color: "#4285F4",
      description:
        "Deploying applications, monitoring operations, and managing enterprise solutions on GCP",
      skills: [
        "Compute Engine",
        "Kubernetes Engine",
        "App Engine",
        "Cloud Storage",
        "BigQuery",
      ],
      achievement: "Selected to participate in Google Cloud Champions program",
    },
  ];

  // Fix: Add type annotation to index parameter
  const handleCertClick = (index: number) => {
    setActiveIndex(index);
    // Launch celebration confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  return (
    <section className="certification-journey">
      <h2 className="section-title">My Learning Journey</h2>
      <p className="section-description">
        Each certification represents countless hours of study, practice, and
        real-world application
      </p>

      <div className="cert-showcase">
        <div className="cert-grid">
          {certifications.map((cert, index) => (
            <motion.div
              key={index}
              className={`cert-card ${activeIndex === index ? "active" : ""}`}
              style={{
                borderColor: cert.color,
                backgroundColor: `${cert.color}10`,
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: `0 10px 30px ${cert.color}40`,
              }}
              onClick={() => handleCertClick(index)}
            >
              <div className="cert-logo">
                <img src={cert.logo} alt={cert.name} />
              </div>
              <h3 className="cert-name" style={{ color: cert.color }}>
                {cert.name}
              </h3>
              <p className="cert-date">Achieved {cert.date}</p>

              {activeIndex !== index && (
                <p className="cert-click-prompt">Click to reveal journey</p>
              )}
            </motion.div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeIndex !== null && (
            <motion.div
              className="cert-details"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              transition={{ duration: 0.5 }}
            >
              <div
                className="cert-journey"
                style={{ borderColor: certifications[activeIndex].color }}
              >
                <h3 className="journey-title">
                  The Path to {certifications[activeIndex].name}
                </h3>

                <div className="journey-timeline">
                  <div className="timeline-point preparation">
                    <div
                      className="point-marker"
                      style={{
                        backgroundColor: certifications[activeIndex].color,
                      }}
                    ></div>
                    <div className="point-content">
                      <h4>Preparation</h4>
                      <p>
                        Intensive study regimen combining documentation review,
                        hands-on labs, and practice exams
                      </p>
                    </div>
                  </div>

                  <div className="timeline-point challenges">
                    <div
                      className="point-marker"
                      style={{
                        backgroundColor: certifications[activeIndex].color,
                      }}
                    ></div>
                    <div className="point-content">
                      <h4>Skill Building</h4>
                      <div className="skill-tags">
                        {certifications[activeIndex].skills.map((skill, i) => (
                          <span
                            key={i}
                            className="skill-tag"
                            style={{
                              backgroundColor: `${certifications[activeIndex].color}20`,
                              color: certifications[activeIndex].color,
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="timeline-point achievement">
                    <div
                      className="point-marker"
                      style={{
                        backgroundColor: certifications[activeIndex].color,
                      }}
                    ></div>
                    <div className="point-content">
                      <h4>Achievement</h4>
                      <p className="achievement-text">
                        {certifications[activeIndex].achievement}
                      </p>
                      <motion.div
                        className="achievement-badge"
                        initial={{ rotate: -10, scale: 0.8 }}
                        animate={{
                          rotate: [0, -5, 5, -5, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 1,
                          times: [0, 0.25, 0.5, 0.75, 1],
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                      >
                        <svg width="50" height="50" viewBox="0 0 50 50">
                          <path
                            d="M25 0L32.6 17.6L51.7 19.5L37.8 32.5L41.3 51.5L25 42.5L8.7 51.5L12.2 32.5L-1.7 19.5L17.4 17.6Z"
                            fill={certifications[activeIndex].color}
                          />
                        </svg>
                        <span className="certified-text">CERTIFIED</span>
                      </motion.div>
                    </div>
                  </div>
                </div>

                <p className="cert-description">
                  {certifications[activeIndex].description}
                </p>

                <motion.button
                  className="close-button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveIndex(null)}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default CertificationJourney;
