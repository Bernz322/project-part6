import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { IUser } from "../config/types";
import { fetchLoggedInUser } from "../utils/apiCalls";
import classes from "../styles/login-success.module.scss";

const LoginSuccess = () => {
  const [user, setUser] = useState<IUser[]>({} as IUser[]);
  useEffect(() => {
    const fetch = async () => {
      try {
        const res: any = await fetchLoggedInUser();
        setUser(res);
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    };
    fetch();
  }, []);

  return (
    <div className={classes.container}>
      <h3>Login Successful</h3>
      <p className="login-success-p">
        Welcome ! <span>{user[0]?.email}</span>
      </p>
    </div>
  );
};

export default LoginSuccess;
