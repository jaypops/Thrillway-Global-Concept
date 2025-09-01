import { PropsWithChildren } from "react";
import { motion } from "framer-motion";

function PageTransition({ children }: PropsWithChildren) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}   // when page loads
      animate={{ opacity: 1, y: 0 }}    // animate to
      exit={{ opacity: 0, y: -20 }}     // when leaving
      transition={{ duration: 0.3 }}    // smoothness
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

export default PageTransition;
