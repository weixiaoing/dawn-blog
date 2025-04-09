"use client";
import { Cursor, useTypewriter } from "react-simple-typewriter";
export default function TypeWriter() {
  const [text] = useTypewriter({
    words: ["Hello !", "I'm Dawn", "A Web <Developer/>"],
    loop: 0,
  });
  return (
    <div className="text-2xl">
      <span>{text}</span>
      <Cursor cursorBlinking={false} />
    </div>
  );
}
