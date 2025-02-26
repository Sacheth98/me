import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

// Define types for data flows
interface CenterPoint {
  x: number;
  y: number;
  layer: number;
}

interface DataFlowConnection {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  color: string;
}

type DataFlow = CenterPoint | DataFlowConnection;

const AzureInfrastructureVisual = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Make canvas fully responsive
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Create a modern layered architecture layout
    const drawArchitecture = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate dimensions based on canvas size
      const centerX = canvas.width / 2;
      const startY = 30;
      const layerHeight = (canvas.height - startY - 30) / 4; // 4 layers
      const componentWidth = 70;
      const componentHeight = 35;
      const componentGap = 10;

      // Define architecture layers
      const layers = [
        {
          name: "Front End",
          color: "#50E6FF",
          components: ["Users", "Azure Front Door"],
        },
        {
          name: "API Layer",
          color: "#0078D4",
          components: ["Application Gateway", "API Management"],
        },
        {
          name: "Services",
          color: "#773ADC",
          components: ["AKS Cluster", "Functions", "Logic Apps"],
        },
        {
          name: "Data & Security",
          color: "#FFB900",
          components: ["Key Vault", "Storage", "Service Bus", "Cosmos DB"],
        },
      ];

      // Data flow lines with explicit type
      const dataFlows: DataFlow[] = [];

      // Draw each layer
      layers.forEach((layer, layerIndex) => {
        const layerY = startY + layerHeight * layerIndex;
        const componentCount = layer.components.length;

        // Layer background
        const layerWidth = canvas.width - 40;
        ctx.fillStyle = `${layer.color}20`; // Semi-transparent
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = 2;

        // Rounded rectangle for layer
        ctx.beginPath();
        ctx.roundRect(20, layerY, layerWidth, layerHeight - 10, 10);
        ctx.fill();
        ctx.stroke();

        // Layer name
        ctx.fillStyle = layer.color;
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "left";
        ctx.fillText(layer.name, 30, layerY + 20);

        // Calculate component positions
        const totalComponentWidth =
          componentCount * componentWidth + (componentCount - 1) * componentGap;
        const startX = centerX - totalComponentWidth / 2;

        // Draw components in this layer
        layer.components.forEach((component, compIndex) => {
          const compX = startX + compIndex * (componentWidth + componentGap);
          const compY = layerY + layerHeight / 2;

          // Draw component
          ctx.fillStyle = layer.color;
          ctx.beginPath();
          ctx.roundRect(compX, compY, componentWidth, componentHeight, 8);
          ctx.fill();

          // Component name
          ctx.fillStyle = "#fff";
          ctx.font = "12px Arial";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(
            component,
            compX + componentWidth / 2,
            compY + componentHeight / 2
          );

          // Record center point for this component
          const centerPoint: CenterPoint = {
            x: compX + componentWidth / 2,
            y: compY + componentHeight / 2,
            layer: layerIndex,
          };
          dataFlows.push(centerPoint);

          // Add connection points to next layer if not the last layer
          if (layerIndex < layers.length - 1) {
            // Connect to random components in next layer
            const nextLayer = layers[layerIndex + 1];
            const nextLayerComponents = nextLayer.components.length;

            // Connect to 1-2 components in next layer
            const connectionsCount = Math.min(
              Math.floor(Math.random() * 2) + 1,
              nextLayerComponents
            );

            for (let i = 0; i < connectionsCount; i++) {
              const targetIndex = Math.floor(
                Math.random() * nextLayerComponents
              );
              const targetCompX =
                startX + targetIndex * (componentWidth + componentGap);
              const targetCompY = layerY + layerHeight + layerHeight / 2;

              const connection: DataFlowConnection = {
                fromX: compX + componentWidth / 2,
                fromY: compY + componentHeight,
                toX: targetCompX + componentWidth / 2,
                toY: targetCompY,
                color: layer.color,
              };

              dataFlows.push(connection);
            }
          }
        });
      });

      // Draw data flow lines for connection objects only
      dataFlows.forEach((flow) => {
        if ("fromX" in flow) {
          ctx.strokeStyle = `${flow.color}90`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(flow.fromX, flow.fromY);

          // Bezier curve for smoother lines
          const controlPointY = flow.fromY + (flow.toY - flow.fromY) / 2;
          ctx.bezierCurveTo(
            flow.fromX,
            controlPointY,
            flow.toX,
            controlPointY,
            flow.toX,
            flow.toY
          );
          ctx.stroke();

          // Animated data packet
          const currentTime = Date.now() / 1000;
          const t = (currentTime % 2) / 2; // value from 0 to 1 every 2 seconds

          // Calculate position along the bezier curve
          const bezierPoint = calculateBezierPoint(
            t,
            flow.fromX,
            flow.fromY,
            flow.fromX,
            controlPointY,
            flow.toX,
            controlPointY,
            flow.toX,
            flow.toY
          );

          // Draw data packet
          ctx.fillStyle = flow.color;
          ctx.beginPath();
          ctx.arc(bezierPoint.x, bezierPoint.y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Animation
      requestAnimationFrame(drawArchitecture);
    };

    // Helper function to calculate a point on a bezier curve
    function calculateBezierPoint(
      t: number,
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      x3: number,
      y3: number,
      x4: number,
      y4: number
    ) {
      const u = 1 - t;
      const tt = t * t;
      const uu = u * u;
      const uuu = uu * u;
      const ttt = tt * t;

      const x = uuu * x1 + 3 * uu * t * x2 + 3 * u * tt * x3 + ttt * x4;
      const y = uuu * y1 + 3 * uu * t * y2 + 3 * u * tt * y3 + ttt * y4;

      return { x, y };
    }

    // Start animation
    drawArchitecture();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <div className="azure-architecture-container">
      <motion.div
        className="architecture-glow"
        animate={{
          boxShadow: [
            "0 0 20px rgba(0, 120, 212, 0.3)",
            "0 0 40px rgba(0, 120, 212, 0.6)",
            "0 0 20px rgba(0, 120, 212, 0.3)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <canvas ref={canvasRef} className="architecture-canvas" />
    </div>
  );
};

export default AzureInfrastructureVisual;
