"use client";

import clsx from "clsx";
import { useCallback, useId, useRef, useState } from "react";
import Notification, { NotificationType } from "./notification";
let count = 0;
const useNotification = (
  position:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    |"top" = "top"
) => {
  
  const [notification, setNotification] = useState<NotificationType[]>([]);
  const triggerNotification = useCallback((props: NotificationType) => {
    setNotification((pre) => {
      return [props, ...pre];
    });
    setTimeout(() => {
      setNotification((pre) => {
        return pre.slice(0, pre.length - 1);
      });
    }, 1000);
    return null;
  }, []);
  const NotificationComponent = notification?.length ? (
    <div
      className={clsx(
        "fixed flex-col flex items-center space-y-5 w-[100%] h-0 overflow-visible",
        {
          "top-5 right-5": position === "top-right",
          "top-5 left-5": position === "top-left",
          "bottom-5 right-5": position === "bottom-right",
          "bottom-5 left-5": position === "bottom-left",
          "top-5 left-[50%] translate-x-[-50%] ": position === "top",
        }
      )}
    >
      {notification.map((prop) => (
        <Notification {...prop} key={count++} />
      ))}
    </div>
  ) : null;
  return { triggerNotification, NotificationComponent };
};

export default useNotification;
