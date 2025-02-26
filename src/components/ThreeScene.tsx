import { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ThreeScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only proceed if mountRef.current is not null
    if (!mountRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a192f, 0.3); // Semi-transparent background
    mountRef.current.appendChild(renderer.domElement);
    
    // Add responsive resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Create particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 2000;
    
    const posArray = new Float32Array(particleCount * 3);
    const scaleArray = new Float32Array(particleCount);
    
    // Fill arrays with random positions and scales
    for (let i = 0; i < particleCount * 3; i += 3) {
      // Position particles in a spherical distribution
      posArray[i] = (Math.random() - 0.5) * 15;
      posArray[i + 1] = (Math.random() - 0.5) * 15;
      posArray[i + 2] = (Math.random() - 0.5) * 15;
      
      // Random scale for each particle
      scaleArray[i / 3] = Math.random();
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particleGeometry.setAttribute('scale', new THREE.BufferAttribute(scaleArray, 1));
    
    // Particle material - glowing dot effect
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x00ff9d,
      transparent: true,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true,
    });
    
    // Create particle system
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);
    
    // Add skill nodes - 3D representations of your key skills
// Add skill nodes - 3D representations of your key skills
const createSkillNode = (text: string, position: THREE.Vector3, color: number) => {
  const group = new THREE.Group();
  
  // Create a sphere for the node
  const geometry = new THREE.SphereGeometry(0.2, 24, 24);
  const material = new THREE.MeshBasicMaterial({ 
    color: color,
    transparent: true,
    opacity: 0.7
  });
  const sphere = new THREE.Mesh(geometry, material);
  group.add(sphere);
  
  // Position the node
  group.position.set(position.x, position.y, position.z);
  
  return group;
};
    
    // Add skill nodes to represent your main skills
    const skillNodes = [
      createSkillNode("AWS", new THREE.Vector3(3, 2, 0), 0xff9900),
      createSkillNode("Azure", new THREE.Vector3(-3, 1.5, 0), 0x0078d4),
      createSkillNode("GCP", new THREE.Vector3(2, -2, 0), 0x4285f4),
      createSkillNode("DevOps", new THREE.Vector3(-2, -1, 1), 0x00ff9d),
      createSkillNode("Python", new THREE.Vector3(0, 2, 1), 0x3776ab)
    ];
    
    skillNodes.forEach(node => scene.add(node));
    
    // Animation variables
    let frame = 0;
    const mouse = { x: 0, y: 0 };
    
    // Track mouse movement
// Track mouse movement
const onMouseMove = (event: MouseEvent) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
};
    
    window.addEventListener('mousemove', onMouseMove);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      frame += 0.01;
      
      // Rotate entire particle system
      particleSystem.rotation.x = frame * 0.05;
      particleSystem.rotation.y = frame * 0.05;
      
      // Make particles pulse
      const positions = particleSystem.geometry.attributes.position.array;
      const scales = particleSystem.geometry.attributes.scale.array;
      
      for (let i = 0; i < particleCount; i++) {
        const ix = i * 3;
        const iy = i * 3 + 1;
        const iz = i * 3 + 2;
        
        // Add subtle movement to particles
        positions[ix] += Math.sin(frame + i) * 0.003;
        positions[iy] += Math.cos(frame + i) * 0.003;
        positions[iz] += Math.sin(frame + i) * 0.003;
        
        // Pulse the particle size
        scales[i] = Math.abs(Math.sin(frame + i * 0.1)) * 0.5 + 0.5;
      }
      
      particleSystem.geometry.attributes.position.needsUpdate = true;
      particleSystem.geometry.attributes.scale.needsUpdate = true;
      
      // Make skill nodes float
      skillNodes.forEach((node, i) => {
        node.position.y += Math.sin(frame + i) * 0.005;
        node.rotation.y += 0.01;
        
        // Make nodes react to mouse
        node.position.x += (mouse.x * 0.05 - node.position.x * 0.01);
        node.position.y += (mouse.y * 0.05 - node.position.y * 0.01);
      });
      
      // Rotate camera slightly based on mouse position
      camera.position.x = mouse.x * 0.2;
      camera.position.y = mouse.y * 0.2;
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', onMouseMove);
      // Check if mountRef.current exists before attempting to remove child
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className="three-canvas" />;
};

export default ThreeScene;
