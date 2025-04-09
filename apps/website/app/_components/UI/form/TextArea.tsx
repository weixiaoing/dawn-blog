import clsx from "clsx";
import React, { FC } from "react";
interface TextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  border?: boolean;
}
const TextArea: FC<TextAreaProps> = ({ className, ...props }) => {
  return (
    <textarea
      className={clsx(
        "outline-none w-[100%]  text-[12px]  resize-none scrolll text-black dark:text-zinc-200 bg-transparent",

        className
      )}
      {...props}
    ></textarea>
  );
};
export default TextArea;
