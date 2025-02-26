import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface User {
  x: number;
  y: number;
  size: number;
  speed: number;
  angle: number;
  distance: number;
  authenticated: boolean;
  authenticateTime: number;
}

const AzureADVisual = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Capture the canvas as a non-null variable
    const safeCanvas = canvas;

    const ctx = safeCanvas.getContext("2d");
    if (!ctx) return;
    // Capture the non-null context
    const safeCtx = ctx;

    // Set canvas dimensions to match its rendered size
    safeCanvas.width = safeCanvas.offsetWidth;
    safeCanvas.height = safeCanvas.offsetHeight;

    let time = 0;

    // Define Active Directory components
    const adCenter = {
      x: safeCanvas.width / 2,
      y: safeCanvas.height / 2,
      radius: 70,
      color: "#0078D4", // Azure blue
      name: "Azure AD",
    };

    // Identity types
    const identityTypes = [
      { name: "Users", count: 3000, color: "#50E6FF", angle: 0 },
      {
        name: "Groups",
        count: 800,
        color: "#773ADC",
        angle: (Math.PI * 2) / 5,
      },
      { name: "Apps", count: 200, color: "#FFB900", angle: (Math.PI * 4) / 5 },
      {
        name: "Devices",
        count: 1000,
        color: "#8661C5",
        angle: (Math.PI * 6) / 5,
      },
      { name: "Roles", count: 50, color: "#FF8C00", angle: (Math.PI * 8) / 5 },
    ];

    // Security features
    const securityFeatures = [
      "Multi-Factor Authentication",
      "Conditional Access",
      "Privileged Identity Management",
      "Identity Protection",
      "Single Sign-On",
    ];

    // Animation state for users with proper type
    const users: User[] = [];
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 120 + Math.random() * 80;

      users.push({
        x: adCenter.x + Math.cos(angle) * distance,
        y: adCenter.y + Math.sin(angle) * distance,
        size: 5 + Math.random() * 5,
        speed: 0.005 + Math.random() * 0.01,
        angle: angle,
        distance: distance,
        authenticated: false,
        authenticateTime: Math.random() * 5,
      });
    }

    function animate() {
      safeCtx.clearRect(0, 0, safeCanvas.width, safeCanvas.height);
      time += 0.01;

      // Draw title
      safeCtx.fillStyle = "#0078D4";
      safeCtx.font = "bold 18px Arial";
      safeCtx.textAlign = "center";
      safeCtx.fillText(
        "Azure Active Directory Integration",
        safeCanvas.width / 2,
        30
      );

      // User count at the bottom
      safeCtx.fillStyle = "#50E6FF";
      safeCtx.font = "bold 16px Arial";
      safeCtx.fillText(
        "5,000+ Users",
        safeCanvas.width / 2,
        safeCanvas.height - 20
      );

      // Draw subtle background grid
      safeCtx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      safeCtx.lineWidth = 1;
      for (let x = 0; x < safeCanvas.width; x += 30) {
        safeCtx.beginPath();
        safeCtx.moveTo(x, 0);
        safeCtx.lineTo(x, safeCanvas.height);
        safeCtx.stroke();
      }
      for (let y = 0; y < safeCanvas.height; y += 30) {
        safeCtx.beginPath();
        safeCtx.moveTo(0, y);
        safeCtx.lineTo(safeCanvas.width, y);
        safeCtx.stroke();
      }

      // Draw Azure AD center
      const centerGradient = safeCtx.createRadialGradient(
        adCenter.x,
        adCenter.y,
        0,
        adCenter.x,
        adCenter.y,
        adCenter.radius
      );
      centerGradient.addColorStop(0, "#0078D4");
      centerGradient.addColorStop(1, "#0063B1");
      safeCtx.fillStyle = centerGradient;
      safeCtx.beginPath();
      safeCtx.arc(adCenter.x, adCenter.y, adCenter.radius, 0, Math.PI * 2);
      safeCtx.fill();

      // AD Center glow
      const glowGradient = safeCtx.createRadialGradient(
        adCenter.x,
        adCenter.y,
        adCenter.radius * 0.9,
        adCenter.x,
        adCenter.y,
        adCenter.radius * 1.5
      );
      glowGradient.addColorStop(0, "rgba(0, 120, 212, 0.5)");
      glowGradient.addColorStop(1, "rgba(0, 120, 212, 0)");
      safeCtx.fillStyle = glowGradient;
      safeCtx.beginPath();
      safeCtx.arc(
        adCenter.x,
        adCenter.y,
        adCenter.radius * 1.5,
        0,
        Math.PI * 2
      );
      safeCtx.fill();

      // Azure AD logo (simplified)
      safeCtx.fillStyle = "#FFFFFF";
      safeCtx.font = "bold 24px Arial";
      safeCtx.textAlign = "center";
      safeCtx.textBaseline = "middle";
      safeCtx.fillText("AD", adCenter.x, adCenter.y);
      safeCtx.font = "12px Arial";
      safeCtx.fillText("Azure Active Directory", adCenter.x, adCenter.y + 20);

      // Draw identity types
      identityTypes.forEach((type, index) => {
        const radius = adCenter.radius + 40;
        const x = adCenter.x + Math.cos(type.angle) * radius;
        const y = adCenter.y + Math.sin(type.angle) * radius;

        // Draw connection to center
        safeCtx.strokeStyle = `${type.color}80`;
        safeCtx.lineWidth = 2;
        safeCtx.beginPath();
        safeCtx.moveTo(adCenter.x, adCenter.y);
        safeCtx.lineTo(x, y);
        safeCtx.stroke();

        // Draw identity type bubble
        safeCtx.fillStyle = type.color;
        safeCtx.beginPath();
        safeCtx.arc(x, y, 25, 0, Math.PI * 2);
        safeCtx.fill();

        // Type name
        safeCtx.fillStyle = "#FFFFFF";
        safeCtx.font = "bold 12px Arial";
        safeCtx.textAlign = "center";
        safeCtx.textBaseline = "middle";
        safeCtx.fillText(type.name, x, y);

        // Count with animation
        const displayCount = Math.floor(
          type.count * (0.5 + 0.5 * Math.sin(time * 0.5 + index))
        );
        safeCtx.font = "10px Arial";
        safeCtx.fillText(`${displayCount}+`, x, y + 15);
      });

      // Update and draw users
      users.forEach((user) => {
        // Update position - orbit around AD center
        user.angle += user.speed;
        user.x = adCenter.x + Math.cos(user.angle) * user.distance;
        user.y = adCenter.y + Math.sin(user.angle) * user.distance;

        // Check if it's time to authenticate
        if (!user.authenticated && time > user.authenticateTime) {
          user.authenticated = true;
        }

        // Draw user
        safeCtx.fillStyle = user.authenticated ? "#50E6FF" : "#ccc";
        safeCtx.beginPath();
        safeCtx.arc(user.x, user.y, user.size, 0, Math.PI * 2);
        safeCtx.fill();

        // Draw connection to AD when authenticated
        if (user.authenticated) {
          safeCtx.strokeStyle = "rgba(80, 230, 255, 0.3)";
          safeCtx.lineWidth = 1;
          safeCtx.beginPath();
          safeCtx.moveTo(user.x, user.y);
          safeCtx.lineTo(adCenter.x, adCenter.y);
          safeCtx.stroke();

          // Animated authentication token
          const tokenProgress = (time * 2) % 1;
          const tokenX = user.x + (adCenter.x - user.x) * tokenProgress;
          const tokenY = user.y + (adCenter.y - user.y) * tokenProgress;
          safeCtx.fillStyle = "#50E6FF";
          safeCtx.beginPath();
          safeCtx.arc(tokenX, tokenY, 3, 0, Math.PI * 2);
          safeCtx.fill();
        }
      });

      // Draw security features on the right
      safeCtx.textAlign = "left";
      safeCtx.font = "12px Arial";
      const featuresX = safeCanvas.width - 190;
      const featuresStartY = 80;
      safeCtx.fillStyle = "#0078D4";
      safeCtx.fillText("Security Features:", featuresX, featuresStartY - 20);
      securityFeatures.forEach((feature, index) => {
        const y = featuresStartY + index * 25;
        const isHighlighted =
          Math.floor(time * 0.5) % securityFeatures.length === index;
        // Feature icon (shield)
        safeCtx.fillStyle = isHighlighted ? "#50E6FF" : "#ccc";
        safeCtx.beginPath();
        safeCtx.moveTo(featuresX, y - 3);
        safeCtx.lineTo(featuresX + 10, y - 3);
        safeCtx.lineTo(featuresX + 10, y + 3);
        safeCtx.lineTo(featuresX + 5, y + 7);
        safeCtx.lineTo(featuresX, y + 3);
        safeCtx.closePath();
        safeCtx.fill();
        // Feature name
        safeCtx.fillStyle = isHighlighted ? "#50E6FF" : "#ccc";
        safeCtx.fillText(feature, featuresX + 15, y);
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      // Optional cleanup logic can be added here
    };
  }, []);

  return (
    <div className="azure-ad-visual-container">
      <motion.div
        className="azure-ad-glow"
        animate={{
          boxShadow: [
            "0 0 20px rgba(0, 120, 212, 0.3)",
            "0 0 40px rgba(0, 120, 212, 0.6)",
            "0 0 20px rgba(0, 120, 212, 0.3)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default AzureADVisual;
