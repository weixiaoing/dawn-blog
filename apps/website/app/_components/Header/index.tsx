import { Nav } from "./Nav";
import { ScrollTop } from "./ScollTop";

export function Header() {
  return (
    <header className=" dark:border-none w-full mb-10  ">
      {/* <ScrollTop /> */}
      <Nav></Nav>
    </header>
  )
}
