import React, { useRef, useEffect } from 'react';

const VideoBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    // Check if canvasRef.current exists before proceeding
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Check if ctx is not null before proceeding
    if (!ctx) return;
    
    let animationFrameId: number;
    
    // Set canvas dimensions
    const setCanvasDimensions = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    
    setCanvasDimensions();
    window.addEventListener('resize', setCanvasDimensions);
    
    // Matrix rain effect
    class Symbol {
      characters: string;
      x: number;
      y: number;
      fontSize: number;
      text: string;
      canvasHeight: number;
      
      constructor(x: number, y: number, fontSize: number, canvasHeight: number) {
        this.characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ{}[]<>/*-+?!@#$%^&()=';
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.text = '';
        this.canvasHeight = canvasHeight;
        this.pickCharacter();
      }
      
      pickCharacter() {
        this.text = this.characters.charAt(Math.floor(Math.random() * this.characters.length));
      }
      
      draw(context: CanvasRenderingContext2D) {
        // Gradient from primary to secondary color
        const gradient = context.createLinearGradient(0, this.y - this.fontSize, 0, this.y);
        gradient.addColorStop(0, 'rgba(0, 255, 157, 1)');
        gradient.addColorStop(1, 'rgba(0, 102, 255, 0.8)');
        
        context.fillStyle = gradient;
        context.fillText(this.text, this.x, this.y);
        
        if (this.y > this.canvasHeight) {
          this.y = 0;
        } else {
          this.y += this.fontSize;
        }
        
        this.pickCharacter();
      }
    }
    
    class Matrix {
      canvas: HTMLCanvasElement;
      context: CanvasRenderingContext2D;
      fontSize: number;
      columns: number;
      symbols: Symbol[];
      
      constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.context = context;
        this.fontSize = 16;
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
        // Semi-transparent black to create trail effect
        this.context.fillStyle = 'rgba(10, 25, 47, 0.05)';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.context.font = this.fontSize + 'px monospace';
        this.symbols.forEach(symbol => symbol.draw(this.context));
      }
    }
    
    const matrix = new Matrix(canvas, ctx);
    
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
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', setCanvasDimensions);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="video-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        opacity: 0.2,
        mixBlendMode: 'screen',
      }}
    />
  );
};

export default VideoBackground;
