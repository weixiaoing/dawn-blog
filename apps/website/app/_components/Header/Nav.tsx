import Link from "next/link";
// import { VscSignIn } from "react-icons/vs";
import Avatar from "../UI/avatar";
import Menu from "../UI/menu";
import SignIn from "../signIn";
export function Nav() {
  const menu = [
    { name: "博客文章", link: "/blog" },
    // { name: "项目", link: "/project" },
    { name: "网站会议", link: "/video" },
    { name: "网站资源", link: "/resource" },
    // { name: "友链", link: "/friends" },
    // { name: "动态", link: "/talk" },
  ]
  return (
    <nav className="p-4 flex justify-between  max-w-[1024px] mx-auto h-20">
      <Link className="place-self-center" href={"/"}>
        <Avatar
          src="https://avatars.githubusercontent.com/u/93917549?v=4"
          alt="Dawn"
          className="size-10"
        />
      </Link>

      <Menu className="box-border px-4 order-1 boreder-none p-0 sm:order-[2] overflow-hidden shadow-md rounded-full flex items-center  justify-around border border-gray-200/85 dark:border-gray-700/60  ">
        {menu.map((item) => {
          return (
            <div
              key={item.name}
              className="px-2 h-full  py-1 box-border  text-[16px] flex justify-center items-start"
            >
              <Link href={item.link}>{item.name}</Link>
            </div>
          )
        })}
      </Menu>

      <SignIn className="order-3 place-self-center" />
    </nav>
  )
}
