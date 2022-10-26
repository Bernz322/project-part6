import { ToastContainer } from "react-toastify";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  DocsList,
  EditUser,
  ErrorPage,
  GroupChat,
  Login,
  LoginSuccess,
  Logout,
  Register,
  RegisterSuccess,
  UsersList,
  Welcome,
} from "./pages";
import PrivateRoutes from "./utils/PrivateRoutes";
import "react-toastify/dist/ReactToastify.min.css";
import "font-awesome/css/font-awesome.css";
import "./styles/app.scss";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<PrivateRoutes />}>
          <Route index element={<Navigate to="/users-list" />} />
          <Route element={<LoginSuccess />} path="/login-success" />
          <Route element={<GroupChat />} path="/group-chat" />
          <Route element={<UsersList />} path="/users-list" />
          <Route element={<EditUser />} path="/edit-user/:id" />
          <Route element={<DocsList />} path="/docs-list" />
          {/* <Route element={<Share />} path="/share/:id" /> */}
        </Route>
        <Route element={<Logout />} path="/logout" />
        <Route element={<Welcome />} path="/welcome" />
        <Route element={<Login />} path="/login" />
        <Route element={<Register />} path="/register" />
        <Route element={<RegisterSuccess />} path="/register-success" />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
      <ToastContainer
        position="top-center"
        autoClose={2500}
        closeButton={false}
        newestOnTop={true}
      />
    </>
  );
}

export default App;
