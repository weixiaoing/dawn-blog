"use client";
import clsx from "clsx";
import { useState } from "react";
import {
  AiOutlineCheckCircle,
  AiOutlineClose,
  AiOutlineCloseCircle,
  AiOutlineExclamationCircle,
  AiOutlineInfoCircle,
  AiOutlineWarning,
} from "react-icons/ai";

const icons = {
  success: <AiOutlineCheckCircle />,
  info: <AiOutlineInfoCircle />,
  warning: <AiOutlineWarning />,
  error: <AiOutlineExclamationCircle />,
};
export interface NotificationType {
  type?: "info" | "success" | "warning" | "error";
  message: string;
  onClose?: () => void;
}

const Notification = ({
  type = "info",
  message,
  onClose,
}: NotificationType) => {
  return (
    <div
      style={{ transition: "all 0.3s ease-in-out" }}
      className={clsx(
        `bg-white dark:text-white dark:bg-slate-600 p-2 max-w-[20%] m-h-[30px]  m-auto inline-flex items-center rounded-full shadow-2xl font-serif outline-none `
      )}
    >
      <div
        className={clsx("mr-2", {
          "text-green-500": type === "success",
          "text-blue-500": type === "info",
          "text-yellow-500": type === "warning",
          "text-red-500": type === "error",
        })}
      >
        {icons[type]}
      </div>

      <span className=" text-[16px] break-words text-ellipsis text-wrap overflow-auto ">
        {message}
      </span>

      {onClose && (
        <AiOutlineClose
          className="cursor-pointer ml-2  text-[16px] flex items-center"
          onClick={() => {
            onClose();
          }}
        />
      )}
    </div>
  );
};
export default Notification;
