import React, { useState, useEffect, useRef } from "react";
import { useAnimation, motion, AnimatePresence } from "framer-motion";
import AzureInfrastructureVisual from "./azureinfrastructurevisual";
import CICDVisual from "./cicdvisual";
import HighTrafficSystemVisual from "./hightrafficvisual";
import SecurityVisual from "./securityvisual";
import WebsiteManagementVisual from "./websitemanagementvisual";
import TerraformVisual from "./terraformvisual";
import ServerlessVisual from "./serverlessvisual";
import CostOptimizationVisual from "./costoptimizationvisual";
import MentorshipVisual from "./mentoshipvisual";
import InfrastructureAutomationVisual from "./infrastructureautomationvisual";
import DatabaseVisual from "./databasevisual";
import ContainerVisual from "./containervisual";
import AzureADVisual from "./advisual";

const ExperienceJourney = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showDetails, setShowDetails] = useState(true); // Auto-show details
  const [activeAchievementIndex, setActiveAchievementIndex] = useState(0);
  const timelineRef = useRef<HTMLElement>(null);
  const controls = useAnimation();

  // Timeline data with all experiences including Texas State and Sudhi Informatics
  const timelineData = [
    {
      role: "Sr. DevOps / Site Reliability Engineer",
      company: "WIS International",
      period: "Apr 2023 – Present",
      color: "#4A00E0",
      icon: "🚀",
      achievements: [
        {
          title: "Multi-tier Azure Architecture",
          value: "99.9% uptime",
          description:
            "Architected resilient cloud infrastructure supporting 15+ microservices with near-perfect availability",
          visual: <AzureInfrastructureVisual />,
        },
        {
          title: "Zero-Trust Security Implementation",
          value: "65% reduction in threats",
          description:
            "Implemented comprehensive security architecture protecting critical business systems from evolving threats",
          visual: <SecurityVisual />,
        },
        {
          title: "CI/CD Pipeline Optimization",
          value: "300% faster deployments",
          description:
            "Revolutionized the development workflow enabling teams to deploy with confidence in minutes instead of hours",
          visual: <CICDVisual />,
        },
        {
          title: "Azure Active Directory Integration",
          value: "5,000+ users",
          description:
            "Implemented enterprise-wide identity management system ensuring secure and seamless access",
          visual: <AzureADVisual />,
        },
      ],
    },
    {
      role: "Cloud Engineer",
      company: "Amazon AWS",
      period: "Jul 2021 – Apr 2023",
      color: "#FF9900",
      icon: "☁️",
      achievements: [
        {
          title: "High-Traffic System Architecture",
          value: "10K+ concurrent users",
          description:
            "Designed scalable systems capable of handling traffic surges while maintaining sub-100ms response times",
          visual: <HighTrafficSystemVisual />,
        },
        {
          title: "Infrastructure as Code Implementation",
          value: "90% fewer errors",
          description:
            "Pioneered IaC practices that dramatically reduced configuration errors and deployment time",
          visual: <TerraformVisual />,
        },
        {
          title: "Serverless Application Framework",
          value: "Millisecond response time",
          description:
            "Developed event-driven architecture using Lambda, API Gateway and DynamoDB for real-time data processing",
          visual: <ServerlessVisual />,
        },
        {
          title: "Cost Optimization Initiative",
          value: "40% cost reduction",
          description:
            "Led a comprehensive cloud cost analysis and optimization project that saved millions annually",
          visual: <CostOptimizationVisual />,
        },
      ],
    },
    {
      role: "Graduate Assistant",
      company: "Texas State University",
      period: "Jan 2020 – May 2021",
      color: "#501214", // Texas State maroon
      icon: "🎓",
      achievements: [
        {
          title: "University Website Management",
          value: "20+ departmental sites",
          description:
            "Led the design and management of university websites using GATO content management system",
          visual: <WebsiteManagementVisual />,
        },
        {
          title: "Student Mentorship Program",
          value: "3 undergraduate students",
          description:
            "Recruited, trained and mentored students on cloud services and web technologies",
          visual: <MentorshipVisual />,
        },
      ],
    },
    {
      role: "Cloud Engineer",
      company: "Sudhi Informatics",
      period: "May 2018 – Jun 2019",
      color: "#3FADC5", // Teal color
      icon: "💼",
      achievements: [
        {
          title: "Infrastructure Automation",
          value: "80% time savings",
          description:
            "Implemented Terraform to provision and manage cloud resources, reducing manual effort dramatically",
          visual: <InfrastructureAutomationVisual />,
        },
        {
          title: "Database Performance Optimization",
          value: "99.99% availability",
          description:
            "Optimized AWS RDS instances with read replicas and failover strategies for maximum reliability",
          visual: <DatabaseVisual />,
        },
        {
          title: "Container Orchestration",
          value: "95% deployment consistency",
          description:
            "Managed containerized applications using Docker and Kubernetes (EKS) for improved scalability",
          visual: <ContainerVisual />,
        },
      ],
    },
  ];

  // Auto-advance through achievements
  useEffect(() => {
    // Set initial state to show details
    setShowDetails(true);

    const timer = setInterval(() => {
      const currentAchievements = timelineData[activeIndex].achievements;
      setActiveAchievementIndex((prev) =>
        prev < currentAchievements.length - 1 ? prev + 1 : 0
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [activeIndex, timelineData]);

  // Auto-advance through companies
  useEffect(() => {
    if (activeAchievementIndex === 0 && showDetails) {
      const timer = setTimeout(() => {
        setActiveIndex((prev) =>
          prev < timelineData.length - 1 ? prev + 1 : 0
        );
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [activeAchievementIndex, showDetails, timelineData.length]);

  const handleTimelineClick = (index: number) => {
    setActiveIndex(index);
    setActiveAchievementIndex(0);
    setShowDetails(true);

    if (timelineRef.current) {
      timelineRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    controls.start({ opacity: 1, y: 0 });
  };

  return (
    <section className="experience-journey" ref={timelineRef}>
      <h2 className="section-title">My Professional Journey</h2>

      <div className="timeline-container">
        <div className="timeline-track">
          {timelineData.map((item, index) => (
            <motion.div
              key={index}
              className={`timeline-node ${
                activeIndex === index ? "active" : ""
              }`}
              style={{
                backgroundColor: item.color,
                left: `${(index / (timelineData.length - 1)) * 100}%`,
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleTimelineClick(index)}
            >
              <span className="timeline-icon">{item.icon}</span>
              <div className="timeline-tooltip">
                <p className="tooltip-company">{item.company}</p>
                <p className="tooltip-period">{item.period}</p>
              </div>
            </motion.div>
          ))}
          <div className="timeline-line"></div>
        </div>

        <AnimatePresence mode="wait">
          {showDetails && (
            <motion.div
              key={activeIndex}
              className="timeline-details"
              initial={{ opacity: 0, y: 50 }}
              animate={controls}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
            >
              <div className="role-header">
                <h3 className="role-title">{timelineData[activeIndex].role}</h3>
                <p className="role-company">
                  {timelineData[activeIndex].company}
                </p>
                <p className="role-period">
                  {timelineData[activeIndex].period}
                </p>
              </div>

              <div className="achievements-grid">
                {timelineData[activeIndex].achievements.map(
                  (achievement, i) => (
                    <motion.div
                      key={i}
                      className="achievement-card"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.2, duration: 0.5 }}
                      whileHover={{
                        y: -10,
                        boxShadow: `0 10px 30px rgba(${timelineData[activeIndex]
                          .color!.substring(1)
                          .match(/.{2}/g)!
                          .map((hex) => parseInt(hex, 16))
                          .join(", ")}, 0.3)`,
                      }}
                    >
                      <div className="achievement-visual">
                        {achievement.visual}
                      </div>
                      <div className="achievement-content">
                        <h4 className="achievement-title">
                          {achievement.title}
                        </h4>
                        <div className="achievement-value">
                          {achievement.value}
                        </div>
                        <p className="achievement-description">
                          {achievement.description}
                        </p>
                      </div>
                    </motion.div>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default ExperienceJourney;
