import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface ComponentData {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

const ServerlessVisual = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const safeCanvas = canvas;
    const safeCtx = ctx;

    safeCanvas.width = safeCanvas.offsetWidth;
    safeCanvas.height = safeCanvas.offsetHeight;

    let time = 0;

    // Define serverless components with an explicit type
    const components: Record<string, ComponentData> = {
      "API Gateway": { x: 80, y: 50, width: 120, height: 40, color: "#CC2F90" },
      Lambda: { x: 220, y: 120, width: 100, height: 40, color: "#FF9900" },
      DynamoDB: { x: 80, y: 190, width: 120, height: 40, color: "#4053D6" },
      S3: { x: 350, y: 50, width: 80, height: 40, color: "#FF9900" },
      SQS: { x: 350, y: 190, width: 80, height: 40, color: "#FF9900" },
    };

    // Define data flow paths
    const dataFlows = [
      { from: "API Gateway", to: "Lambda" },
      { from: "Lambda", to: "DynamoDB" },
      { from: "Lambda", to: "S3" },
      { from: "Lambda", to: "SQS" },
    ];

    // Create data packets for animation
    const dataPackets = dataFlows.map((flow) => ({
      flow,
      progress: Math.random(), // Random starting position
      speed: 0.001 + Math.random() * 0.002,
    }));

    function animate() {
      safeCtx.clearRect(0, 0, safeCanvas.width, safeCanvas.height);
      time += 0.01;

      // Draw Lambda logo in background
      const logoSize = 180;
      const logoX = safeCanvas.width / 2 - logoSize / 2;
      const logoY = safeCanvas.height / 2 - logoSize / 2;

      safeCtx.globalAlpha = 0.05;
      safeCtx.fillStyle = "#FF9900"; // AWS orange
      safeCtx.beginPath();
      safeCtx.moveTo(logoX, logoY);
      safeCtx.lineTo(logoX + logoSize, logoY);
      safeCtx.lineTo(logoX + logoSize / 2, logoY + logoSize);
      safeCtx.closePath();
      safeCtx.fill();
      safeCtx.globalAlpha = 1.0;

      // Draw connections between components
      dataFlows.forEach((flow) => {
        const from = components[flow.from];
        const to = components[flow.to];

        const fromX = from.x + from.width / 2;
        const fromY = from.y + from.height / 2;
        const toX = to.x + to.width / 2;
        const toY = to.y + to.height / 2;

        safeCtx.strokeStyle = "rgba(255, 153, 0, 0.3)"; // AWS orange
        safeCtx.lineWidth = 2;
        safeCtx.beginPath();
        safeCtx.moveTo(fromX, fromY);

        const controlX = (fromX + toX) / 2;
        const controlY = (fromY + toY) / 2 - 20;
        safeCtx.quadraticCurveTo(controlX, controlY, toX, toY);
        safeCtx.stroke();
      });

      // Draw data packets
      dataPackets.forEach((packet) => {
        const from = components[packet.flow.from];
        const to = components[packet.flow.to];

        const fromX = from.x + from.width / 2;
        const fromY = from.y + from.height / 2;
        const toX = to.x + to.width / 2;
        const toY = to.y + to.height / 2;

        const t = packet.progress;
        const controlX = (fromX + toX) / 2;
        const controlY = (fromY + toY) / 2 - 20;

        const x =
          Math.pow(1 - t, 2) * fromX +
          2 * (1 - t) * t * controlX +
          Math.pow(t, 2) * toX;
        const y =
          Math.pow(1 - t, 2) * fromY +
          2 * (1 - t) * t * controlY +
          Math.pow(t, 2) * toY;

        safeCtx.fillStyle = "#FF9900";
        safeCtx.beginPath();
        safeCtx.arc(x, y, 4, 0, Math.PI * 2);
        safeCtx.fill();

        const gradient = safeCtx.createRadialGradient(x, y, 0, x, y, 10);
        gradient.addColorStop(0, "rgba(255, 153, 0, 0.5)");
        gradient.addColorStop(1, "rgba(255, 153, 0, 0)");
        safeCtx.fillStyle = gradient;
        safeCtx.beginPath();
        safeCtx.arc(x, y, 10, 0, Math.PI * 2);
        safeCtx.fill();

        packet.progress += packet.speed;
        if (packet.progress > 1) {
          packet.progress = 0;
        }
      });

      // Draw components
      Object.entries(components).forEach(([name, comp]) => {
        const pulse = 1 + Math.sin(time + comp.x) * 0.05;
        safeCtx.fillStyle = comp.color;
        safeCtx.beginPath();
        safeCtx.roundRect(
          comp.x,
          comp.y,
          comp.width * pulse,
          comp.height * pulse,
          8
        );
        safeCtx.fill();

        safeCtx.fillStyle = "#fff";
        safeCtx.font = "bold 12px Arial";
        safeCtx.textAlign = "center";
        safeCtx.textBaseline = "middle";
        safeCtx.fillText(
          name,
          comp.x + (comp.width * pulse) / 2,
          comp.y + (comp.height * pulse) / 2
        );
      });

      // Draw response time indicator
      safeCtx.fillStyle = "#ccc";
      safeCtx.font = "14px Arial";
      safeCtx.textAlign = "center";
      safeCtx.fillText(
        "Response Time: < 100ms",
        safeCanvas.width / 2,
        safeCanvas.height - 20
      );

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      // Cleanup if necessary
    };
  }, []);

  return (
    <div className="serverless-visual-container">
      <motion.div
        className="serverless-glow"
        animate={{
          boxShadow: [
            "0 0 20px rgba(255, 153, 0, 0.3)",
            "0 0 40px rgba(255, 153, 0, 0.6)",
            "0 0 20px rgba(255, 153, 0, 0.3)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default ServerlessVisual;
