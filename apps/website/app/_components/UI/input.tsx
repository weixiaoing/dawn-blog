/* eslint-disable react/display-name */
import clsx from "clsx";
import { DetailedHTMLProps, forwardRef, InputHTMLAttributes } from "react";
type props = {
  border?: boolean;
  className?: string;
  type: "text" | "textarea" | "password";
  value?: string;
  placeholder?: string;
  children?: React.ReactNode;
  [key: string]: any;
};
const Input = forwardRef(
  (
    {
      border = true,
      className,
      value,
      type,
      placeholder,
      children,
      ...props
    }: props &
      DetailedHTMLProps<
        InputHTMLAttributes<HTMLInputElement>,
        HTMLInputElement
      >,
    ref: React.Ref<HTMLInputElement & HTMLTextAreaElement>
  ) => {
    switch (type) {
      case "text":
        return (
          <input
            className={clsx(
              "outline-none w-[100%] px-2 py-1 bg-gray-100/80 rounded-sm text-[14px]",
              border && "border border-zinc-200  dark:border-opacity-20",
              "focus:bg-opacity-90 focus:border-slate-800/40 focus:border  focus:shadow-md focus:shadow-green-400/40",
              className
            )}
            type="text"
            placeholder={placeholder}
            {...props}
            ref={ref}
          />
        );

      case "textarea":
        return (
          <textarea
            className={clsx(
              "outline-none w-[100%] min-h-[100px]  resize-none scrolll text-black bg-transparent",
              className
            )}
            value={value}
            placeholder={placeholder}
            {...props}
            ref={ref}
          ></textarea>
        );
      default:
        return (
          <input
            className={clsx(
              "outline-none bg-transparent bg-slate-50 p-1",
              border && "border border-zinc-200  dark:border-opacity-20"
            )}
            type="text"
            {...props}
          />
        );
        break;
    }
  }
);

export default Input;
