import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Line } from "@react-three/drei";

const CloudConnectionVisual = () => {
  return (
    <div className="connection-visual">
      <Canvas shadows dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 10]} intensity={0.5} castShadow />
        <Suspense fallback={null}>
          <CloudConnectionScene />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
    </div>
  );
};

function CloudConnectionScene() {
  const meshRef = useRef<any>();
  const [active, setActive] = useState(false);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group>
      {/* AWS Node */}
      <mesh position={[-4, 0, 0]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#FF9900" />
      </mesh>

      {/* Azure Node */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#0078D4" />
      </mesh>

      {/* GCP Node */}
      <mesh position={[4, 0, 0]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#4285F4" />
      </mesh>

      {/* Connection Lines */}
      <Line
        points={[
          [-4, 0, 0],
          [0, 0, 0],
          [4, 0, 0],
        ]}
        color="#00FF9D"
        lineWidth={5}
        derivatives={[]} // Added required derivatives prop
      />

      {/* Central Hub */}
      <mesh
        ref={meshRef}
        position={[0, 3, 0]}
        onClick={() => setActive(!active)}
        scale={active ? 1.5 : 1}
        castShadow
      >
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#00FF9D" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Connection to Hub */}
      <Line
        points={[
          [-4, 0, 0],
          [0, 3, 0],
        ]}
        color="#00FF9D"
        lineWidth={5}
        dashed
        derivatives={[]} // Added required derivatives prop
      />
      <Line
        points={[
          [0, 0, 0],
          [0, 3, 0],
        ]}
        color="#00FF9D"
        lineWidth={5}
        dashed
        derivatives={[]} // Added required derivatives prop
      />
      <Line
        points={[
          [4, 0, 0],
          [0, 3, 0],
        ]}
        color="#00FF9D"
        lineWidth={5}
        dashed
        derivatives={[]} // Added required derivatives prop
      />
    </group>
  );
}

export default CloudConnectionVisual;
