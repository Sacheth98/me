import { useRef, useEffect } from "react";
import * as THREE from "three";

interface ThreeSceneProps {
  isMobile: boolean;
}

const ThreeScene: React.FC<ThreeSceneProps> = ({ isMobile }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup with improved rendering quality
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Improved renderer with antialiasing
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a192f, 0.2);
    mountRef.current.appendChild(renderer.domElement);

    // Add responsive resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener("resize", handleResize);

    // Create a sophisticated particle system.
    // Use isMobile prop to adjust particle count.
    const particleCount = isMobile ? 1000 : 2500;
    const particleGeometry = new THREE.BufferGeometry();

    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;

      // Create a sphere of particles with random distribution
      const radius = Math.random() * 10 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta) - 2;
      positions[i3 + 2] = radius * Math.cos(phi);

      // Randomize scales for depth effect
      scales[i] = Math.random() * 0.5 + 0.5;

      // Generate color gradient between primary and secondary colors
      const colorRatio = Math.random();
      colors[i3] = 0; // R
      colors[i3 + 1] = (1 - colorRatio) * 1.0; // G
      colors[i3 + 2] = colorRatio * 1.0; // B
    }

    particleGeometry.setAttribute(
      "position",
      new THREE.BufferAttribute(positions, 3)
    );
    particleGeometry.setAttribute(
      "scale",
      new THREE.BufferAttribute(scales, 1)
    );
    particleGeometry.setAttribute(
      "color",
      new THREE.BufferAttribute(colors, 3)
    );

    // Custom shader material for particles
    const particleMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        size: { value: 8.0 },
      },
      vertexShader: `
        attribute float scale;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        uniform float size;
        
        void main() {
          vColor = color;
          vec3 pos = position;
          // Add subtle wave motion
          pos.y += sin(time * 0.3 + pos.x * 0.2) * 0.2;
          pos.x += cos(time * 0.2 + pos.z * 0.1) * 0.2;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * scale * (1.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Create a soft, glowing particle with enhanced bloom
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;
          float glow = 1.0 - smoothstep(0.2, 0.5, dist);
          float alpha = glow * glow * 1.5;
          vec3 finalColor = vColor * (0.8 + 0.4 * glow);
          gl_FragColor = vec4(finalColor, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // Add subtle ambient and directional lights
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x00ff9d, 1);
    directionalLight.position.set(-1, 2, 3);
    scene.add(directionalLight);

    // Animation variables
    let timeVal = 0;
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const onMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - window.innerWidth / 2) / window.innerWidth;
      mouseY = (event.clientY - window.innerHeight / 2) / window.innerHeight;
    };

    window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      timeVal += 0.01;
      targetX = mouseX * 0.1;
      targetY = mouseY * 0.1;

      // Update shader uniform
      particleMaterial.uniforms.time.value = timeVal;

      // Adjust particle system rotation based on mouse movement
      particleSystem.rotation.x += (targetY - particleSystem.rotation.x) * 0.02;
      particleSystem.rotation.y += (targetX - particleSystem.rotation.y) * 0.02;

      // Slight camera movement for a parallax effect
      camera.position.x += (targetX * 2 - camera.position.x) * 0.03;
      camera.position.y += (-targetY * 2 - camera.position.y) * 0.03;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", onMouseMove);
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, [isMobile]);

  return <div ref={mountRef} className="three-canvas" />;
};

export default ThreeScene;
