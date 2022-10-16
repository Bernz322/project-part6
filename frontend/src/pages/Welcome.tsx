import { FC } from "react";
import { Link, Navigate } from "react-router-dom";
import { Button } from "../components";
import classes from "../styles/welcome.module.scss";
import { isLoggedIn } from "../utils/helpers";

const Welcome: FC = () => {
  if (isLoggedIn()) return <Navigate to="/" />;
  let buttonLoginText: string = "Login";
  let buttonRegisterText: string = "Register";
  return (
    <div className={classes.container}>
      <h3>Welcome to Users Module</h3>
      <h5>Existing Users</h5>
      <Link to="/login">
        <Button text={buttonLoginText} />
      </Link>
      <h5>New Users</h5>
      <Link to="/register">
        <Button text={buttonRegisterText} />
      </Link>
    </div>
  );
};

export default Welcome;
