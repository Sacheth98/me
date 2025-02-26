import React, { useState, useEffect, useRef } from "react";
import { useAnimation } from "framer-motion";

const HighTrafficSystemVisual = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Traffic simulation variables
    let time = 0;
    let trafficIntensity = 0;
    let trafficSpike = false;
    let instances = 1;
    let userNodes: { x: number; y: number; speed: number; size: number }[] = [];

    // Generate initial users
    for (let i = 0; i < 20; i++) {
      userNodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height / 3),
        speed: 0.5 + Math.random() * 1,
        size: 3 + Math.random() * 2,
      });
    }

    // Create a stable reference for the canvas context
    const safeCtx = ctx;

    function draw() {
      safeCtx.clearRect(0, 0, canvas.width, canvas.height);

      // Update simulation
      time += 0.01;

      // Traffic spike logic
      if (time % 10 < 3) {
        trafficSpike = true;
        trafficIntensity = Math.min(trafficIntensity + 0.02, 1);
      } else {
        trafficSpike = false;
        trafficIntensity = Math.max(trafficIntensity - 0.01, 0);
      }

      // Auto-scaling logic
      const targetInstances = trafficSpike ? 3 : 1;
      instances += (targetInstances - instances) * 0.02;

      // Draw background grid
      safeCtx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      safeCtx.lineWidth = 1;

      for (let x = 0; x < canvas.width; x += 30) {
        safeCtx.beginPath();
        safeCtx.moveTo(x, 0);
        safeCtx.lineTo(x, canvas.height);
        safeCtx.stroke();
      }

      for (let y = 0; y < canvas.height; y += 30) {
        safeCtx.beginPath();
        safeCtx.moveTo(0, y);
        safeCtx.lineTo(canvas.width, y);
        safeCtx.stroke();
      }

      // Draw traffic graph
      safeCtx.strokeStyle = "#FF9900";
      safeCtx.lineWidth = 2;
      safeCtx.beginPath();

      const graphHeight = 80;
      const graphY = canvas.height - 100;

      for (let x = 0; x < canvas.width; x++) {
        const t = time - (canvas.width - x) * 0.01;
        const spike =
          t % 10 < 3 ? Math.sin(((t % 3) / 3) * Math.PI) * 0.7 + 0.3 : 0.3;
        const y = graphY - spike * graphHeight;

        if (x === 0) {
          safeCtx.moveTo(x, y);
        } else {
          safeCtx.lineTo(x, y);
        }
      }
      safeCtx.stroke();

      // Draw graph labels
      safeCtx.fillStyle = "#ccc";
      safeCtx.font = "12px Arial";
      safeCtx.textAlign = "left";
      safeCtx.fillText("Traffic Load", 10, graphY - graphHeight - 10);
      safeCtx.fillText("Time", canvas.width - 40, graphY + 20);

      // Draw load balancer
      const lbX = canvas.width / 2;
      const lbY = canvas.height / 2 - 30;

      safeCtx.fillStyle = "#FF9900";
      safeCtx.beginPath();
      safeCtx.roundRect(lbX - 80, lbY, 160, 40, 5);
      safeCtx.fill();

      safeCtx.fillStyle = "#fff";
      safeCtx.textAlign = "center";
      safeCtx.font = "14px Arial";
      safeCtx.fillText("Elastic Load Balancer", lbX, lbY + 24);

      // Draw EC2 instances
      const instanceWidth = 70;
      const instancesGap = 20;
      const totalInstancesWidth =
        instances * instanceWidth + (instances - 1) * instancesGap;
      const instancesStartX = lbX - totalInstancesWidth / 2;

      for (let i = 0; i < Math.ceil(instances); i++) {
        const alpha = i < Math.floor(instances) ? 1 : instances % 1;
        const x = instancesStartX + i * (instanceWidth + instancesGap);
        const y = lbY + 80;

        safeCtx.fillStyle = `rgba(255, 153, 0, ${alpha})`;
        safeCtx.beginPath();
        safeCtx.roundRect(x, y, instanceWidth, 50, 5);
        safeCtx.fill();

        safeCtx.fillStyle = "#fff";
        safeCtx.textAlign = "center";
        safeCtx.font = "12px Arial";
        safeCtx.fillText("EC2", x + instanceWidth / 2, y + 28);
      }

      // Draw users
      const usersToAdd = trafficIntensity * 1; // Add users based on traffic

      for (let i = 0; i < usersToAdd; i++) {
        if (Math.random() < 0.2) {
          userNodes.push({
            x: Math.random() * canvas.width,
            y: -10,
            speed: 0.5 + Math.random() * (trafficIntensity * 2),
            size: 3 + Math.random() * 2,
          });
        }
      }

      // Update and draw user nodes
      for (let i = userNodes.length - 1; i >= 0; i--) {
        const user = userNodes[i];
        user.y += user.speed;

        // Remove users that reach load balancer
        if (user.y > lbY) {
          userNodes.splice(i, 1);
          continue;
        }

        // Calculate color based on traffic intensity
        const green = trafficSpike ? 100 : 255;
        const red = trafficSpike ? 255 : 100;

        safeCtx.fillStyle = `rgb(${red}, ${green}, 0)`;
        safeCtx.beginPath();
        safeCtx.arc(user.x, user.y, user.size, 0, Math.PI * 2);
        safeCtx.fill();
      }

      // Draw connection lines from users to load balancer
      safeCtx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      safeCtx.lineWidth = 0.5;

      userNodes.forEach((user) => {
        if (user.y > 50) {
          safeCtx.beginPath();
          safeCtx.moveTo(user.x, user.y);
          safeCtx.lineTo(lbX, lbY);
          safeCtx.stroke();
        }
      });

      // Draw connection lines from load balancer to instances
      for (let i = 0; i < Math.ceil(instances); i++) {
        const alpha = i < Math.floor(instances) ? 1 : instances % 1;
        const x =
          instancesStartX +
          i * (instanceWidth + instancesGap) +
          instanceWidth / 2;
        const y = lbY + 80;

        safeCtx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.7})`;
        safeCtx.beginPath();
        safeCtx.moveTo(lbX, lbY + 40);
        safeCtx.lineTo(x, y);
        safeCtx.stroke();
      }

      // Draw response time indicator
      safeCtx.fillStyle = "#ccc";
      safeCtx.textAlign = "right";
      safeCtx.font = "14px Arial";
      safeCtx.fillText("Response Time:", canvas.width - 120, 30);

      const responseTime = 100 - trafficIntensity * 50; // Lower is better
      const responseColor =
        responseTime < 70
          ? "#F25022"
          : responseTime < 90
          ? "#FFB900"
          : "#7FBA00";

      safeCtx.fillStyle = responseColor;
      safeCtx.textAlign = "left";
      safeCtx.fillText(`${responseTime.toFixed(0)}ms`, canvas.width - 110, 30);

      requestAnimationFrame(draw);
    }

    draw();

    return () => {
      // No cleanup needed for canvas
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="traffic-canvas"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default HighTrafficSystemVisual;
