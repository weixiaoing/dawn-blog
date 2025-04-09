import clsx from "clsx";
import { FC } from "react";

const Atag: FC<React.ComponentProps<"a">> = ({
  children,
  className,

  ...props
}) => {
  return (
    <a className={clsx("cursor-pointer ", className)} {...props}>
      {children}
    </a>
  );
};
export default Atag;
