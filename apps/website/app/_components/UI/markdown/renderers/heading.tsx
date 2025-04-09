import { createElement, DOMAttributes, useId } from "react";

interface HeadingProps {
  id: string;
  className?: string;
  children: React.ReactNode;
  level: number;
}

export const MHeader = (props: HeadingProps) => {
  const { children, id, level } = props;

  const rid = useId();

  const nextId = `${rid}${id}`;
  return createElement<DOMAttributes<HTMLHeadingElement>, HTMLHeadingElement>(
    `h${level}`,
    {
      id: nextId,
      className: "group flex items-center",

      "data-markdown-heading": true,
    } as any,
    null,
    <>
      <span>{children}</span>
    </>
  );
};
