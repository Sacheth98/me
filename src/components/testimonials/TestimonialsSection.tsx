// components/testimonials/TestimonialsSection.tsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TestimonialsSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      quote:
        "Sacheth's expertise in AWS architecture transformed our cloud infrastructure. His ability to design resilient, cost-effective solutions saved us millions in operational costs while improving our application performance dramatically.",
      author: "Abhishek",
      title: "Cloud Engineering Manager, Amazon AWS",
      color: "#FF9900", // AWS orange
    },
    {
      quote:
        "During his time as a Graduate Assistant, Sacheth demonstrated exceptional technical skills and leadership ability. His mentorship of undergraduate students and contributions to our web infrastructure were invaluable.",
      author: "Dr. Laura Thompson",
      title: "Professor, Texas State University",
      color: "#501214", // Texas State maroon
    },
  ];

  // Auto-advance testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 8000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="testimonials-section">
      <h2 className="section-title">What People Say</h2>

      <div className="testimonials-container">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            className="testimonial-card"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.7 }}
            style={{
              borderColor: testimonials[activeIndex].color,
              boxShadow: `0 10px 30px ${testimonials[activeIndex].color}20`,
            }}
          >
            <div
              className="quote-mark"
              style={{ color: testimonials[activeIndex].color }}
            >
              ❝
            </div>
            <p className="testimonial-quote">
              {testimonials[activeIndex].quote}
            </p>

            <div className="testimonial-author">
              <div className="author-avatar">
                <img
                  alt={testimonials[activeIndex].author}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      testimonials[activeIndex].author
                    )}&background=${testimonials[activeIndex].color.substring(
                      1
                    )}&color=fff`;
                  }}
                />
              </div>
              <div className="author-info">
                <h4 className="author-name">
                  {testimonials[activeIndex].author}
                </h4>
                <p className="author-title">
                  {testimonials[activeIndex].title}
                </p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="testimonial-indicators">
          {testimonials.map((_, index) => (
            <motion.button
              key={index}
              className={`indicator ${index === activeIndex ? "active" : ""}`}
              onClick={() => setActiveIndex(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              style={{
                backgroundColor:
                  index === activeIndex
                    ? testimonials[index].color
                    : "rgba(255, 255, 255, 0.2)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
