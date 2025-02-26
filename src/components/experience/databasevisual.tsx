import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

// Define a type for data flow entries
interface DataFlow {
  from: {
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
    color?: string;
  };
  to: {
    x: number;
    y: number;
    width: number;
    height: number;
    name: string;
    color?: string;
  };
  type: "write" | "read" | "replication";
  speed: number;
  progress: number;
  active: boolean;
}

const DatabaseVisual = () => {
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

    // Define database components
    const primary = {
      x: safeCanvas.width / 2,
      y: 80,
      width: 80,
      height: 60,
      color: "#3FADC5",
      name: "Primary DB",
    };

    const readReplicas = [
      {
        x: safeCanvas.width / 2 - 120,
        y: 200,
        width: 70,
        height: 50,
        color: "#3FADC5",
        name: "Read Replica 1",
      },
      {
        x: safeCanvas.width / 2,
        y: 200,
        width: 70,
        height: 50,
        color: "#3FADC5",
        name: "Read Replica 2",
      },
      {
        x: safeCanvas.width / 2 + 120,
        y: 200,
        width: 70,
        height: 50,
        color: "#3FADC5",
        name: "Read Replica 3",
      },
    ];

    // Connection pool
    const connectionPool = {
      x: safeCanvas.width / 2,
      y: 300,
      width: 140,
      height: 40,
      color: "#1B3A4B",
      name: "Connection Pool",
    };

    // Application servers
    const appServers = [
      {
        x: safeCanvas.width / 2 - 80,
        y: 370,
        width: 60,
        height: 30,
        color: "#176683",
        name: "App 1",
      },
      {
        x: safeCanvas.width / 2,
        y: 370,
        width: 60,
        height: 30,
        color: "#176683",
        name: "App 2",
      },
      {
        x: safeCanvas.width / 2 + 80,
        y: 370,
        width: 60,
        height: 30,
        color: "#176683",
        name: "App 3",
      },
    ];

    // Create data flows for animation (explicitly typed)
    const dataFlows: DataFlow[] = [];

    // Writes: App servers to connection pool
    appServers.forEach((app) => {
      dataFlows.push({
        from: app,
        to: connectionPool,
        type: "write",
        speed: 0.01 + Math.random() * 0.005,
        progress: Math.random(),
        active: true,
      });
    });

    // Connection pool to primary DB
    dataFlows.push({
      from: connectionPool,
      to: primary,
      type: "write",
      speed: 0.008,
      progress: Math.random(),
      active: true,
    });

    // Replication: Primary to read replicas
    readReplicas.forEach((replica) => {
      dataFlows.push({
        from: primary,
        to: replica,
        type: "replication",
        speed: 0.007,
        progress: Math.random(),
        active: true,
      });
    });

    // Reads: Connection pool to read replicas
    readReplicas.forEach((replica) => {
      dataFlows.push({
        from: connectionPool,
        to: replica,
        type: "read",
        speed: 0.012 + Math.random() * 0.008,
        progress: Math.random(),
        active: true,
      });
    });

    function animate() {
      safeCtx.clearRect(0, 0, safeCanvas.width, safeCanvas.height);
      time += 0.01;

      // Draw availability text at the top
      safeCtx.fillStyle = "#3FADC5";
      safeCtx.font = "bold 16px Arial";
      safeCtx.textAlign = "center";
      safeCtx.fillText(
        "Database High Availability: 99.99%",
        safeCanvas.width / 2,
        30
      );

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

      // Draw data flow paths
      dataFlows.forEach((flow) => {
        const fromX = flow.from.x + flow.from.width / 2;
        const fromY =
          flow.from.y + (flow.type === "write" ? 0 : flow.from.height);
        const toX = flow.to.x + flow.to.width / 2;
        const toY = flow.to.y + (flow.type === "write" ? flow.to.height : 0);

        // Choose path color based on flow type
        let pathColor;
        switch (flow.type) {
          case "write":
            pathColor = "rgba(220, 53, 69, 0.3)";
            break;
          case "read":
            pathColor = "rgba(40, 167, 69, 0.3)";
            break;
          case "replication":
            pathColor = "rgba(255, 193, 7, 0.3)";
            break;
        }
        safeCtx.strokeStyle = pathColor;
        safeCtx.lineWidth = 2;
        safeCtx.beginPath();
        safeCtx.moveTo(fromX, fromY);
        const midY = (fromY + toY) / 2;
        safeCtx.bezierCurveTo(fromX, midY, toX, midY, toX, toY);
        safeCtx.stroke();

        // Animate data packet along the path
        flow.progress += flow.speed;
        if (flow.progress > 1) flow.progress = 0;
        const t = flow.progress;
        const bezierPoint = calculateBezierPoint(
          t,
          fromX,
          fromY,
          fromX,
          midY,
          toX,
          midY,
          toX,
          toY
        );
        let packetColor;
        switch (flow.type) {
          case "write":
            packetColor = "#dc3545";
            break;
          case "read":
            packetColor = "#28a745";
            break;
          case "replication":
            packetColor = "#ffc107";
            break;
        }
        safeCtx.fillStyle = packetColor;
        safeCtx.beginPath();
        safeCtx.arc(bezierPoint.x, bezierPoint.y, 4, 0, Math.PI * 2);
        safeCtx.fill();

        // Glow effect for the packet
        const gradient = safeCtx.createRadialGradient(
          bezierPoint.x,
          bezierPoint.y,
          0,
          bezierPoint.x,
          bezierPoint.y,
          10
        );
        gradient.addColorStop(0, packetColor + "80");
        gradient.addColorStop(1, packetColor + "00");
        safeCtx.fillStyle = gradient;
        safeCtx.beginPath();
        safeCtx.arc(bezierPoint.x, bezierPoint.y, 10, 0, Math.PI * 2);
        safeCtx.fill();
      });

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

      // Draw database components
      function drawDatabase(
        db: {
          x: number;
          y: number;
          width: number;
          height: number;
          color: string;
          name: string;
        },
        isReplica = false
      ) {
        safeCtx.fillStyle = db.color;
        // Top ellipse
        safeCtx.beginPath();
        safeCtx.ellipse(
          db.x + db.width / 2,
          db.y,
          db.width / 2,
          db.height / 6,
          0,
          0,
          Math.PI * 2
        );
        safeCtx.fill();
        // Middle rectangle
        safeCtx.fillRect(db.x, db.y, db.width, db.height * 0.8);
        // Bottom ellipse
        safeCtx.beginPath();
        safeCtx.ellipse(
          db.x + db.width / 2,
          db.y + db.height * 0.8,
          db.width / 2,
          db.height / 6,
          0,
          0,
          Math.PI * 2
        );
        safeCtx.fill();

        // Draw database name
        safeCtx.fillStyle = "#fff";
        safeCtx.font = "bold 10px Arial";
        safeCtx.textAlign = "center";
        safeCtx.textBaseline = "middle";
        safeCtx.fillText(db.name, db.x + db.width / 2, db.y + db.height / 2);

        // Replica badge
        if (isReplica) {
          safeCtx.fillStyle = "#ffc107";
          safeCtx.font = "9px Arial";
          safeCtx.fillText("R", db.x + db.width - 12, db.y + 12);
        }
      }

      // Draw primary database
      drawDatabase(primary);
      // Draw read replicas
      readReplicas.forEach((replica) => {
        drawDatabase(replica, true);
      });

      // Draw connection pool
      safeCtx.fillStyle = connectionPool.color;
      safeCtx.beginPath();
      safeCtx.roundRect(
        connectionPool.x - connectionPool.width / 2,
        connectionPool.y - connectionPool.height / 2,
        connectionPool.width,
        connectionPool.height,
        8
      );
      safeCtx.fill();
      safeCtx.fillStyle = "#fff";
      safeCtx.font = "bold 12px Arial";
      safeCtx.textAlign = "center";
      safeCtx.textBaseline = "middle";
      safeCtx.fillText(connectionPool.name, connectionPool.x, connectionPool.y);

      // Draw application servers
      appServers.forEach((server) => {
        safeCtx.fillStyle = server.color;
        safeCtx.beginPath();
        safeCtx.roundRect(
          server.x - server.width / 2,
          server.y - server.height / 2,
          server.width,
          server.height,
          6
        );
        safeCtx.fill();
        safeCtx.fillStyle = "#fff";
        safeCtx.font = "10px Arial";
        safeCtx.textAlign = "center";
        safeCtx.textBaseline = "middle";
        safeCtx.fillText(server.name, server.x, server.y);
      });

      // Draw metrics at the bottom
      const metrics = [
        { label: "Query Response", value: "< 10ms", x: safeCanvas.width / 4 },
        { label: "Failover Time", value: "< 30sec", x: safeCanvas.width / 2 },
        { label: "Data Loss", value: "None", x: (3 * safeCanvas.width) / 4 },
      ];
      metrics.forEach((metric) => {
        safeCtx.fillStyle = "#ccc";
        safeCtx.font = "12px Arial";
        safeCtx.textAlign = "center";
        safeCtx.fillText(metric.label, metric.x, safeCanvas.height - 30);
        safeCtx.fillStyle = "#3FADC5";
        safeCtx.font = "bold 14px Arial";
        safeCtx.fillText(metric.value, metric.x, safeCanvas.height - 10);
      });

      requestAnimationFrame(animate);
    }

    animate();

    return () => {
      // Cleanup if necessary
    };
  }, []);

  return (
    <div className="database-visual-container">
      <motion.div
        className="database-glow"
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

export default DatabaseVisual;
