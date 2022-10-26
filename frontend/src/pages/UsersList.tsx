import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { DeleteModal, Table } from "../components";
import { deleteOneUserById, fetchAllUsers } from "../features/user/userSlice";
import { useTypedDispatch, useTypedSelector } from "../hooks/rtk-hooks";
import classes from "../styles/users-list.module.scss";

const UsersList: FC = () => {
  const { isLoading, users } = useTypedSelector((state) => state.user);
  const dispatch = useTypedDispatch();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [userId, setUserId] = useState<string>("");
  const currentUserId = useMemo(() => localStorage.getItem("loggedUser"), []);

  const tableColumn: string[] = ["Name", "User Email ID", ""];

  useEffect(() => {
    const fetch = async () => {
      dispatch(fetchAllUsers());
    };
    fetch();
  }, [dispatch]);

  const handleDelete = useCallback((id: string) => {
    setShowModal(true);
    setUserId(id);
  }, []);
  const deleteUser = useCallback(() => {
    dispatch(deleteOneUserById(userId));
    setShowModal(false);
  }, [dispatch, userId]);
  return (
    <div className={classes.container}>
      <h3>Users</h3>
      <Table
        data={users}
        isAction
        colHeaders={tableColumn}
        loading={isLoading}
        onEditUser
        onDelete={handleDelete}
        currentUser={currentUserId}
      />
      <DeleteModal
        show={showModal}
        onHide={() => setShowModal(false)}
        data={{ id: userId, type: "usersTable" }}
        delete={deleteUser}
      />
    </div>
  );
};

export default UsersList;
