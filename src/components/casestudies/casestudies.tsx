import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WebsiteManagementVisual from "../experience/websitemanagementvisual";
import DatabaseVisual from "../experience/databasevisual";
gsap.registerPlugin(ScrollTrigger);

function useScrollAnimation(
  threshold: number = 0.2
): [React.RefObject<HTMLDivElement>, boolean] {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>(null);

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

const CaseStudies = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [ref, isVisible] = useScrollAnimation(0.1);

  useEffect(() => {
    if (containerRef.current) {
      setTimeout(() => {
        window.dispatchEvent(new Event("resize"));
        ScrollTrigger.refresh();
      }, 500);
    }

    const container = containerRef.current;
    const sections = gsap.utils.toArray<HTMLElement>(".case-study");

    if (sections.length === 0) return;

    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      pin: true,
      scrub: 1,
      snap: 1 / (sections.length - 1),
      end: () => (container ? "+=" + container.offsetWidth : "+=1000px"),
    });

    gsap.to(sections, {
      xPercent: -100 * (sections.length - 1),
      ease: "none",
      scrollTrigger: scrollTrigger,
    });

    return () => {
      scrollTrigger.kill();
    };
  }, []);

  const caseStudies = [
    {
      title: "Azure Cloud Architecture Transformation",
      client: "WIS International",
      problem:
        "Legacy infrastructure with frequent outages during peak business hours, causing data synchronization issues and reduced operational efficiency",
      solution:
        "Architected multi-tier cloud infrastructure on Microsoft Azure with application gateway, Azure Kubernetes Service, and integrated security systems",
      results: [
        "Achieved 99.9% system uptime, a 15% improvement over previous infrastructure",
        "Reduced infrastructure costs by 25% through optimized resource allocation",
        "Enhanced security posture with zero successful penetration tests post-implementation",
        "Improved application response time by 40% through distributed architecture",
      ],
      visualComponent: (
        <div className="visual-placeholder">
          Azure Architecture Transformation
        </div>
      ),
      color: "#0078D4", // Azure blue
    },
    {
      title: "Enterprise CI/CD Pipeline Modernization",
      client: "WIS International",
      problem:
        "Manual deployment processes leading to frequent errors, inconsistent environments, and slow release cycles affecting business agility",
      solution:
        "Directed the implementation of comprehensive CI/CD pipelines using Azure DevOps with automated testing, deployment, and SonarQube code quality analysis",
      results: [
        "Increased deployment frequency by 300%, from monthly to multiple times per week",
        "Reduced deployment errors by 90% through automated validation and consistency checks",
        "Streamlined the code review process, cutting manual inspection time by 70%",
        "Enabled rapid feature delivery with confidence through comprehensive automated testing",
      ],
      visualComponent: (
        <div className="visual-placeholder">CI/CD Pipeline Modernization</div>
      ),
      color: "#00A4EF", // Azure DevOps blue
    },
    {
      title: "AWS High-Traffic System Optimization",
      client: "Amazon AWS",
      problem:
        "Critical application unable to handle traffic spikes, resulting in performance degradation and potential revenue loss during peak periods",
      solution:
        "Engineered auto-scaling AWS infrastructure with load balancing, distributed caching, and performance optimization for 10,000+ concurrent users",
      results: [
        "Successfully handled 300% traffic spikes while maintaining sub-100ms response times",
        "Implemented read replicas and connection pooling to distribute database load",
        "Designed regional failover architecture ensuring 99.99% application availability",
        "Optimized resource utilization saving approximately $200K annually in infrastructure costs",
      ],
      visualComponent: (
        <div className="visual-placeholder">AWS High-Traffic Optimization</div>
      ),
      color: "#FF9900", // AWS orange
    },

    {
      title: "University Website Modernization",
      client: "Texas State University",
      problem:
        "Outdated departmental websites with inconsistent user experiences and manual update processes",
      solution:
        "Implemented modern content management system with streamlined workflows and responsive design principles",
      results: [
        "Reduced content update time by 70%",
        "Improved mobile user experience with responsive designs",
        "Standardized branding across 20+ departmental sites",
        "Implemented analytics for data-driven design improvements",
      ],
      visualComponent: <WebsiteManagementVisual />,
      color: "#501214", // Texas State maroon
    },
    // Add Sudhi Informatics case study
    {
      title: "Enterprise Database Migration & Optimization",
      client: "Sudhi Informatics",
      problem:
        "Performance bottlenecks and scalability limitations with on-premises database systems",
      solution:
        "Migrated to AWS RDS with optimized read replicas, connection pooling, and automated failover",
      results: [
        "Achieved 99.99% database availability",
        "Reduced query response times by 65%",
        "Implemented automated backup and disaster recovery",
        "Cut operational database costs by 40%",
      ],
      visualComponent: <DatabaseVisual />,
      color: "#3FADC5", // Teal color
    },
  ];

  return (
    <section className="case-studies-container" ref={ref}>
      <h2 className="section-title">Project Success Stories</h2>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
        className="horizontal-scroll-wrapper"
        ref={containerRef}
      >
        {caseStudies.map((study, index) => (
          <div
            key={index}
            className="case-study"
            style={{ backgroundColor: `${study.color}10` }}
          >
            <div className="case-study-content">
              <h3 className="case-study-title" style={{ color: study.color }}>
                {study.title}
              </h3>
              <p className="case-study-client">{study.client}</p>

              <div className="case-study-journey">
                <div className="journey-step">
                  <h4>Challenge</h4>
                  <p>{study.problem}</p>
                </div>
                <div className="journey-arrow">→</div>
                <div className="journey-step">
                  <h4>Solution</h4>
                  <p>{study.solution}</p>
                </div>
                <div className="journey-arrow">→</div>
                <div className="journey-step">
                  <h4>Impact</h4>
                  <ul>
                    {study.results.map((result, i) => (
                      <li key={i}>{result}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="case-study-visual">{study.visualComponent}</div>
          </div>
        ))}
      </motion.div>

      <div className="scroll-indicator">
        <span>Scroll horizontally</span>
        <div className="scroll-arrow">→</div>
      </div>
    </section>
  );
};

export default CaseStudies;
