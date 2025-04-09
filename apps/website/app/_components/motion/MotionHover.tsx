import { motion } from "framer-motion";
export default function MotionHover({
  children,
}: {
  children: React.ReactNode;
}) {
  return <motion.div>
    <div className="absolute "></div>
    {children}</motion.div>;
}
