"use client"
import { signInWithGitHub, signInWithGoole } from "@/utils/auth-client"

import { FaGithub } from "react-icons/fa"
import { FcGoogle } from "react-icons/fc"
import Card from "../UI/card"
import Button from "../UI/button"

export default function LogIn() {
  return (
    <div className="flex self-center w-full justify-center">
      <Card className="w-[400px]" border header="使用该功能需要用户登录...">
        <div className="pt-[10px] pb-[50px] gap-4">
          <div
            className="flex cursor-pointer w-full h-full border rounded-xl p-4"
            onClick={() => signInWithGitHub()}
          >
            <FaGithub size={60} />
            <div className="flex ml-4 items-center justify-center text-[20px]">
              GitHub 登录
            </div>
          </div>
          <div
            className="flex mt-4 cursor-pointer  w-full h-full border rounded-xl p-4"
            onClick={() => signInWithGoole()}
          >
            <FcGoogle size={60} />
            <div className="flex ml-4 items-center justify-center text-[20px]">
              Google 登录
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
