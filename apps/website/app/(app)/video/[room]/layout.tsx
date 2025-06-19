"use client"
import { Header } from "@/_components/Header"
import LogIn from "@/_components/LogIn"

import Provider from "@/provider"
import { useSession } from "@/utils/auth-client"
export default function VideodLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = useSession()
  if (!session?.data?.user) {
    return (
      <div className="bg-transparent flex items-center justify-center ">
        <LogIn />
      </div>
    )
  }
  return (
    <div className=" bg-transparent flex-col font-normal dark:text-white ">
      <div className="w-full">{children}</div>
    </div>
  )
}
