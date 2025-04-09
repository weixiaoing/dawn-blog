"use client";
import { motion } from "framer-motion";
export default function MotionToUp({
  y,
  children,
}: {
  y?: number;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      animate={{ y: [y || 50, 0], opacity: [0, 1] }}
      transition={{ duration: 0.5, type: "spring", stiffness: 50 }}
    >
      {children}
    </motion.div>
  );
}
