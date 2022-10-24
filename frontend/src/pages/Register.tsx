import { FC, FormEvent, useCallback, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components";
import { IResponse } from "../config/types";
import { authRegister } from "../features/auth/authSlice";
import { useTypedDispatch, useTypedSelector } from "../hooks/rtk-hooks";
import { isLoggedIn, validateEmail, validName } from "../utils/helpers";
import classes from "../styles/login.module.scss";

const Register: FC = () => {
  const { isLoading } = useTypedSelector((state) => state.auth);
  const dispatch = useTypedDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  let buttonText: string = "Register";
  let buttonVariant: string = "cyan";

  const handleRegister = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!name.trim()) return toast.warn("Full name is required!");
      if (!validName(name.trim())) return toast.warn("Invalid name!");
      if (!email.trim()) return toast.warn("Email is required!");
      if (validateEmail(email.trim())) return toast.warn("Invalid Email!");
      if (!password.trim()) return toast.warn("Password is required!");
      if (password.trim().length < 8)
        return toast.warn("Password must be minimum of 8 characters!");
      if (!confirmPassword.trim()) return toast.warn("Confirm your password!");
      if (confirmPassword.trim() !== password.trim())
        return toast.warn("Your passwords do not match!");

      dispatch(authRegister({ name, email, password })).then(
        (res: IResponse) => {
          if (!res.error) {
            navigate("/register-success");
          }
        }
      );
    },
    [name, email, password, confirmPassword, dispatch, navigate]
  );

  if (isLoggedIn()) return <Navigate to="/" />;

  return (
    <div className={classes.container}>
      <h3>Register</h3>
      <form className="global-form" onSubmit={handleRegister}>
        <div>
          <label htmlFor="full-name">Full Name</label>
          <input
            value={name}
            type="text"
            name="full-name"
            id="full-name"
            placeholder="Anne Hunter"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
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
        <div>
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            value={confirmPassword}
            type="password"
            name="confirm-password"
            id="confirm-password"
            placeholder="******"
            onChange={(e) => setConfirmPassword(e.target.value)}
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

export default Register;
