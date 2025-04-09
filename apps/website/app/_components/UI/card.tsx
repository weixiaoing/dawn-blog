/* eslint-disable @next/next/no-img-element */

import clsx from "clsx";
type props = {
  children?: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  describtion?: React.ReactNode;
  border?: boolean;
  coverClick?: () => void;
  hoverable?: boolean;
  cover?: React.ReactNode;
  [key: string]: any;
};
export default function Card({
  children,
  className,
  header,
  footer,
  describtion,
  border,
  cover,
  hoverable = false,
  ...props
}: props) {
  return (
    <div
      className={clsx(
        " rounded-lg  overflow-hidden  ",
        className,
        border && "border border-slate-200  dark:border-opacity-5 ",
        hoverable && "hover:shadow-md"
      )}
    >
      {cover && <>{cover}</>}
      <div className="p-2 overflow-hidden break-words break-all space-y-4">
        {header && <header>{header}</header>}
        {describtion && <div >{describtion}</div>}
        {children}
        {footer && <footer>{footer}</footer>}
      </div>
    </div>
  );
}
