import MotionToUp from "../motion/MotionToUp";

export default function DefaultLoading() {
  return (
    <div className="text-3xl h-full w-full flex items-center justify-center">
      <MotionToUp>
        <div>loading...</div>
      </MotionToUp>
    </div>
  );
}
