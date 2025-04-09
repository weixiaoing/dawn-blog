import MotionToUp from "@/_components/motion/MotionToUp";
interface PageParams {
  _id: string;
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MotionToUp>{children}</MotionToUp>
    </>
  );
}
