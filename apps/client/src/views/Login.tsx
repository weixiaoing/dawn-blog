import { Input } from "antd";
import { useNavigate } from "react-router-dom";

interface LoginPageFormFields extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
}
interface LoginPageFormElements extends HTMLFormElement {
  readonly elements: LoginPageFormFields;
}

export const LoginPage = () => {
  // const [state, formAction] = useActionState(increment, 0);
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent<LoginPageFormElements>) => {
    e.preventDefault();
    const username = e.currentTarget.elements.username?.value;
    const password = e.currentTarget.elements.password?.value;
    if (
      username == import.meta.env.VITE_USER_NAME &&
      password == import.meta.env.VITE_USER_PASSWORD
    ) {
      console.log("success");
      localStorage.setItem(
        "Expire",
        (Date.now() + 7 * 24 * 60 * 60 * 1000).toString()
      );
      navigate("/");
    }
    return;
  };

  return (
    <section className="flex flex-col items-center justify-center">
      <h2>Welcome to Manage!</h2>
      <h3>Please Login in:</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">User:</label>
        <Input type="text" name="username" />
        <label htmlFor="password">PassWord:</label>
        <Input type="password" name="password" />
        <button className="border p-2 mx-auto">Log In</button>
      </form>
    </section>
  );
};
function useActionState(increment: any, arg1: number): [any, any] {
  throw new Error("Function not implemented.");
}
