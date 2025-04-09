import { relativeTime } from "@/utils/common";
import { FC, HtmlHTMLAttributes } from "react";

const RelativeTime: FC<
  HtmlHTMLAttributes<HTMLSpanElement> & { date: Date | string }
> = ({ date, ...props }) => {
  const result = relativeTime(date);
  return <span {...props}>{result}</span>;
};
export default RelativeTime;
