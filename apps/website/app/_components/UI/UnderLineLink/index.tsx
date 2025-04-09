import clsx from "clsx";
import Link from "next/link";
import { ComponentProps } from "react";
import styles from "./UnderLineLink.module.css";

type UnderLineLinkProps = ComponentProps<typeof Link> & {
  className?: string;
  track?: boolean;
};

const UnderLineLink = ({
  className = "",
  children,
  track,
  ...props
}: UnderLineLinkProps) => {
  return (
    <Link className={clsx(styles.underline, track && styles.track)} {...props}>
      {children}
    </Link>
  );
};

export default UnderLineLink;
