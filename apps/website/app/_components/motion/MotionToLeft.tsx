import { motion } from "framer-motion";
export default function MotionToLeft({
  children,
  stiffness = 100,
}: {
  children: React.ReactNode;
  stiffness?: number;
}) {
  return (
    <motion.div
      animate={{ x: [50, 0], opacity: [0, 1] }}
      transition={{ duration: 0.5, type: "spring", stiffness }}
    >
      {children}
    </motion.div>
  );
}
