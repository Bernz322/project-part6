import { useCallback } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { authLogout } from "../../features/auth/authSlice";
import { useTypedDispatch } from "../../hooks/rtk-hooks";
import classes from "./navbar.module.scss";

const Navbar = () => {
  const dispatch = useTypedDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname.split("/")[1];

  const handleLogout = useCallback(() => {
    dispatch(authLogout()).then(() => {
      navigate("/logout");
    });
  }, [dispatch, navigate]);

  return (
    <nav>
      <ul>
        <NavLink
          className={(navData) =>
            navData.isActive ? classes.navLinkActive : ""
          }
          to="/group-chat"
        >
          <li>Group Chat</li>
        </NavLink>
        <NavLink
          className={(navData) =>
            navData.isActive || path === "edit-user"
              ? classes.navLinkActive
              : ""
          }
          to="/users-list"
        >
          <li>Manage Users</li>
        </NavLink>
        <NavLink
          className={(navData) =>
            navData.isActive || path === "share" ? classes.navLinkActive : ""
          }
          to="/docs-list"
        >
          <li>Manage Documents</li>
        </NavLink>
        <NavLink
          className={(navData) =>
            navData.isActive ? classes.navLinkActive : ""
          }
          to="/logout"
          onClick={handleLogout}
        >
          <li>Logout</li>
        </NavLink>
      </ul>
    </nav>
  );
};

export default Navbar;
