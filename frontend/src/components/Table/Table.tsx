import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
// import { DeleteModal, AddUploadModal, EditUploadModal } from '..';
// import { tablePopulate } from '../../utils/utils';
import classes from "./table.module.scss";
import { IRowData, ITableData, ITableProps, IUser } from "../../config/types";
import { tablePopulate } from "../../utils/helpers";
import { DeleteModal } from "..";

const Table = ({ data, column, tableName, loading }: ITableProps) => {
  const currentUserId = localStorage.getItem("loggedUser");
  const [rowData, setRowData] = useState<IRowData>({} as IRowData);
  const [deleteModalShow, setDeleteModalShow] = useState<boolean>(false);
  // const [editModalShow, setEditModalShow] = useState<boolean>(false);
  // const [addModalShow, setAddModalShow] = useState<boolean>(false)

  const handleDeleteModal = useCallback((item: IUser, type: string) => {
    // To get row data and open delete modal
    setRowData({ item, type });
    setDeleteModalShow(true);
  }, []);

  // const handleEditUploadModal = (item) => {
  //     // To get row data and open edit upload modal
  //     setRowData(item);
  //     setEditModalShow(true);
  // };

  // const handleAddUpload = () => {
  //     // To open add upload modal
  //     setAddModalShow(true);
  // };

  const tableData = tablePopulate<ITableData>(data);

  return (
    <div className={classes.relative}>
      <table className={classes.globalTable}>
        <thead>
          <tr>
            {column.map((column, index) => {
              return <th key={index}>{column.title}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {tableData?.map((item, index) => {
            return item ? (
              <tr key={item.id}>
                <td className={classes.hide}> {item.id} </td>
                <td>{item.name || item.label}</td>
                {(item.email || item.fileName) && (
                  <td>
                    {item.email || (
                      <a
                        href={`http://localhost:5000/uploads/single/file/${item.file}`}
                      >
                        {item.fileName}
                      </a>
                    )}
                  </td>
                )}
                <td className={classes.tableActions}>
                  {tableName === "users" && (
                    <>
                      <Link to={`/edit-user/${item.id}`}>Edit</Link>
                      <span className={classes.actionSeparator}>|</span>
                      {JSON.stringify(item.id) === currentUserId ? (
                        <p className={classes.userDelete}>Delete</p>
                      ) : (
                        <p
                          className={classes.pointer}
                          onClick={() => handleDeleteModal(item, "user")}
                        >
                          Delete
                        </p>
                      )}
                    </>
                  )}
                  {/* {tableName === "docs" && (
                      <>
                        <p
                          className={classes.pointer}
                          onClick={() => handleEditUploadModal(item)}
                        >
                          Edit
                        </p>
                        <span className={classes.actionSeparator}>|</span>
                        <p
                          className={classes.pointer}
                          onClick={() => handleDeleteModal(item, "upload")}
                        >
                          Delete
                        </p>
                        <span className={classes.actionSeparator}>|</span>
                        <Link to={`/share/${item._id}`}>Share</Link>
                      </>
                    )}
                    {tableName === "shared" && <p>{item.uploader[0].email}</p>}
                    {tableName === "share" && (
                      <p
                        className={classes.pointer}
                        onClick={() => handleDeleteModal(item, "share")}
                      >
                        Remove
                      </p>
                    )} */}
                </td>
              </tr>
            ) : (
              <tr key={index}>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                {tableName !== "share" && <td>&nbsp;</td>}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* {tableName === "shared" &&
                <button className={classes.uploadButton} onClick={() => handleAddUpload()}>+ Add Upload</button>
            } */}
      {/* memoize everything below here */}
      <DeleteModal
        show={deleteModalShow}
        onHide={() => setDeleteModalShow(false)}
        data={rowData}
      />
      {/* <EditUploadModal
                show={editModalShow}
                onHide={() => setEditModalShow(false)}
                data={rowData}
            />
            <AddUploadModal
                show={addModalShow}
                onHide={() => setAddModalShow(false)}
            /> */}
    </div>
  );
};

export default Table;
