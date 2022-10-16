import { FC } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components";
import classes from "../styles/error-page.module.scss";

const ErrorPage: FC = () => {
  let buttonText: string = "Click here to return to home page";
  let buttonType: string = "unstyled";
  let buttonVariant: string = "cyan";

  return (
    <div className={classes.errorPage}>
      <h1>Oops!</h1>
      <p>Seems like you're lost...</p>
      <p className={classes.error}>
        <i>Page not found</i>
      </p>
      <Link to="/">
        <Button
          text={buttonText}
          type={buttonType}
          variant={buttonVariant}
          bold
        />
      </Link>
    </div>
  );
};
export default ErrorPage;
