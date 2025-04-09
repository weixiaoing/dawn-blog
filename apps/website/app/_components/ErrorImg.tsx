"use client";

function ErrorImg({ src, errorUrl }) {
  const a = () => {};
  return (
    <>
      <img
        className=" h-[200px] w-full  "
        src={src}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = errorUrl;
        }}
      />
    </>
  );
}
export default ErrorImg;
