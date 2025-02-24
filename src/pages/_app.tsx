// pages/_app.tsx
import type { AppProps } from "next/app";
import { motion } from "framer-motion";
import ThreeScene from "../components/ThreeScene";
import "../styles/globals.css";

function MyApp({ Component, pageProps, router }: AppProps) {
  return (
    <div className="app-container">
      {/* 3D Background Scene */}
      <ThreeScene />

      {/* Page Content with Framer Motion transitions */}
      <motion.div
        key={router.route}
        initial="pageInitial"
        animate="pageAnimate"
        variants={{
          pageInitial: {
            opacity: 0,
            y: 50,
          },
          pageAnimate: {
            opacity: 1,
            y: 0,
            transition: {
              duration: 0.8,
              ease: [0.6, -0.05, 0.01, 0.99],
            },
          },
        }}
      >
        <Component {...pageProps} />
      </motion.div>
    </div>
  );
}

export default MyApp;
