import { FC, useEffect } from "react";
import { toast } from "react-toastify";
import { Table } from "../components";
import { ITableColumn } from "../config/types";
import { fetchAllUsers } from "../features/user/userSlice";
import { useTypedDispatch, useTypedSelector } from "../hooks/rtk-hooks";
import classes from "../styles/users-list.module.scss";

const UsersList: FC = () => {
  const { isLoading, users } = useTypedSelector((state) => state.user);
  const dispatch = useTypedDispatch();
  let usersTable: string = "users";

  const tableColumn: ITableColumn[] = [
    {
      title: "Name",
    },
    {
      title: "User Email ID",
    },
    {
      title: "",
    },
  ];

  useEffect(() => {
    const fetch = async () => {
      try {
        dispatch(fetchAllUsers());
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    };
    fetch();
  }, [dispatch]);

  return (
    <div className={classes.container}>
      <h3>Users</h3>
      <Table
        data={users}
        column={tableColumn}
        tableName={usersTable}
        loading={isLoading}
      />
    </div>
  );
};

export default UsersList;
