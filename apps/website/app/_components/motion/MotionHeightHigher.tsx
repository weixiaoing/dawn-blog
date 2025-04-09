"use client";
import { motion } from "framer-motion";
export default function MotionHeightHigher({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      animate={{ height: [, 120] }}
      transition={{ duration: 0.2, type: "spring" }}
    >
      {children}
    </motion.div>
  );
}
