import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";

export default function ThreeScene() {
  return (
    <Canvas className="three-canvas">
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Stars radius={100} depth={50} count={5000} factor={4} />
      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}
