import clsx from "clsx";
import { ButtonHTMLAttributes, ReactEventHandler } from "react";

type props = {
  children?: React.ReactNode;
  className?: string;
  onClick?: ReactEventHandler<HTMLButtonElement>;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  loading?: boolean;
  onOk?: () => void;
  animation?: boolean;
  onCancel?: () => void;
  display?: string;
  border?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  className,
  onClick,
  type,
  disabled,
  loading,
  display,
  animation = false,
  border,
}: props) {
  return (
    <button
      className={clsx(
        "p-1 inline-flex rounded outline-none items-center justify-center  ",
        border && "border border-blue-400 text-blue-400",
        animation && "hover:scale-105 transition-[scale] active:scale-95",
        className
      )}
      onClick={onClick}
      type={type}
      disabled={disabled || loading}
    >
      {loading && (
        <svg
          className="animate-spin mr-2 h-5 w-5 text-blue-100"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            stroke-width="4"
          ></circle>
          <path
            opacity={0.75}
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {display && <span className="content-center">{display}</span>}
      {children}
    </button>
  );
}
