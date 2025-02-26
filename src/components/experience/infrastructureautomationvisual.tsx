import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const InfrastructureAutomationVisual = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const safeCanvas = canvas;

    const ctx = safeCanvas.getContext("2d");
    if (!ctx) return;
    const safeCtx = ctx;

    safeCanvas.width = safeCanvas.offsetWidth;
    safeCanvas.height = safeCanvas.offsetHeight;

    let time = 0;

    // Define the infrastructure components
    const components = [
      {
        name: "Web Servers",
        x: 80,
        y: 60,
        width: 100,
        height: 40,
        color: "#3FADC5",
        count: 3,
      },
      {
        name: "App Servers",
        x: 80,
        y: 140,
        width: 100,
        height: 40,
        color: "#3FADC5",
        count: 4,
      },
      {
        name: "Databases",
        x: 80,
        y: 220,
        width: 100,
        height: 40,
        color: "#3FADC5",
        count: 2,
      },
    ];

    // Automation scripts
    const scripts = [
      {
        name: "Provision",
        x: 280,
        y: 80,
        width: 120,
        height: 40,
        color: "#1B3A4B",
      },
      {
        name: "Configure",
        x: 280,
        y: 140,
        width: 120,
        height: 40,
        color: "#1B3A4B",
      },
      {
        name: "Deploy",
        x: 280,
        y: 200,
        width: 120,
        height: 40,
        color: "#1B3A4B",
      },
    ];

    // Automation status
    let automationState = 0; // 0: provision, 1: configure, 2: deploy
    let automationProgress = 0;
    let currentComponent = 0;

    function animate() {
      safeCtx.clearRect(0, 0, safeCanvas.width, safeCanvas.height);
      time += 0.01;

      // Update automation state
      automationProgress += 0.01;
      if (automationProgress > 1) {
        automationProgress = 0;
        automationState = (automationState + 1) % 3;
        if (automationState === 0) {
          currentComponent = (currentComponent + 1) % components.length;
        }
      }

      // Draw "Manual vs Automated" title
      safeCtx.fillStyle = "#3FADC5";
      safeCtx.font = "bold 16px Arial";
      safeCtx.textAlign = "center";
      safeCtx.fillText(
        "Manual vs Automated Infrastructure",
        safeCanvas.width / 2,
        30
      );

      // Draw comparison arrows and labels
      safeCtx.fillStyle = "#ccc";
      safeCtx.font = "14px Arial";
      safeCtx.textAlign = "center";
      safeCtx.fillText("Manual", 80, 30);
      safeCtx.fillText("Automated", 320, 30);

      // Draw "~80% Time Savings" in the middle
      safeCtx.fillStyle = "#3FADC5";
      safeCtx.font = "bold 14px Arial";
      safeCtx.fillText(
        "~80% Time Savings",
        safeCanvas.width / 2,
        safeCanvas.height - 20
      );

      // Draw manual speed icon (slow)
      safeCtx.fillStyle = "#ccc";
      safeCtx.beginPath();
      safeCtx.moveTo(130, 30);
      safeCtx.lineTo(140, 25);
      safeCtx.lineTo(140, 35);
      safeCtx.closePath();
      safeCtx.fill();

      // Draw automated speed icon (fast)
      safeCtx.fillStyle = "#3FADC5";
      safeCtx.beginPath();
      safeCtx.moveTo(360, 25);
      safeCtx.lineTo(380, 30);
      safeCtx.lineTo(360, 35);
      safeCtx.closePath();
      safeCtx.fill();

      // Draw vertical division line
      safeCtx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      safeCtx.lineWidth = 1;
      safeCtx.beginPath();
      safeCtx.moveTo(safeCanvas.width / 2, 40);
      safeCtx.lineTo(safeCanvas.width / 2, safeCanvas.height - 40);
      safeCtx.stroke();

      // Draw manual process - a person figure
      drawPersonIcon(140, 140, "#ccc");

      // Draw manual process clock (slow)
      drawClock(180, 140, 15, "#ccc", (10 * time) % 12);

      // Draw infrastructure components with labels and counts
      components.forEach((comp, index) => {
        if (index === 0) {
          safeCtx.fillStyle = "#ccc";
          safeCtx.font = "12px Arial";
          safeCtx.textAlign = "left";
          safeCtx.fillText("Infrastructure:", comp.x - 75, comp.y + 20);
        }

        safeCtx.fillStyle = "#ccc";
        safeCtx.font = "12px Arial";
        safeCtx.textAlign = "right";
        safeCtx.fillText(
          `x${comp.count}`,
          comp.x - 10,
          comp.y + comp.height / 2 + 5
        );

        // Draw the component (highlight active one)
        safeCtx.fillStyle = comp.color;
        if (index === currentComponent) {
          safeCtx.fillStyle = "#5FCDDD"; // Brighter for active
        }
        safeCtx.beginPath();
        safeCtx.roundRect(comp.x, comp.y, comp.width, comp.height, 6);
        safeCtx.fill();

        // Component name
        safeCtx.fillStyle = "#fff";
        safeCtx.font = "12px Arial";
        safeCtx.textAlign = "center";
        safeCtx.textBaseline = "middle";
        safeCtx.fillText(
          comp.name,
          comp.x + comp.width / 2,
          comp.y + comp.height / 2
        );
      });

      // Draw automation scripts with progress bars
      scripts.forEach((script, index) => {
        if (index === 0) {
          safeCtx.fillStyle = "#ccc";
          safeCtx.font = "12px Arial";
          safeCtx.textAlign = "left";
          safeCtx.fillText("Automation:", script.x - 75, script.y + 20);
        }

        safeCtx.fillStyle = script.color;
        if (index === automationState) {
          safeCtx.fillStyle = "#3FADC5"; // Highlight active script
        }
        safeCtx.beginPath();
        safeCtx.roundRect(script.x, script.y, script.width, script.height, 6);
        safeCtx.fill();

        safeCtx.fillStyle = "#fff";
        safeCtx.font = "12px Arial";
        safeCtx.textAlign = "center";
        safeCtx.textBaseline = "middle";
        safeCtx.fillText(
          script.name,
          script.x + script.width / 2,
          script.y + script.height / 2
        );

        // Draw progress bar for active script
        if (index === automationState) {
          const barWidth = script.width - 20;
          const barHeight = 6;
          const barX = script.x + 10;
          const barY = script.y + script.height + 10;
          safeCtx.fillStyle = "rgba(255, 255, 255, 0.2)";
          safeCtx.fillRect(barX, barY, barWidth, barHeight);
          safeCtx.fillStyle = "#3FADC5";
          safeCtx.fillRect(
            barX,
            barY,
            barWidth * automationProgress,
            barHeight
          );
        }
      });

      // Draw automation fast clock (fast)
      drawClock(380, 140, 15, "#3FADC5", (100 * time) % 12);

      // Draw connection between active script and active component
      if (automationState >= 0 && automationState < scripts.length) {
        const script = scripts[automationState];
        const comp = components[currentComponent];
        safeCtx.strokeStyle = "#3FADC5";
        safeCtx.lineWidth = 2;
        safeCtx.beginPath();
        safeCtx.moveTo(script.x, script.y + script.height / 2);
        safeCtx.lineTo(comp.x + comp.width, comp.y + comp.height / 2);
        safeCtx.stroke();

        // Animated data packet along the connection
        const t = automationProgress;
        const x = script.x - (script.x - (comp.x + comp.width)) * t;
        const y = script.y + script.height / 2;
        safeCtx.fillStyle = "#3FADC5";
        safeCtx.beginPath();
        safeCtx.arc(x, y, 4, 0, Math.PI * 2);
        safeCtx.fill();

        // Glow effect
        const gradient = safeCtx.createRadialGradient(x, y, 0, x, y, 10);
        gradient.addColorStop(0, "rgba(63, 173, 197, 0.5)");
        gradient.addColorStop(1, "rgba(63, 173, 197, 0)");
        safeCtx.fillStyle = gradient;
        safeCtx.beginPath();
        safeCtx.arc(x, y, 10, 0, Math.PI * 2);
        safeCtx.fill();
      }

      requestAnimationFrame(animate);
    }

    // Helper: Draw a simple person icon
    function drawPersonIcon(x: number, y: number, color: string) {
      safeCtx.fillStyle = color;
      safeCtx.beginPath();
      safeCtx.arc(x, y - 15, 8, 0, Math.PI * 2);
      safeCtx.fill();
      safeCtx.beginPath();
      safeCtx.moveTo(x, y - 7);
      safeCtx.lineTo(x, y + 7);
      safeCtx.stroke();
      safeCtx.beginPath();
      safeCtx.moveTo(x - 10, y);
      safeCtx.lineTo(x + 10, y);
      safeCtx.stroke();
      safeCtx.beginPath();
      safeCtx.moveTo(x, y + 7);
      safeCtx.lineTo(x - 5, y + 20);
      safeCtx.moveTo(x, y + 7);
      safeCtx.lineTo(x + 5, y + 20);
      safeCtx.stroke();
    }

    // Helper: Draw a clock
    function drawClock(
      x: number,
      y: number,
      radius: number,
      color: string,
      hours: number
    ) {
      safeCtx.strokeStyle = color;
      safeCtx.fillStyle = "rgba(0, 0, 0, 0.2)";
      safeCtx.beginPath();
      safeCtx.arc(x, y, radius, 0, Math.PI * 2);
      safeCtx.fill();
      safeCtx.stroke();

      const hourAngle = (hours / 12) * Math.PI * 2 - Math.PI / 2;
      const hourHandLength = radius * 0.5;
      safeCtx.beginPath();
      safeCtx.moveTo(x, y);
      safeCtx.lineTo(
        x + hourHandLength * Math.cos(hourAngle),
        y + hourHandLength * Math.sin(hourAngle)
      );
      safeCtx.stroke();

      const minuteAngle = (((hours * 5) % 60) / 60) * Math.PI * 2 - Math.PI / 2;
      const minuteHandLength = radius * 0.8;
      safeCtx.beginPath();
      safeCtx.moveTo(x, y);
      safeCtx.lineTo(
        x + minuteHandLength * Math.cos(minuteAngle),
        y + minuteHandLength * Math.sin(minuteAngle)
      );
      safeCtx.stroke();
    }

    animate();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className="infrastructure-automation-container">
      <motion.div
        className="automation-glow"
        animate={{
          boxShadow: [
            "0 0 20px rgba(63, 173, 197, 0.3)",
            "0 0 40px rgba(63, 173, 197, 0.6)",
            "0 0 20px rgba(63, 173, 197, 0.3)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default InfrastructureAutomationVisual;
