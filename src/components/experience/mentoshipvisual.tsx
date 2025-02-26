import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface Connection {
  from: { x: number; y: number; radius: number; color: string };
  to: {
    x: number;
    y: number;
    radius: number;
    color: string;
    knowledge: number;
    technology: string;
  };
  active: boolean;
  delay: number;
}

const MentorshipVisual = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Capture canvas in a safe variable
    const safeCanvas = canvas;

    const ctx = safeCanvas.getContext("2d");
    if (!ctx) return;
    // Capture context in a safe variable
    const safeCtx = ctx;

    safeCanvas.width = safeCanvas.offsetWidth;
    safeCanvas.height = safeCanvas.offsetHeight;

    let time = 0;

    // Define mentor and students
    const mentor = {
      x: safeCanvas.width / 2,
      y: 70,
      radius: 30,
      color: "#501214", // Texas State maroon
    };

    const students = [
      {
        x: 80,
        y: 180,
        radius: 20,
        color: "#83303C",
        knowledge: 0,
        technology: "AWS",
      },
      {
        x: safeCanvas.width / 2,
        y: 180,
        radius: 20,
        color: "#83303C",
        knowledge: 0,
        technology: "Web Dev",
      },
      {
        x: safeCanvas.width - 80,
        y: 180,
        radius: 20,
        color: "#83303C",
        knowledge: 0,
        technology: "Azure",
      },
    ];

    // Knowledge connections, explicitly typed
    const connections: Connection[] = [];
    students.forEach((student, index) => {
      connections.push({
        from: mentor,
        to: student,
        active: false,
        delay: index * 2, // seconds
      });
    });

    // Technologies to mentor
    const technologies = [
      "AWS Services",
      "Cloud Architecture",
      "DevOps Practices",
      "Web Development",
      "Azure Fundamentals",
      "Containerization",
      "CI/CD Pipelines",
    ];

    function animate() {
      safeCtx.clearRect(0, 0, safeCanvas.width, safeCanvas.height);
      time += 0.01;

      // Background - subtle university theme
      const gradient = safeCtx.createLinearGradient(0, 0, 0, safeCanvas.height);
      gradient.addColorStop(0, "rgba(80, 18, 20, 0.1)"); // Texas State maroon
      gradient.addColorStop(1, "rgba(131, 48, 60, 0.1)"); // Texas State gold
      safeCtx.fillStyle = gradient;
      safeCtx.fillRect(0, 0, safeCanvas.width, safeCanvas.height);

      // Draw decorative elements - books and code
      const bookshelfY = safeCanvas.height - 40;
      const bookWidth = 15;
      const bookCount = Math.floor(safeCanvas.width / (bookWidth + 2));
      for (let i = 0; i < bookCount; i++) {
        const bookHeight = 10 + Math.random() * 20;
        const bookX = i * (bookWidth + 2) + 5;
        const bookColors = [
          "#501214",
          "#83303C",
          "#D4AF37",
          "#1A5276",
          "#117A65",
        ];
        const colorIndex = i % bookColors.length;
        safeCtx.fillStyle = bookColors[colorIndex];
        safeCtx.fillRect(bookX, bookshelfY - bookHeight, bookWidth, bookHeight);
      }

      // Draw connections
      connections.forEach((conn, index) => {
        if (time > conn.delay && time % 10 < 5) {
          conn.active = true;
        } else {
          conn.active = false;
        }

        if (conn.active) {
          // Draw knowledge flow line
          safeCtx.strokeStyle = "rgba(80, 18, 20, 0.3)";
          safeCtx.lineWidth = 2;
          safeCtx.beginPath();
          safeCtx.moveTo(conn.from.x, conn.from.y + conn.from.radius);
          safeCtx.lineTo(conn.to.x, conn.to.y - conn.to.radius);
          safeCtx.stroke();

          // Animate knowledge particles
          const particleCount = 3;
          for (let i = 0; i < particleCount; i++) {
            const t = (time * 2 + i / particleCount) % 1;
            const x = conn.from.x + (conn.to.x - conn.from.x) * t;
            const y =
              conn.from.y +
              conn.from.radius +
              (conn.to.y - conn.to.radius - conn.from.y - conn.from.radius) * t;
            safeCtx.fillStyle = "#D4AF37"; // Gold for knowledge
            safeCtx.beginPath();
            safeCtx.arc(x, y, 4, 0, Math.PI * 2);
            safeCtx.fill();

            const glow = safeCtx.createRadialGradient(x, y, 0, x, y, 10);
            glow.addColorStop(0, "rgba(212, 175, 55, 0.5)");
            glow.addColorStop(1, "rgba(212, 175, 55, 0)");
            safeCtx.fillStyle = glow;
            safeCtx.beginPath();
            safeCtx.arc(x, y, 10, 0, Math.PI * 2);
            safeCtx.fill();
          }

          // Increase student knowledge
          students[index].knowledge += 0.002;
          if (students[index].knowledge > 1) {
            students[index].knowledge = 1;
          }
        }
      });

      // Draw mentor
      safeCtx.fillStyle = mentor.color;
      safeCtx.beginPath();
      safeCtx.arc(mentor.x, mentor.y, mentor.radius, 0, Math.PI * 2);
      safeCtx.fill();

      safeCtx.fillStyle = "#fff";
      safeCtx.font = "bold 12px Arial";
      safeCtx.textAlign = "center";
      safeCtx.fillText("Mentor", mentor.x, mentor.y);

      // Draw students
      students.forEach((student, index) => {
        safeCtx.fillStyle = student.color;
        safeCtx.beginPath();
        safeCtx.arc(student.x, student.y, student.radius, 0, Math.PI * 2);
        safeCtx.fill();

        safeCtx.fillStyle = "#fff";
        safeCtx.font = "bold 10px Arial";
        safeCtx.textAlign = "center";
        safeCtx.fillText("Student", student.x, student.y);

        // Draw knowledge level below student
        const knowledgeWidth = 60;
        const knowledgeHeight = 6;
        const knowledgeX = student.x - knowledgeWidth / 2;
        const knowledgeY = student.y + student.radius + 10;
        safeCtx.fillStyle = "rgba(255, 255, 255, 0.2)";
        safeCtx.fillRect(
          knowledgeX,
          knowledgeY,
          knowledgeWidth,
          knowledgeHeight
        );
        safeCtx.fillStyle = "#D4AF37";
        safeCtx.fillRect(
          knowledgeX,
          knowledgeY,
          knowledgeWidth * student.knowledge,
          knowledgeHeight
        );
        safeCtx.fillStyle = "#fff";
        safeCtx.font = "10px Arial";
        safeCtx.fillText(student.technology, student.x, knowledgeY + 20);
      });

      // Draw technologies on the right
      safeCtx.textAlign = "left";
      safeCtx.font = "12px Arial";
      const techX = safeCanvas.width - 140;
      const techStartY = 40;
      safeCtx.fillStyle = "#501214";
      safeCtx.fillText("Teaching:", techX, techStartY - 15);
      technologies.forEach((tech, index) => {
        const isHighlighted = Math.floor(time) % technologies.length === index;
        safeCtx.fillStyle = isHighlighted ? "#D4AF37" : "#ccc";
        safeCtx.fillText(tech, techX, techStartY + index * 20);
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      // Cleanup if necessary
    };
  }, []);

  return (
    <div className="mentorship-visual-container">
      <motion.div
        className="mentorship-glow"
        animate={{
          boxShadow: [
            "0 0 20px rgba(80, 18, 20, 0.3)",
            "0 0 40px rgba(80, 18, 20, 0.6)",
            "0 0 20px rgba(80, 18, 20, 0.3)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default MentorshipVisual;
