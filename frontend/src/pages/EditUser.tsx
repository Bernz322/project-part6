import { FC, FormEvent, useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "../components";
import { IEditUserData, IResponse, IUser } from "../config/types";
import { editOneUserById, fetchOneUserById } from "../features/user/userSlice";
import { useTypedDispatch, useTypedSelector } from "../hooks/rtk-hooks";
import { validateEmail, validName } from "../utils/helpers";

const EditUser: FC = () => {
  const { isLoading } = useTypedSelector((state) => state.user);
  const dispatch = useTypedDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  let buttonText: string = "Save";
  let buttonVariant: string = "cyan";

  useEffect(() => {
    const fetch = async () => {
      try {
        const data: IEditUserData = await dispatch(
          fetchOneUserById(id as string)
        );
        setName(data.payload.name);
        setEmail(data.payload.email);
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    };
    fetch();
  }, [dispatch, id]);

  const handleEditUser = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (name.trim() === "") return toast.warn("Name is required!");
      if (!validName(name.trim())) return toast.warn("Invalid name!");
      if (email.trim() === "") return toast.warn("Email is required!");
      if (validateEmail(email)) return toast.warn("Invalid Email!");

      const userDetails: IUser = {
        id: id as string,
        name: name.trim(),
        email: email.trim(),
      };
      try {
        dispatch(editOneUserById(userDetails)).then((res: IResponse) => {
          if (!res.error) {
            navigate("/users-list", { replace: true });
          }
        });
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    },
    [name, email, id, navigate, dispatch]
  );

  return (
    <div className="container">
      <h3>Edit User Information</h3>
      <form className="global-form" onSubmit={handleEditUser}>
        <div>
          <label htmlFor="full-name">Full Name</label>
          <input
            defaultValue={name}
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
            defaultValue={email}
            type="text"
            name="email"
            id="email"
            placeholder="anne.hunter@mail.com"
            onChange={(e) => setEmail(e.target.value)}
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

export default EditUser;
