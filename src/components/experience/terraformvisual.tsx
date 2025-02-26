import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

interface Connection {
  from: number;
  to: number;
}

interface ComponentData {
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

const TerraformVisual = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    // Capture canvas and context into safe variables
    const safeCanvas = canvas;
    const safeCtx = ctx;

    safeCanvas.width = safeCanvas.offsetWidth;
    safeCanvas.height = safeCanvas.offsetHeight;

    let time = 0;
    // We'll also define an empty array for connections with an explicit type.
    const connections: Connection[] = [];

    // Define infrastructure components
    const components: ComponentData[] = [
      { name: "VPC", x: 100, y: 70, width: 80, height: 40, color: "#5F43E9" },
      { name: "EC2", x: 50, y: 160, width: 70, height: 40, color: "#FF9900" },
      { name: "RDS", x: 150, y: 160, width: 70, height: 40, color: "#FF9900" },
      { name: "S3", x: 250, y: 120, width: 70, height: 40, color: "#FF9900" },
      { name: "IAM", x: 350, y: 80, width: 70, height: 40, color: "#FF9900" },
      {
        name: "CloudFront",
        x: 320,
        y: 160,
        width: 90,
        height: 40,
        color: "#FF9900",
      },
    ];

    // Create connections between components:
    // For every component (except the first), create a connection from component 0 ("VPC")
    components.forEach((comp, i) => {
      if (i > 0) {
        connections.push({
          from: 0, // VPC connects to everything else
          to: i,
        });
      }
    });

    // Terraform code block to display
    const terraformCode = [
      'resource "aws_vpc" "main" {',
      '  cidr_block = "10.0.0.0/16"',
      "  tags = {",
      '    Name = "MainVPC"',
      "  }",
      "}",
      "",
      'resource "aws_instance" "web" {',
      '  ami           = "ami-0c55b159cbfafe1f0"',
      '  instance_type = "t2.micro"',
      "  subnet_id     = aws_subnet.main.id",
      "}",
    ];

    function animate() {
      safeCtx.clearRect(0, 0, safeCanvas.width, safeCanvas.height);
      time += 0.01;

      // Draw Terraform logo in background
      const logoSize = 180;
      const logoX = safeCanvas.width - logoSize - 20;
      const logoY = safeCanvas.height - logoSize - 20;

      // Draw Terraform "T" logo
      safeCtx.globalAlpha = 0.1;
      safeCtx.fillStyle = "#5F43E9"; // Terraform purple
      safeCtx.beginPath();
      safeCtx.moveTo(logoX, logoY);
      safeCtx.lineTo(logoX + logoSize, logoY);
      safeCtx.lineTo(logoX + logoSize, logoY + logoSize / 3);
      safeCtx.lineTo(logoX + (logoSize * 2) / 3, logoY + logoSize / 3);
      safeCtx.lineTo(logoX + (logoSize * 2) / 3, logoY + logoSize);
      safeCtx.lineTo(logoX + logoSize / 3, logoY + logoSize);
      safeCtx.lineTo(logoX + logoSize / 3, logoY + logoSize / 3);
      safeCtx.lineTo(logoX, logoY + logoSize / 3);
      safeCtx.closePath();
      safeCtx.fill();
      safeCtx.globalAlpha = 1.0;

      // Draw the code block
      const codeX = 20;
      const codeY = 220;
      const lineHeight = 15;

      safeCtx.fillStyle = "rgba(0, 0, 0, 0.3)";
      safeCtx.fillRect(
        codeX - 10,
        codeY - 20,
        270,
        terraformCode.length * lineHeight + 30
      );

      safeCtx.font = "12px monospace";
      safeCtx.textAlign = "left";

      // Typing effect for code
      const totalChars = terraformCode.join("").length;
      const visibleChars = Math.floor((time * 10) % (totalChars + 50));

      let charCount = 0;
      for (let i = 0; i < terraformCode.length; i++) {
        const line = terraformCode[i];
        if (charCount > visibleChars) break;
        if (charCount + line.length <= visibleChars) {
          safeCtx.fillStyle = "#5F43E9"; // Terraform purple
          safeCtx.fillText(line, codeX, codeY + i * lineHeight);
          charCount += line.length;
        } else {
          const partialLine = line.substring(0, visibleChars - charCount);
          safeCtx.fillStyle = "#5F43E9";
          safeCtx.fillText(partialLine, codeX, codeY + i * lineHeight);
          if (Math.floor(time * 2) % 2 === 0) {
            safeCtx.fillStyle = "#fff";
            safeCtx.fillText(
              "_",
              codeX + safeCtx.measureText(partialLine).width,
              codeY + i * lineHeight
            );
          }
          break;
        }
      }

      // Draw components
      components.forEach((comp, index) => {
        const pulse = 1 + Math.sin(time * 2 + index) * 0.05;
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
          comp.name,
          comp.x + (comp.width * pulse) / 2,
          comp.y + (comp.height * pulse) / 2
        );
      });

      // Draw connections between components
      connections.forEach((conn) => {
        const from = components[conn.from];
        const to = components[conn.to];
        safeCtx.strokeStyle = "#5F43E9"; // Terraform purple
        safeCtx.lineWidth = 2;
        safeCtx.beginPath();
        safeCtx.moveTo(from.x + from.width / 2, from.y + from.height / 2);
        safeCtx.lineTo(to.x + to.width / 2, to.y + to.height / 2);
        safeCtx.stroke();

        // Animated dot along the connection
        const t = (time % 2) / 2; // cycles 0 to 1 every 2 seconds
        const dotX =
          from.x +
          from.width / 2 +
          t * (to.x + to.width / 2 - (from.x + from.width / 2));
        const dotY =
          from.y +
          from.height / 2 +
          t * (to.y + to.height / 2 - (from.y + from.height / 2));
        safeCtx.fillStyle = "#5F43E9";
        safeCtx.beginPath();
        safeCtx.arc(dotX, dotY, 3, 0, Math.PI * 2);
        safeCtx.fill();
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
    <div className="terraform-visual-container">
      <motion.div
        className="terraform-glow"
        animate={{
          boxShadow: [
            "0 0 20px rgba(95, 67, 233, 0.3)",
            "0 0 40px rgba(95, 67, 233, 0.6)",
            "0 0 20px rgba(95, 67, 233, 0.3)",
          ],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <canvas
        className="terraform-canvas"
        ref={canvasRef}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default TerraformVisual;
