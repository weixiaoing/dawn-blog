import clsx from "clsx";
import { ReactNode } from "react";

export function Skeleton({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={clsx("animate-pulse  rounded-md bg-gray-200", className)}>
      {children}
    </div>
  );
}
