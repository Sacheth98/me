import { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, OrbitControls, Sphere, Trail } from "@react-three/drei";
import * as THREE from "three";
import SimpleSkillGalaxy from "./simpleskillgalaxy";

// Define prop types for SkillGalaxy
interface SkillGalaxyProps {
  isMobile: boolean;
}

interface SkillNodeProps {
  position: [number, number, number];
  name: string;
  color: string;
  size?: number;
  orbitSpeed?: number;
  orbitRadius?: number;
}

function SkillNode({
  position,
  name,
  color,
  size = 1,
  orbitSpeed = 0.001,
  orbitRadius = 5,
}: SkillNodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [angle, setAngle] = useState(Math.random() * Math.PI * 2);

  // Update orbit angle and position
  useFrame(() => {
    setAngle((prevAngle) => prevAngle + orbitSpeed);
    if (meshRef.current) {
      meshRef.current.position.x = Math.cos(angle) * orbitRadius;
      meshRef.current.position.z = Math.sin(angle) * orbitRadius;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group position={position}>
      <Trail
        width={5}
        color={new THREE.Color(color)}
        length={5}
        decay={1}
        attenuation={(width) => width}
      >
        <Sphere
          ref={meshRef}
          args={[size * (hovered ? 1.2 : 1), 16, 16]}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={() => setClicked(!clicked)}
        >
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={hovered ? 2 : 0.5}
            metalness={0.8}
            roughness={0.2}
          />
        </Sphere>
      </Trail>

      {(hovered || clicked) && (
        <Text
          position={[
            meshRef.current?.position.x || 0,
            (meshRef.current?.position.y || 0) + size * 1.5,
            meshRef.current?.position.z || 0,
          ]}
          fontSize={0.5}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {name}
        </Text>
      )}
    </group>
  );
}

interface Skill {
  name: string;
  level: number;
  color?: string;
}

interface SkillCategoryProps {
  name: string;
  skills: Skill[];
  position: [number, number, number];
  color: string;
}

function SkillCategory({ name, skills, position, color }: SkillCategoryProps) {
  return (
    <group position={position}>
      <Text
        position={[0, 2, 0]}
        fontSize={1}
        color={color}
        font="/fonts/SpaceGrotesk-Bold.ttf"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
      {skills.map((skill, i) => (
        <SkillNode
          key={i}
          name={skill.name}
          position={[0, 0, 0]}
          color={skill.color || color}
          size={skill.level / 10}
          orbitSpeed={0.001 + i * 0.0005}
          orbitRadius={3 + i}
        />
      ))}
    </group>
  );
}

function SkillGalaxyScene() {
  const { camera } = useThree();
  const galaxyRef = useRef<THREE.Group>(null);

  useEffect(() => {
    camera.position.set(0, 15, 30);
  }, [camera]);

  useFrame(() => {
    if (galaxyRef.current) {
      galaxyRef.current.rotation.y += 0.001;
    }
  });

  const skillCategories = [
    {
      name: "Cloud Platforms",
      color: "#FF9900",
      position: [-10, 0, 0] as [number, number, number],
      skills: [
        { name: "AWS", level: 9, color: "#FF9900" },
        { name: "Azure", level: 8, color: "#0078D4" },
        { name: "GCP", level: 7, color: "#4285F4" },
        { name: "Kubernetes", level: 8.5, color: "#326CE5" },
        { name: "Docker", level: 8, color: "#2496ED" },
      ],
    },
    {
      name: "DevOps Tools",
      color: "#00FF9D",
      position: [10, 0, 0] as [number, number, number],
      skills: [
        { name: "Terraform", level: 9, color: "#7B42BC" },
        { name: "Jenkins", level: 8, color: "#D33833" },
        { name: "Ansible", level: 7.5, color: "#EE0000" },
        { name: "GitHub Actions", level: 8, color: "#2088FF" },
        { name: "Prometheus", level: 7, color: "#E6522C" },
      ],
    },
    {
      name: "Programming",
      color: "#0066FF",
      position: [0, 0, -10] as [number, number, number],
      skills: [
        { name: "Python", level: 8, color: "#3776AB" },
        { name: "Bash", level: 7.5, color: "#4EAA25" },
        { name: "YAML", level: 8, color: "#CB171E" },
        { name: "Java", level: 6, color: "#007396" },
      ],
    },
  ];

  return (
    <group ref={galaxyRef}>
      {/* Central sun */}
      <Sphere position={[0, 0, 0]} args={[2, 32, 32]}>
        <meshStandardMaterial
          color="#FFFFFF"
          emissive="#FFFFFF"
          emissiveIntensity={2}
        />
      </Sphere>
      {skillCategories.map((category, i) => (
        <SkillCategory
          key={i}
          name={category.name}
          skills={category.skills}
          position={category.position}
          color={category.color}
        />
      ))}
    </group>
  );
}

const SkillGalaxy: React.FC<SkillGalaxyProps> = ({ isMobile }) => {
  const [is3DFailed, setIs3DFailed] = useState(false);

  useEffect(() => {
    // Check if WebGL is available
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (!gl) {
      setIs3DFailed(true);
    }
  }, []);

  if (is3DFailed) {
    return <SimpleSkillGalaxy isMobile={isMobile} />;
  }

  return (
    <div className="skill-galaxy-container">
      <h2 className="section-title">My Technical Universe</h2>
      <p className="section-description">
        Navigate through my skill galaxy to explore my technical expertise
      </p>
      <div className="skill-galaxy">
        <Canvas shadows onError={() => setIs3DFailed(true)}>
          <ambientLight intensity={0.1} />
          <pointLight position={[0, 0, 0]} intensity={1} distance={50} />
          <Suspense fallback={null}>
            <SkillGalaxyScene />
          </Suspense>
          <OrbitControls enableZoom={true} enablePan={true} />
        </Canvas>
      </div>
      <div className="galaxy-instructions">
        <p>Drag to rotate • Scroll to zoom • Click on skills for details</p>
      </div>
    </div>
  );
};

export default SkillGalaxy;
