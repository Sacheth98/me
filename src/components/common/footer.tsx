import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <p className="copyright">
          © {new Date().getFullYear()} Sacheth Reddy Pinnapureddy. All rights
          reserved.
        </p>

        <div className="footer-links">
          <motion.a
            href="https://www.linkedin.com/in/sacheth-reddy/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, color: "#0A66C2" }}
          >
            LinkedIn
          </motion.a>
          <motion.a
            href="https://github.com/sacheth"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -3, color: "#6e5494" }}
          >
            GitHub
          </motion.a>
          <motion.a
            href="mailto:sachethreddy98@gmail.com"
            whileHover={{ y: -3, color: "#00ff9d" }}
          >
            Email
          </motion.a>
        </div>
      </div>

      <div className="footer-note">
        <p>Built with React, Three.js, and ❤️</p>
      </div>
    </footer>
  );
};

export default Footer;
