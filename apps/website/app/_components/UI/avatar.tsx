/* eslint-disable @next/next/no-img-element */
"use client";
import clsx from "clsx";

type props = {
  className?: string;
  src: string;
  alt?: string;
  width?: number;
  height?: number;
};

export default function Avatar({
  className,
  src,
  width = 400,
  height = 400,
  alt,
}: props) {
  return (
    <div
      className={clsx(
        "inline-block  rounded-[30%] overflow-hidden size-[2rem]",
        className
      )}
    >
      <img
        loading="lazy"
        className="w-full h-full object-cover"
        src={src}
        onError={(e) => {
          console.log("error");
          e.currentTarget.src = "https://github.com/shadcn.png";
        }}
        alt={alt || "avatar"}
        width={width}
        height={height}
      />
    </div>
  );
}
