import React, { useRef, useEffect } from "react";

const SecurityVisual = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Capture the context in a safe variable
    const safeCtx = ctx;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Capture dimensions in local constants
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;

    let time = 0;
    let threats: Threat[] = [];
    let shields: Shield[] = [];

    // Center point (protected system)
    const centerX = canvasWidth / 2;
    const centerY = canvasHeight / 2;
    const protectedRadius = 40;

    class Threat {
      x!: number;
      y!: number;
      targetX!: number;
      targetY!: number;
      speed!: number;
      size!: number;
      color!: string;
      blocked!: boolean;

      constructor() {
        const edge = Math.floor(Math.random() * 4);
        this.speed = 0.5 + Math.random() * 1;
        this.size = 4 + Math.random() * 3;
        this.color = "rgba(255, 0, 0, 0.7)";
        this.blocked = false;

        switch (edge) {
          case 0: // Top
            this.x = Math.random() * canvasWidth;
            this.y = -this.size;
            break;
          case 1: // Right
            this.x = canvasWidth + this.size;
            this.y = Math.random() * canvasHeight;
            break;
          case 2: // Bottom
            this.x = Math.random() * canvasWidth;
            this.y = canvasHeight + this.size;
            break;
          case 3: // Left
            this.x = -this.size;
            this.y = Math.random() * canvasHeight;
            break;
        }

        this.targetX = centerX;
        this.targetY = centerY;
      }

      update() {
        if (this.blocked) return;
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > this.speed) {
          this.x += (dx / dist) * this.speed;
          this.y += (dy / dist) * this.speed;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }

      checkShieldCollision(shields: Shield[]) {
        for (let shield of shields) {
          const dx = this.x - shield.x;
          const dy = this.y - shield.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < shield.radius + this.size) {
            this.blocked = true;
            return true;
          }
        }
        return false;
      }
    }

    class Shield {
      x: number;
      y: number;
      radius: number;
      color: string;
      pulsePhase: number;

      constructor(centerX: number, centerY: number, radius: number) {
        this.x = centerX;
        this.y = centerY;
        this.radius = radius;
        this.color = "rgba(0, 255, 157, 0.3)";
        this.pulsePhase = Math.random() * Math.PI * 2;
      }

      update(time: number) {
        this.radius += Math.sin(time + this.pulsePhase) * 0.5;
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.stroke();

        const gradient = ctx.createRadialGradient(
          this.x,
          this.y,
          this.radius * 0.8,
          this.x,
          this.y,
          this.radius * 1.2
        );
        gradient.addColorStop(0, "rgba(0, 255, 157, 0.1)");
        gradient.addColorStop(1, "rgba(0, 255, 157, 0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 1.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create protection layers
    shields.push(new Shield(centerX, centerY, 80));
    shields.push(new Shield(centerX, centerY, 120));
    shields.push(new Shield(centerX, centerY, 160));

    function animate() {
      safeCtx.clearRect(0, 0, canvasWidth, canvasHeight);
      time += 0.05;

      if (Math.random() < 0.05) {
        threats.push(new Threat());
      }

      shields.forEach((shield) => {
        shield.update(time);
        shield.draw(safeCtx);
      });

      safeCtx.fillStyle = "#00A4EF";
      safeCtx.beginPath();
      safeCtx.arc(centerX, centerY, protectedRadius, 0, Math.PI * 2);
      safeCtx.fill();

      safeCtx.fillStyle = "#fff";
      safeCtx.font = "20px Arial";
      safeCtx.textAlign = "center";
      safeCtx.textBaseline = "middle";
      safeCtx.fillText("🔒", centerX, centerY);

      threats.forEach((threat, index) => {
        threat.update();

        const dx = threat.x - centerX;
        const dy = threat.y - centerY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < protectedRadius + threat.size) {
          threats.splice(index, 1);
          return;
        }

        if (threat.checkShieldCollision(shields)) {
          safeCtx.strokeStyle = "rgba(255, 255, 255, 0.8)";
          safeCtx.lineWidth = 2;
          safeCtx.beginPath();
          safeCtx.arc(threat.x, threat.y, threat.size + 5, 0, Math.PI * 2);
          safeCtx.stroke();

          setTimeout(() => {
            const idx = threats.indexOf(threat);
            if (idx > -1) threats.splice(idx, 1);
          }, 300);
        }

        threat.draw(safeCtx);
      });

      safeCtx.fillStyle = "#fff";
      safeCtx.font = "14px Arial";
      safeCtx.textAlign = "left";
      safeCtx.fillText(`Threats Blocked: ${Math.floor(time * 2)}`, 20, 30);

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      // Cleanup if necessary
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="security-visual"
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default SecurityVisual;
