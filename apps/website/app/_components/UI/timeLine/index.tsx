import clsx from "clsx";
import { FC, HtmlHTMLAttributes, PropsWithChildren } from "react";
import "./index.css";
const TimeLine: FC<HtmlHTMLAttributes<PropsWithChildren>> = ({
  children,
  className,
}) => {
  return <ul className={clsx("timeline", className)}>{children}</ul>;
};

export default TimeLine;
