import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner-container">
      <motion.div
        className="loading-spinner"
        animate={{
          rotate: [0, 360],
          borderTopColor: ["#00ff9d", "#0066ff", "#ff3e55", "#00ff9d"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <p className="loading-text">Loading...</p>
    </div>
  );
};

export default LoadingSpinner;
