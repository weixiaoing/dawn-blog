"use client";
import clsx from "clsx";
import { motion } from "framer-motion";

const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
  transition: {
    // type: "spring",
    // stiffness: 100,
  },
};

const textContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,

    transition: {
      staggerChildren: 0.1,
    },
  },
};

const FadeText = ({
  text,
  className,
  ...props
}: {
  text: string;
  className?: string;
}) => {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={textContainer}
      className={clsx("", className)}
      style={{ fontSize: "2em", fontWeight: "bold" }}
    >
      <div className="flex flex-wrap">
        {text.split("").map((char, index) => {
          return (
            <motion.span key={index} variants={textVariants}>
              {char}
            </motion.span>
          );
        })}
      </div>

      {/* <motion.div variants={textVariants}>你好</motion.div> */}
    </motion.div>
  );
};

export default FadeText;
