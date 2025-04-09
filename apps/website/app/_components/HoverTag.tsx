import clsx from "clsx";
import Button from "./UI/button";

export function HoverTag({
  children,
  className,

  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    // <div
    //   className={clsx(
    //     "text-gray-400  hover:text-gray-800 cursor-pointer dark:hover:text-yellow-300 ",
    //     className
    //   )}
    // >
    //   {children}
    // </div>
    <Button className={clsx("text-gray-400  cursor-pointer ", className)}>
      {children}
    </Button>
  );
}
