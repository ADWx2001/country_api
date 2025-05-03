import { motion } from "framer-motion";

const LoadingSpinner = () => (
  <div className="text-center py-16">
    {/* Framer Motion Spinner */}
    <motion.div
      className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full mx-auto"
      style={{
        borderTopColor: "transparent",
      }}
      animate={{
        rotate: 360,
      }}
      transition={{
        duration: 1,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
      }}
    />
    <p>Loading country data...</p>
  </div>
);

export default LoadingSpinner;
