import { FC } from "react";
import { Link, Navigate } from "react-router-dom";
import classes from "../styles/login.module.scss";
import { isLoggedIn } from "../utils/helpers";

const RegisterSuccess: FC = () => {
  if (isLoggedIn()) return <Navigate to="/" />;
  return (
    <div className={classes.container}>
      <h3>Registration Successful</h3>
      <p>Thank you for your registration</p>
      <Link to="/welcome">Click to return to home page</Link>
    </div>
  );
};

export default RegisterSuccess;
