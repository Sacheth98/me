import React, { useRef, useEffect } from "react";

interface MatrixBackgroundProps {
  density: "low" | "high";
}

const MatrixBackground: React.FC<MatrixBackgroundProps> = ({ density }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId: number;

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasDimensions();
    window.addEventListener("resize", setCanvasDimensions);

    // Adjust font size based on density: smaller font size for "high" density increases the number of columns.
    const fontSize = density === "high" ? 12 : 16;

    // Matrix rain effect classes
    class Symbol {
      characters: string;
      x: number;
      y: number;
      fontSize: number;
      text: string;
      canvasHeight: number;
      speed: number;

      constructor(
        x: number,
        y: number,
        fontSize: number,
        canvasHeight: number
      ) {
        this.characters =
          "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]<>/*-+?!@#$%^&()=";
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.text = "";
        this.canvasHeight = canvasHeight;
        this.speed = Math.random() * 2 + 1;
        this.pickCharacter();
      }

      pickCharacter() {
        this.text = this.characters.charAt(
          Math.floor(Math.random() * this.characters.length)
        );
      }

      draw(context: CanvasRenderingContext2D) {
        const colorPosition = this.y / this.canvasHeight;
        const r = Math.floor(0);
        const g = Math.floor(255 - colorPosition * 100);
        const b = Math.floor(100 + colorPosition * 157);
        const alpha = 0.8 + Math.random() * 0.2;
        context.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        context.fillText(this.text, this.x, this.y);
        if (Math.random() > 0.99) {
          this.pickCharacter();
        }
        this.y += this.speed;
        if (this.y > this.canvasHeight) {
          this.y = 0;
          this.x = Math.floor(Math.random() * canvas.width);
        }
      }
    }

    class Matrix {
      canvas: HTMLCanvasElement;
      context: CanvasRenderingContext2D;
      fontSize: number;
      columns: number;
      symbols: Symbol[];

      constructor(
        canvas: HTMLCanvasElement,
        context: CanvasRenderingContext2D,
        fontSize: number
      ) {
        this.canvas = canvas;
        this.context = context;
        this.fontSize = fontSize;
        this.columns = this.canvas.width / this.fontSize;
        this.symbols = [];
        this.initialize();
      }

      initialize() {
        for (let i = 0; i < this.columns; i++) {
          this.symbols[i] = new Symbol(
            i * this.fontSize,
            this.randomIntFromRange(-this.canvas.height, 0),
            this.fontSize,
            this.canvas.height
          );
        }
      }

      randomIntFromRange(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      }

      resize(width: number, height: number) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.columns = this.canvas.width / this.fontSize;
        this.symbols = [];
        this.initialize();
      }

      draw() {
        // Semi-transparent black for the trailing effect
        this.context.fillStyle = "rgba(10, 25, 47, 0.05)";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.font = `${this.fontSize}px monospace`;
        this.symbols.forEach((symbol) => symbol.draw(this.context));
      }
    }

    const matrix = new Matrix(canvas, ctx, fontSize);

    // Animation loop
    const animate = () => {
      matrix.draw();
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      setCanvasDimensions();
      matrix.resize(canvas.width, canvas.height);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", setCanvasDimensions);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className="matrix-background"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        opacity: 0.2,
        mixBlendMode: "screen",
      }}
    />
  );
};

export default MatrixBackground;
