import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Stars } from "@react-three/drei";

const InteractiveCommunication = () => {
  const [communicationStep, setCommunicationStep] = useState(0);
  const [messageContent, setMessageContent] = useState("");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [typedMessage, setTypedMessage] = useState("");

  // Terminal typing effect
  useEffect(() => {
    if (communicationStep === 0) {
      const welcome =
        "Establishing secure communication channel with Sacheth Reddy...";
      let i = 0;
      const typeInterval = setInterval(() => {
        setTypedMessage(welcome.substring(0, i));
        i++;
        if (i > welcome.length) {
          clearInterval(typeInterval);
          setTimeout(() => {
            setCommunicationStep(1);
          }, 1000);
        }
      }, 40);
      return () => clearInterval(typeInterval);
    }
  }, [communicationStep]);

  // Fix: Add type annotation for event parameter
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSending(true);

    // Simulate sending message
    setTimeout(() => {
      setIsSending(false);
      setSendSuccess(true);

      // Reset after success message
      setTimeout(() => {
        setCommunicationStep(1);
        setMessageContent("");
        setSenderName("");
        setSenderEmail("");
        setSendSuccess(false);
      }, 5000);
    }, 2000);
  };

  return (
    <section className="communication-system">
      <h2 className="section-title">Establish Contact</h2>

      <div className="communication-container">
        <div className="visual-space">
          <Canvas>
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={0.8} />
            <CommunicationVisual
              stage={communicationStep}
              sending={isSending}
              success={sendSuccess}
            />
            <Stars radius={50} depth={50} count={1000} factor={4} />
          </Canvas>
        </div>

        <div className="communication-interface">
          <AnimatePresence mode="wait">
            {communicationStep === 0 && (
              <motion.div
                className="terminal-interface"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="terminal"
              >
                <div className="terminal-window">
                  <div className="terminal-header">
                    <div className="terminal-button red"></div>
                    <div className="terminal-button yellow"></div>
                    <div className="terminal-button green"></div>
                  </div>
                  <div className="terminal-content">
                    <p className="terminal-text">
                      <span className="terminal-prompt">$ </span>
                      {typedMessage}
                      <span className="terminal-cursor">_</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {communicationStep === 1 && (
              <motion.div
                className="comm-channel-options"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                key="options"
              >
                <h3 className="comm-title">Select Communication Channel</h3>

                <div className="channel-options">
                  <motion.div
                    className="channel-option"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 5px 15px rgba(0, 255, 157, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCommunicationStep(2)}
                  >
                    <div className="channel-icon">✉️</div>
                    <div className="channel-name">Direct Message</div>
                  </motion.div>

                  <motion.a
                    className="channel-option"
                    href="https://www.linkedin.com/in/sacheth-reddy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 5px 15px rgba(0, 102, 255, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="channel-icon">🔗</div>
                    <div className="channel-name">LinkedIn</div>
                  </motion.a>

                  <motion.a
                    className="channel-option"
                    href="tel:+19088483791"
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 5px 15px rgba(255, 62, 85, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="channel-icon">📱</div>
                    <div className="channel-name">Call</div>
                  </motion.a>
                </div>
              </motion.div>
            )}

            {communicationStep === 2 && (
              <motion.div
                className="message-composer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                key="composer"
              >
                <div className="composer-header">
                  <motion.button
                    className="back-button"
                    onClick={() => setCommunicationStep(1)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    ← Back
                  </motion.button>
                  <h3 className="composer-title">Compose Message</h3>
                </div>

                <form className="message-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="sender-name">Your Name</label>
                    <input
                      type="text"
                      id="sender-name"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="sender-email">Your Email</label>
                    <input
                      type="email"
                      id="sender-email"
                      value={senderEmail}
                      onChange={(e) => setSenderEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message-content">Message</label>
                    <textarea
                      id="message-content"
                      rows={5}
                      value={messageContent}
                      onChange={(e) => setMessageContent(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <motion.button
                    type="submit"
                    className={`send-button ${isSending ? "sending" : ""} ${
                      sendSuccess ? "success" : ""
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSending || sendSuccess}
                  >
                    {isSending
                      ? "Sending..."
                      : sendSuccess
                      ? "Message Sent!"
                      : "Send Message"}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

// 3D Communication Visual
interface CommunicationVisualProps {
  stage: number;
  sending: boolean;
  success: boolean;
}

function CommunicationVisual({
  stage,
  sending,
  success,
}: CommunicationVisualProps) {
  const satelliteRef = useRef<THREE.Group>();
  const beamRef = useRef<THREE.Mesh>();
  const earthRef = useRef<THREE.Mesh>();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (satelliteRef.current) {
      satelliteRef.current.rotation.y = t * 0.1;

      // Orbit animation
      satelliteRef.current.position.x = Math.sin(t * 0.2) * 5;
      satelliteRef.current.position.z = Math.cos(t * 0.2) * 5;
    }

    if (earthRef.current) {
      earthRef.current.rotation.y = t * 0.05;
    }

    // Communication beam effect when sending
    if (beamRef.current) {
      if (sending) {
        beamRef.current.visible = true;
        beamRef.current.scale.y = 1 + Math.sin(t * 10) * 0.2;
        if (beamRef.current.material) {
          (beamRef.current.material as THREE.MeshBasicMaterial).opacity =
            0.6 + Math.sin(t * 10) * 0.4;
        }
      } else if (success) {
        beamRef.current.visible = true;
        beamRef.current.scale.y = 1;
        if (beamRef.current.material) {
          (beamRef.current.material as THREE.MeshBasicMaterial).opacity = 1;
        }
      } else {
        beamRef.current.visible = false;
      }
    }
  });

  return (
    <group>
      {/* Earth */}
      <mesh ref={earthRef as React.RefObject<THREE.Mesh>} position={[0, -8, 0]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshStandardMaterial color="#0066ff" metalness={0.3} roughness={0.7} />
      </mesh>

      {/* Satellite */}
      <group
        ref={satelliteRef as React.RefObject<THREE.Group>}
        position={[5, 0, 0]}
      >
        <mesh>
          <boxGeometry args={[0.5, 0.5, 1]} />
          <meshStandardMaterial
            color="#00ff9d"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Solar panels */}
        <mesh position={[1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[1, 0.5]} />
          <meshStandardMaterial
            color="#3399ff"
            metalness={0.9}
            roughness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh position={[-1, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <planeGeometry args={[1, 0.5]} />
          <meshStandardMaterial
            color="#3399ff"
            metalness={0.9}
            roughness={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* Dish */}
        <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 4, 0, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.05, 16]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* Communication Beam */}
      <mesh
        ref={beamRef as React.RefObject<THREE.Mesh>}
        position={[0, -4, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        visible={false}
      >
        <cylinderGeometry args={[0.1, 0.1, 8, 8, 1, true]} />
        <meshBasicMaterial
          color="#00ff9d"
          transparent={true}
          opacity={0.6}
          side={THREE.DoubleSide}
        />
      </mesh>

      {stage > 0 && (
        <Text
          position={[0, 2, 0]}
          color="#00ff9d"
          fontSize={0.5}
          maxWidth={5}
          textAlign="center"
        >
          {stage === 1
            ? "Channel Established"
            : sending
            ? "Sending Message..."
            : success
            ? "Message Delivered"
            : "Composing Message"}
        </Text>
      )}
    </group>
  );
}

export default InteractiveCommunication;
