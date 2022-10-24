import { FormEvent, useCallback, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components";
import { IResponse } from "../config/types";
import { authLogin } from "../features/auth/authSlice";
import { useTypedDispatch, useTypedSelector } from "../hooks/rtk-hooks";
import { isLoggedIn, validateEmail } from "../utils/helpers";
import classes from "../styles/login.module.scss";

const Login = () => {
  const { isLoading } = useTypedSelector((state) => state.auth);
  const dispatch = useTypedDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  let buttonText: string = "Login";
  let buttonVariant: string = "cyan";

  const handleLogin = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!email.trim()) return toast.warn("Email is required!");
      if (validateEmail(email)) return toast.warn("Invalid Email!");
      if (!password.trim()) return toast.warn("Password is required!");
      if (password.trim().length < 8)
        return toast.warn("Password must be minimum of 8 characters!");

      dispatch(authLogin({ email, password })).then((res: IResponse) => {
        if (!res.error) {
          navigate("/login-success", { replace: true });
        }
      });
    },
    [email, password, navigate, dispatch]
  );

  if (isLoggedIn()) return <Navigate to="/" />;

  return (
    <div className={classes.container}>
      <h3>Login</h3>
      <form className="global-form" onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            value={email}
            type="text"
            name="email"
            id="email"
            placeholder="anne.hunter@mail.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            value={password}
            type="password"
            name="password"
            id="password"
            placeholder="******"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button
          text={buttonText}
          variant={buttonVariant}
          bold
          loading={isLoading}
        />
      </form>
    </div>
  );
};

export default Login;
