import React, { useRef, useEffect } from "react";

const WebsiteManagementVisual = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Capture canvas and context in safe variables
    const safeCanvas = canvas;
    const safeCtx = ctx;

    // Set canvas dimensions
    safeCanvas.width = safeCanvas.offsetWidth;
    safeCanvas.height = safeCanvas.offsetHeight;

    // Websites to manage
    const websites = [
      {
        name: "Engineering",
        x: 100,
        y: 100,
        width: 120,
        height: 80,
        color: "#3b7ea1",
      },
      {
        name: "Business",
        x: 300,
        y: 80,
        width: 120,
        height: 80,
        color: "#4e9e4e",
      },
      {
        name: "Arts",
        x: 190,
        y: 200,
        width: 120,
        height: 80,
        color: "#9e4e4e",
      },
      {
        name: "Sciences",
        x: 360,
        y: 170,
        width: 120,
        height: 80,
        color: "#9e824e",
      },
    ];

    // Central CMS
    const cms = {
      x: safeCanvas.width / 2,
      y: safeCanvas.height / 2 + 50,
      radius: 40,
      color: "#501214", // Texas State maroon
    };

    let time = 0;
    let activeWebsite = 0;

    function animate() {
      safeCtx.clearRect(0, 0, safeCanvas.width, safeCanvas.height);
      time += 0.02;

      // Draw connecting lines
      safeCtx.strokeStyle = "rgba(255, 255, 255, 0.2)";
      safeCtx.lineWidth = 1;
      websites.forEach((site, index) => {
        safeCtx.beginPath();
        safeCtx.moveTo(cms.x, cms.y);
        safeCtx.lineTo(site.x + site.width / 2, site.y + site.height / 2);
        safeCtx.stroke();
      });

      // Highlight active website connection
      activeWebsite = Math.floor(time / 2) % websites.length;
      const active = websites[activeWebsite];
      safeCtx.strokeStyle = "#00ff9d";
      safeCtx.lineWidth = 2;
      safeCtx.beginPath();
      safeCtx.moveTo(cms.x, cms.y);
      safeCtx.lineTo(active.x + active.width / 2, active.y + active.height / 2);
      safeCtx.stroke();

      // Draw animation dots on the active line
      const dx = active.x + active.width / 2 - cms.x;
      const dy = active.y + active.height / 2 - cms.y;
      const dotPos = (time % 2) / 2; // value between 0 and 1
      const dotX = cms.x + dx * dotPos;
      const dotY = cms.y + dy * dotPos;
      safeCtx.fillStyle = "#00ff9d";
      safeCtx.beginPath();
      safeCtx.arc(dotX, dotY, 4, 0, Math.PI * 2);
      safeCtx.fill();

      // Draw websites
      websites.forEach((site, index) => {
        safeCtx.fillStyle = site.color;
        if (index === activeWebsite) {
          safeCtx.fillStyle = "#00ff9d";
        }
        safeCtx.fillRect(site.x, site.y, site.width, site.height);
        safeCtx.fillStyle = "#fff";
        safeCtx.font = "12px Arial";
        safeCtx.textAlign = "center";
        safeCtx.textBaseline = "middle";
        safeCtx.fillText(
          site.name,
          site.x + site.width / 2,
          site.y + site.height / 2
        );
      });

      // Draw CMS
      safeCtx.fillStyle = cms.color;
      safeCtx.beginPath();
      safeCtx.arc(cms.x, cms.y, cms.radius, 0, Math.PI * 2);
      safeCtx.fill();
      safeCtx.fillStyle = "#fff";
      safeCtx.font = "14px Arial";
      safeCtx.textAlign = "center";
      safeCtx.textBaseline = "middle";
      safeCtx.fillText("GATO CMS", cms.x, cms.y);

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      // Cleanup if necessary
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};

export default WebsiteManagementVisual;
