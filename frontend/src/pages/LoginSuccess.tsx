import { FC, useEffect } from "react";
import { toast } from "react-toastify";
import classes from "../styles/login-success.module.scss";
import { useTypedDispatch, useTypedSelector } from "../hooks/rtk-hooks";
import { fetchCurrentLoggedUser } from "../features/user/userSlice";

const LoginSuccess: FC = () => {
  const { isLoading, currentUser } = useTypedSelector((state) => state.user);
  const dispatch = useTypedDispatch();

  useEffect(() => {
    const fetch = async () => {
      try {
        dispatch(fetchCurrentLoggedUser());
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    };
    fetch();
  }, [dispatch]);

  return (
    <div className={classes.container}>
      <h3>Login Successful</h3>
      {isLoading ? (
        <i className="fa fa-spinner loader"></i>
      ) : (
        <p>
          Welcome ! <span>{currentUser?.email}</span>
        </p>
      )}
    </div>
  );
};

export default LoginSuccess;
