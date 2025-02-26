import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const CostOptimizationVisual = () => {
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

    function animate() {
      safeCtx.clearRect(0, 0, safeCanvas.width, safeCanvas.height);
      time += 0.01;

      // Draw background grid
      safeCtx.strokeStyle = "rgba(255, 255, 255, 0.05)";
      safeCtx.lineWidth = 1;
      for (let x = 0; x < safeCanvas.width; x += 20) {
        safeCtx.beginPath();
        safeCtx.moveTo(x, 0);
        safeCtx.lineTo(x, safeCanvas.height);
        safeCtx.stroke();
      }
      for (let y = 0; y < safeCanvas.height; y += 20) {
        safeCtx.beginPath();
        safeCtx.moveTo(0, y);
        safeCtx.lineTo(safeCanvas.width, y);
        safeCtx.stroke();
      }

      // Draw cost reduction graph
      const graphWidth = safeCanvas.width - 80;
      const graphHeight = 150;
      const graphX = 40;
      const graphY = safeCanvas.height - graphHeight - 40;

      // X and Y axis
      safeCtx.strokeStyle = "#fff";
      safeCtx.lineWidth = 2;
      safeCtx.beginPath();
      safeCtx.moveTo(graphX, graphY);
      safeCtx.lineTo(graphX, graphY + graphHeight);
      safeCtx.lineTo(graphX + graphWidth, graphY + graphHeight);
      safeCtx.stroke();

      // X axis label - Time
      safeCtx.fillStyle = "#ccc";
      safeCtx.font = "12px Arial";
      safeCtx.textAlign = "center";
      safeCtx.fillText(
        "Time",
        graphX + graphWidth / 2,
        graphY + graphHeight + 25
      );

      // Y axis label - Cost
      safeCtx.save();
      safeCtx.translate(graphX - 25, graphY + graphHeight / 2);
      safeCtx.rotate(-Math.PI / 2);
      safeCtx.textAlign = "center";
      safeCtx.fillText("Cost ($)", 0, 0);
      safeCtx.restore();

      // Cost-reduction curve
      safeCtx.strokeStyle = "#FF9900"; // AWS orange
      safeCtx.lineWidth = 3;
      safeCtx.beginPath();
      safeCtx.moveTo(graphX, graphY + 20); // Start high
      safeCtx.bezierCurveTo(
        graphX + graphWidth * 0.3,
        graphY + 30, // First control point
        graphX + graphWidth * 0.6,
        graphY + graphHeight * 0.7, // Second control point
        graphX + graphWidth,
        graphY + graphHeight - 30 // End point (lower cost)
      );
      safeCtx.stroke();

      // Add points with values
      const points = [
        { x: graphX, y: graphY + 20, value: "$10K" },
        { x: graphX + graphWidth * 0.3, y: graphY + 60, value: "$8K" },
        {
          x: graphX + graphWidth * 0.6,
          y: graphY + graphHeight * 0.7,
          value: "$5K",
        },
        { x: graphX + graphWidth, y: graphY + graphHeight - 30, value: "$4K" },
      ];

      points.forEach((point) => {
        // Draw point
        safeCtx.fillStyle = "#FF9900";
        safeCtx.beginPath();
        safeCtx.arc(point.x, point.y, 5, 0, Math.PI * 2);
        safeCtx.fill();

        // Draw value
        safeCtx.fillStyle = "#fff";
        safeCtx.font = "bold 12px Arial";
        safeCtx.textAlign = "center";
        safeCtx.fillText(point.value, point.x, point.y - 10);
      });

      // Highlight cost savings percentage
      const savingsX = safeCanvas.width / 2;
      const savingsY = 80;
      safeCtx.font = "bold 40px Arial";
      safeCtx.textAlign = "center";
      safeCtx.fillStyle = "#FF9900";
      // Add flicker effect to percentage
      const flickerAlpha = 0.7 + Math.sin(time * 10) * 0.3;
      safeCtx.globalAlpha = flickerAlpha;
      safeCtx.fillText("40%", savingsX, savingsY);
      safeCtx.globalAlpha = 1.0;

      // Draw savings label
      safeCtx.font = "16px Arial";
      safeCtx.fillStyle = "#ccc";
      safeCtx.fillText("COST REDUCTION", savingsX, savingsY + 30);

      // Draw optimization strategies
      const strategies = [
        "Right-sizing instances",
        "Reserved Instances",
        "Auto Scaling",
        "Spot Instances",
        "S3 Lifecycle Policies",
      ];
      const strategiesStartX = 60;
      const strategiesStartY = 140;
      safeCtx.font = "14px Arial";
      safeCtx.textAlign = "left";
      strategies.forEach((strategy, index) => {
        const y = strategiesStartY + index * 22;
        // Check mark
        safeCtx.fillStyle = "#00ff9d";
        safeCtx.beginPath();
        safeCtx.arc(strategiesStartX - 15, y - 5, 8, 0, Math.PI * 2);
        safeCtx.fill();
        safeCtx.fillStyle = "#fff";
        safeCtx.font = "bold 10px Arial";
        safeCtx.fillText("✓", strategiesStartX - 18, y - 1);
        // Strategy name
        safeCtx.fillStyle = "#ccc";
        safeCtx.font = "14px Arial";
        safeCtx.fillText(strategy, strategiesStartX, y);
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      // Cleanup if necessary
    };
  }, []);

  return (
    <div className="cost-optimization-container">
      <motion.div
        className="cost-glow"
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

export default CostOptimizationVisual;
