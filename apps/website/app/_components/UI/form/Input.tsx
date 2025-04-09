import clsx from "clsx";
import { FC } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  border?: boolean;
}
const Input: FC<InputProps> = ({ border = true, className, ...props }) => {
  return (
    <input
      className={clsx(
        "outline-none w-full px-2 py-1  rounded-sm text-[14px]",
        border &&
          "border border-zinc-200 rounded-[5px] appearance-none  dark:border-opacity-20",
        "bg-gray-100/80 dark:bg-inherit",
        "focus:bg-inherit focus:ring-2 ring-[#44ae5e83]  focus:border-slate-800/40 focus:border  focus:shadow-inner ",
        "duration-200",
        className
      )}
      {...props}
    />
  );
};
export default Input;
