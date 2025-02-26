import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const ContainerVisual = () => {
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

    // Set canvas dimensions
    safeCanvas.width = safeCanvas.offsetWidth;
    safeCanvas.height = safeCanvas.offsetHeight;

    let time = 0;

    // Container colors
    const dockerBlue = "#2496ED";
    const kubernetesBlue = "#326CE5";

    // Define the container states
    const states = [
      { name: "Build", x: 80, y: 80 },
      { name: "Ship", x: safeCanvas.width / 2, y: 80 },
      { name: "Run", x: safeCanvas.width - 80, y: 80 },
    ];

    // Container instances
    const containers = [
      { name: "Web App", x: 80, y: 160, width: 60, height: 50, type: "app" },
      { name: "API", x: 160, y: 160, width: 60, height: 50, type: "api" },
      { name: "DB", x: 240, y: 160, width: 60, height: 50, type: "db" },
    ];

    // Kubernetes cluster
    const cluster = {
      x: safeCanvas.width / 2,
      y: 250,
      radius: 100,
      pods: [
        { x: -60, y: -40, type: "app" },
        { x: 0, y: -40, type: "app" },
        { x: 60, y: -40, type: "app" },
        { x: -40, y: 20, type: "api" },
        { x: 40, y: 20, type: "api" },
        { x: 0, y: 60, type: "db" },
      ],
    };

    // Animation state
    let currentStage = 0;
    let stageProgress = 0;

    function animate() {
      safeCtx.clearRect(0, 0, safeCanvas.width, safeCanvas.height);
      time += 0.01;

      // Update animation state
      stageProgress += 0.01;
      if (stageProgress > 1) {
        stageProgress = 0;
        currentStage = (currentStage + 1) % 3;
      }

      // Draw title
      safeCtx.fillStyle = dockerBlue;
      safeCtx.font = "bold 16px Arial";
      safeCtx.textAlign = "center";
      safeCtx.fillText("Container Orchestration", safeCanvas.width / 2, 30);

      // Draw Docker logo in background
      drawDockerLogo(50, safeCanvas.height - 60, 40, 0.1);

      // Draw Kubernetes logo in background
      drawKubernetesLogo(
        safeCanvas.width - 50,
        safeCanvas.height - 60,
        40,
        0.1
      );

      // Draw the container workflow states
      states.forEach((state, index) => {
        const isActive = index === currentStage;

        safeCtx.fillStyle = isActive ? dockerBlue : "rgba(255, 255, 255, 0.3)";
        safeCtx.font = isActive ? "bold 14px Arial" : "12px Arial";
        safeCtx.textAlign = "center";
        safeCtx.fillText(state.name, state.x, state.y);

        // Draw connector lines between states
        if (index < states.length - 1) {
          const nextState = states[index + 1];
          safeCtx.strokeStyle = "rgba(255, 255, 255, 0.2)";
          safeCtx.lineWidth = 2;
          safeCtx.beginPath();
          safeCtx.moveTo(state.x + 20, state.y);
          safeCtx.lineTo(nextState.x - 20, nextState.y);
          safeCtx.stroke();

          // Draw animated progress along the active path
          if (isActive) {
            const t = stageProgress;
            const x = state.x + 20 + (nextState.x - state.x - 40) * t;
            const y = state.y;
            safeCtx.fillStyle = dockerBlue;
            safeCtx.beginPath();
            safeCtx.arc(x, y, 4, 0, Math.PI * 2);
            safeCtx.fill();
          }
        }
      });

      // Draw containers during the build phase
      if (currentStage === 0) {
        containers.forEach((container, index) => {
          if (index / containers.length <= stageProgress) {
            drawContainer(
              container.x,
              container.y,
              container.width,
              container.height,
              container.name,
              dockerBlue
            );
          }
        });
      }

      // Draw containers shipping to Kubernetes during the ship phase
      if (currentStage === 1) {
        containers.forEach((container, index) => {
          const startX = container.x;
          const startY = container.y;
          const endX = cluster.x;
          const endY = cluster.y - cluster.radius - 20;
          const containerProgress = stageProgress * 3 - index;

          if (containerProgress > 0 && containerProgress < 1) {
            const t = containerProgress;
            const x = startX + (endX - startX) * t;
            const y = startY + (endY - startY) * t - Math.sin(t * Math.PI) * 50;
            drawContainer(
              x,
              y,
              container.width,
              container.height,
              container.name,
              dockerBlue
            );
          }
        });

        // Draw Kubernetes cluster outline
        safeCtx.strokeStyle = "rgba(50, 108, 229, 0.3)";
        safeCtx.lineWidth = 2;
        safeCtx.beginPath();
        safeCtx.arc(cluster.x, cluster.y, cluster.radius, 0, Math.PI * 2);
        safeCtx.stroke();
        safeCtx.fillStyle = "rgba(50, 108, 229, 0.1)";
        safeCtx.beginPath();
        safeCtx.arc(cluster.x, cluster.y, cluster.radius, 0, Math.PI * 2);
        safeCtx.fill();

        // Draw Kubernetes logo in center
        drawKubernetesLogo(cluster.x, cluster.y, 30, 0.3);
      }

      // Draw running containers in Kubernetes cluster
      if (currentStage === 2) {
        safeCtx.strokeStyle = "rgba(50, 108, 229, 0.7)";
        safeCtx.lineWidth = 2;
        safeCtx.beginPath();
        safeCtx.arc(cluster.x, cluster.y, cluster.radius, 0, Math.PI * 2);
        safeCtx.stroke();
        safeCtx.fillStyle = "rgba(50, 108, 229, 0.2)";
        safeCtx.beginPath();
        safeCtx.arc(cluster.x, cluster.y, cluster.radius, 0, Math.PI * 2);
        safeCtx.fill();

        drawKubernetesLogo(cluster.x, cluster.y, 30, 0.8);

        // Draw pods
        cluster.pods.forEach((pod, index) => {
          if (index / cluster.pods.length <= stageProgress) {
            const podX = cluster.x + pod.x;
            const podY = cluster.y + pod.y;
            const podSize = 24;
            safeCtx.fillStyle = kubernetesBlue;
            safeCtx.beginPath();
            safeCtx.roundRect(
              podX - podSize / 2,
              podY - podSize / 2,
              podSize,
              podSize,
              5
            );
            safeCtx.fill();

            safeCtx.fillStyle = "#fff";
            safeCtx.font = "8px Arial";
            safeCtx.textAlign = "center";
            safeCtx.fillText(pod.type, podX, podY);

            const pulseSize = 28 + Math.sin(time * 2 + index) * 2;
            safeCtx.strokeStyle = "rgba(50, 108, 229, 0.5)";
            safeCtx.lineWidth = 1;
            safeCtx.beginPath();
            safeCtx.roundRect(
              podX - pulseSize / 2,
              podY - pulseSize / 2,
              pulseSize,
              pulseSize,
              6
            );
            safeCtx.stroke();
          }
        });

        // Draw connections between pods
        safeCtx.strokeStyle = "rgba(50, 108, 229, 0.3)";
        safeCtx.lineWidth = 1;
        for (let i = 0; i < cluster.pods.length; i++) {
          if (i / cluster.pods.length > stageProgress) continue;
          for (let j = i + 1; j < cluster.pods.length; j++) {
            if (j / cluster.pods.length > stageProgress) continue;
            if (cluster.pods[i].type !== cluster.pods[j].type) {
              safeCtx.beginPath();
              safeCtx.moveTo(
                cluster.x + cluster.pods[i].x,
                cluster.y + cluster.pods[i].y
              );
              safeCtx.lineTo(
                cluster.x + cluster.pods[j].x,
                cluster.y + cluster.pods[j].y
              );
              safeCtx.stroke();
            }
          }
        }

        // Draw deployment percentage
        const percentage = Math.min(100, Math.round(stageProgress * 100));
        safeCtx.fillStyle = kubernetesBlue;
        safeCtx.font = "bold 14px Arial";
        safeCtx.textAlign = "center";
        safeCtx.fillText(
          `${percentage}% Deployed`,
          cluster.x,
          cluster.y + cluster.radius + 30
        );
      }

      // Draw bottom label
      safeCtx.fillStyle = "#3FADC5";
      safeCtx.font = "bold 14px Arial";
      safeCtx.textAlign = "center";
      safeCtx.fillText(
        "95% Deployment Consistency",
        safeCanvas.width / 2,
        safeCanvas.height - 20
      );

      requestAnimationFrame(animate);
    }

    // Helper to draw a container
    function drawContainer(
      x: number,
      y: number,
      width: number,
      height: number,
      name: string,
      color: string
    ) {
      safeCtx.fillStyle = color;
      safeCtx.beginPath();
      safeCtx.roundRect(x - width / 2, y - height / 2, width, height, 5);
      safeCtx.fill();

      safeCtx.strokeStyle = "rgba(255, 255, 255, 0.5)";
      safeCtx.lineWidth = 1;
      for (let i = 1; i < 3; i++) {
        safeCtx.beginPath();
        safeCtx.moveTo(x - width / 2, y - height / 2 + (i * height) / 3);
        safeCtx.lineTo(x + width / 2, y - height / 2 + (i * height) / 3);
        safeCtx.stroke();
      }

      safeCtx.fillStyle = "#fff";
      safeCtx.font = "10px Arial";
      safeCtx.textAlign = "center";
      safeCtx.textBaseline = "middle";
      safeCtx.fillText(name, x, y);
    }

    // Helper to draw Docker logo
    function drawDockerLogo(
      x: number,
      y: number,
      size: number,
      opacity: number
    ) {
      safeCtx.globalAlpha = opacity;
      safeCtx.fillStyle = dockerBlue;
      safeCtx.fillRect(x - size / 2, y - size / 3, size, size / 1.5);
      const containerSize = size / 5;
      for (let i = 0; i < 3; i++) {
        safeCtx.fillRect(
          x - size / 2 + i * containerSize,
          y - size / 3 + containerSize,
          containerSize - 1,
          containerSize - 1
        );
      }
      for (let i = 0; i < 3; i++) {
        safeCtx.fillRect(
          x - size / 2 + i * containerSize,
          y - size / 3,
          containerSize - 1,
          containerSize - 1
        );
      }
      safeCtx.fillRect(
        x - size / 2,
        y - size / 3 - containerSize,
        containerSize - 1,
        containerSize - 1
      );
      safeCtx.globalAlpha = 1.0;
    }

    // Helper to draw Kubernetes logo
    function drawKubernetesLogo(
      x: number,
      y: number,
      size: number,
      opacity: number
    ) {
      safeCtx.globalAlpha = opacity;
      safeCtx.strokeStyle = kubernetesBlue;
      safeCtx.lineWidth = 2;
      safeCtx.beginPath();
      for (let i = 0; i < 7; i++) {
        const angle = (i * 2 * Math.PI) / 7 - Math.PI / 2;
        const xPos = x + size * Math.cos(angle);
        const yPos = y + size * Math.sin(angle);
        if (i === 0) {
          safeCtx.moveTo(xPos, yPos);
        } else {
          safeCtx.lineTo(xPos, yPos);
        }
      }
      safeCtx.closePath();
      safeCtx.stroke();
      for (let i = 0; i < 7; i++) {
        const angle = (i * 2 * Math.PI) / 7 - Math.PI / 2;
        const xStart = x + size * 0.4 * Math.cos(angle);
        const yStart = y + size * 0.4 * Math.sin(angle);
        const xEnd = x + size * Math.cos(angle);
        const yEnd = y + size * Math.sin(angle);
        safeCtx.beginPath();
        safeCtx.moveTo(xStart, yStart);
        safeCtx.lineTo(xEnd, yEnd);
        safeCtx.stroke();
      }
      safeCtx.beginPath();
      safeCtx.arc(x, y, size * 0.4, 0, Math.PI * 2);
      safeCtx.stroke();
      safeCtx.globalAlpha = 1.0;
    }

    animate();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className="container-visual-container">
      <motion.div
        className="container-glow"
        animate={{
          boxShadow: [
            "0 0 20px rgba(36, 150, 237, 0.3)",
            "0 0 40px rgba(36, 150, 237, 0.6)",
            "0 0 20px rgba(36, 150, 237, 0.3)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default ContainerVisual;
