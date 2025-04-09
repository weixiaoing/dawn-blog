"use client";
export default function Tool() {
  return (
    <div>
      <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        回到顶部
      </button>
    </div>
  );
}
