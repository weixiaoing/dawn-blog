import { Button, Input } from "antd"
import { useNavigate } from "react-router-dom"
import { signIn } from "../utils/auth"

interface LoginPageFormFields extends HTMLFormControlsCollection {
  username: HTMLInputElement
  password: HTMLInputElement
}
interface LoginPageFormElements extends HTMLFormElement {
  readonly elements: LoginPageFormFields
}

export const LoginPage = () => {
  // const [state, formAction] = useActionState(increment, 0);
  const navigate = useNavigate()
  const handleSubmit = async (e: React.FormEvent<LoginPageFormElements>) => {
    e.preventDefault()

    const username = e.currentTarget.elements.username?.value
    const password = e.currentTarget.elements.password?.value
    if (
      username == import.meta.env.VITE_USER_NAME &&
      password == import.meta.env.VITE_USER_PASSWORD
    ) {
      console.log("success")
      localStorage.setItem(
        "Expire",
        (Date.now() + 7 * 24 * 60 * 60 * 1000).toString()
      )
      navigate("/")
    }
    return
  }

  return (
    <section className="flex flex-col gap-4 mt-20 items-center justify-center">
      <h2>欢迎来到管理后台!</h2>
      <h3>请先登录:</h3>
      <form onSubmit={handleSubmit} className="">
        <label htmlFor="username">用户名:</label>
        <Input type="text" name="username" />
        <label htmlFor="password">密码:</label>
        <Input type="password" name="password" />
        <div className="flex justify-center">
          <Button type="primary" size="large" htmlType="submit">
            登录
          </Button>
        </div>
      </form>
    </section>
  )
}
// function useActionState(increment: any, arg1: number): [any, any] {
//   throw new Error("Function not implemented.");
// }
