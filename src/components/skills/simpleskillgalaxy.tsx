// components/skills/SimpleSkillGalaxy.tsx - a fallback for the 3D galaxy
import React from "react";
import { motion } from "framer-motion";

interface SimpleSkillGalaxyProps {
  isMobile: boolean;
}

const SimpleSkillGalaxy: React.FC<SimpleSkillGalaxyProps> = ({ isMobile }) => {
  const skillCategories = [
    {
      name: "Cloud Platforms",
      color: "#FF9900",
      skills: [
        { name: "AWS", level: 9, color: "#FF9900" },
        { name: "Azure", level: 8, color: "#0078D4" },
        { name: "GCP", level: 7, color: "#4285F4" },
        { name: "Kubernetes", level: 8.5, color: "#326CE5" },
        { name: "Docker", level: 8, color: "#2496ED" },
      ],
    },
    {
      name: "DevOps Tools",
      color: "#00FF9D",
      skills: [
        { name: "Terraform", level: 9, color: "#7B42BC" },
        { name: "Jenkins", level: 8, color: "#D33833" },
        { name: "Ansible", level: 7.5, color: "#EE0000" },
        { name: "GitHub Actions", level: 8, color: "#2088FF" },
        { name: "Prometheus", level: 7, color: "#E6522C" },
      ],
    },
    {
      name: "Programming",
      color: "#0066FF",
      skills: [
        { name: "Python", level: 8, color: "#3776AB" },
        { name: "Bash", level: 7.5, color: "#4EAA25" },
        { name: "YAML", level: 8, color: "#CB171E" },
        { name: "Java", level: 6, color: "#007396" },
      ],
    },
  ];

  return (
    <div className="simple-skill-galaxy-container">
      <h2 className="section-title">My Technical Universe</h2>
      <p className="section-description">
        Explore my specialized technical skills across multiple domains
      </p>

      <div className="skill-categories">
        {skillCategories.map((category, categoryIndex) => (
          <motion.div
            key={categoryIndex}
            className="skill-category-card"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: categoryIndex * 0.2, duration: 0.5 }}
          >
            <h3 className="category-title" style={{ color: category.color }}>
              {category.name}
            </h3>

            <div className="skill-bars">
              {category.skills.map((skill, skillIndex) => (
                <motion.div
                  key={skillIndex}
                  className="skill-bar-container"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: "100%" }}
                  transition={{
                    delay: categoryIndex * 0.2 + skillIndex * 0.1,
                    duration: 0.7,
                  }}
                >
                  <div className="skill-name-level">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-level">{skill.level}/10</span>
                  </div>

                  <div className="skill-bar-bg">
                    <motion.div
                      className="skill-bar-fill"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level * 10}%` }}
                      transition={{
                        delay: categoryIndex * 0.2 + skillIndex * 0.1 + 0.5,
                        duration: 0.8,
                        ease: "easeOut",
                      }}
                      style={{ backgroundColor: skill.color }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default SimpleSkillGalaxy;
