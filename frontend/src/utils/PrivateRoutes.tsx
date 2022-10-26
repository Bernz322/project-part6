import { FC } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { Navbar } from "../components";
import { isLoggedIn } from "./helpers";

const PrivateRoutes: FC = () => {
  if (!isLoggedIn()) return <Navigate to="/welcome" replace />;

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default PrivateRoutes;
