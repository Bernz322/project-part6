import { FC, useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import {
  AddUploadModal,
  DeleteModal,
  EditUploadModal,
  Table,
} from "../components";
import { IUploadDataAdd, IUploadDataEdit } from "../config/types";
import {
  fetchCurrentUserUploads,
  fetchSharedToUserUploads,
  createUpload,
  editUpload,
  deleteUpload,
} from "../features/upload/uploadSlice";
import { useTypedDispatch, useTypedSelector } from "../hooks/rtk-hooks";
import classes from "../styles/docs-list.module.scss";

const DocList: FC = () => {
  const { userUploads, sharedToUserUploads, isLoading } = useTypedSelector(
    (state) => state.upload
  );
  const dispatch = useTypedDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [uploadId, setUploadId] = useState<string>("");
  const [uploadToEditData, setUploadToEditData] = useState<IUploadDataEdit>(
    {} as IUploadDataEdit
  );
  const [uploadToAddData, setUploadToAddData] = useState<IUploadDataAdd>(
    {} as IUploadDataAdd
  );
  const currentUserId = useMemo(
    () => JSON.parse(localStorage.getItem("loggedUser") || ""),
    []
  );

  const tableColumnUploads: string[] = ["Label", "File Name", "Action"];
  const tableColumnSharedUploads: string[] = [
    "Label",
    "File Name",
    "Shared by",
  ];
  useEffect(() => {
    const fetch = async () => {
      dispatch(fetchCurrentUserUploads());
      dispatch(fetchSharedToUserUploads());
    };
    fetch();
  }, [dispatch]);

  const handleDelete = useCallback((id: string) => {
    setShowDeleteModal(true);
    setUploadId(id);
  }, []);
  const deleteUploadHandler = useCallback(() => {
    dispatch(deleteUpload(uploadId));
    setShowDeleteModal(false);
  }, [uploadId, dispatch]);

  const handleEdit = useCallback((data: IUploadDataEdit) => {
    setShowEditModal(true);
    setUploadToEditData(data);
  }, []);
  const editUploadHandler = useCallback(() => {
    if (uploadToEditData.label.trim() === "")
      return toast.warn(
        "Description is required, if you wish to not do any changes, click cancel."
      );

    dispatch(
      editUpload({ id: uploadToEditData.id, label: uploadToEditData.label })
    );
    setShowEditModal(false);
  }, [uploadToEditData, dispatch]);

  const handleAdd = useCallback(() => {
    setShowAddModal(true);
  }, []);
  const addUploadHandler = useCallback(() => {
    if (
      !uploadToAddData.description ||
      uploadToAddData.description.trim() === ""
    )
      return toast.warn("Description is required!");
    if (uploadToAddData.file === null || !uploadToAddData.file) {
      return toast.warn("File is required!");
    }
    const file = uploadToAddData?.file[0];

    const uploadForm = new FormData();
    uploadForm.append("label", uploadToAddData.description as string);
    uploadForm.append("fileLocation", file);
    uploadForm.append("fileName", file.name as string);
    uploadForm.append("uploaderId", currentUserId as string);
    dispatch(createUpload(uploadForm));
    setUploadToAddData((prevState: IUploadDataAdd) => ({
      ...prevState,
      file: null,
      description: "",
    }));
    setShowAddModal(false);
  }, [uploadToAddData, currentUserId, dispatch]);

  return (
    <div className={classes.container}>
      <h3>My Uploads</h3>
      <Table
        data={userUploads}
        isAction
        colHeaders={tableColumnUploads}
        loading={isLoading}
        onEditUpload={handleEdit}
        onDelete={handleDelete}
        onShare
      />
      <h3 className={classes.sharedHeader}>Shared Uploads</h3>
      <Table
        data={sharedToUserUploads}
        isAction
        colHeaders={tableColumnSharedUploads}
        loading={isLoading}
        onAddUpload={handleAdd}
        onUserSharer
      />
      <DeleteModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        data={{ id: uploadId, type: "uploadsTable" }}
        delete={deleteUploadHandler}
      />
      <EditUploadModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        data={{ uploadToEditData, type: "uploadsTable" }}
        setLabel={setUploadToEditData}
        edit={editUploadHandler}
      />
      <AddUploadModal
        show={showAddModal}
        onHide={() => {
          setShowAddModal(false);
          setUploadToAddData((prevState: IUploadDataAdd) => ({
            ...prevState,
            file: null,
            description: "",
          }));
        }}
        data={{ uploadToAddData, type: "uploadsTable" }}
        setUploadData={setUploadToAddData}
        add={addUploadHandler}
      />
    </div>
  );
};

export default DocList;
