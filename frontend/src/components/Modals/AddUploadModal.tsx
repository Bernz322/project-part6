import { Modal } from "react-bootstrap/";
import { Button } from "..";
import { useTypedSelector } from "../../hooks/rtk-hooks";
import { IUploadDataAdd } from "../../config/types";
import "./modal.scss";

const AddUploadModal = (props: any) => {
  const { isLoading } = useTypedSelector((state) => state.upload);
  let buttonUploadText: string = "Upload now";
  let buttonCancelText: string = "Cancel";
  let buttonType: string = "add";
  let buttonVariant: string = "dark";

  //   const handleSubmit = async () => {
  //     if (description.trim() === "") {
  //       return toast.warn("Description is required!");
  //     }
  //     if (file === null || !file) {
  //       return toast.warn("File is required!");
  //     }

  //     dispatch(addUploadStart());
  //     dispatch(getCurrentUserUploadsStart());

  //     const form = new FormData();
  //     form.append("file", file);
  //     form.append("label", description.trim());
  //     form.append("fileName", file.name);
  //     form.append("uploaderId", loggedInUserID);

  //     try {
  //       const res = await addUpload(form);
  //       dispatch(addUploadSuccess(res));
  //       const currentUserUploads = await fetchUserUploads();
  //       dispatch(getCurrentUserUploadsSuccess(currentUserUploads));
  //       setDescription("");
  //       setFile(null);
  //       props.onHide();
  //     } catch (error) {
  //       dispatch(addUploadFailed());
  //       toast.error(error.response.data.message);
  //     }
  //   };
  return (
    <>
      <Modal
        onHide={props.onHide}
        show={props.show}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        dialogClassName="add-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">Upload</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div>
              <div className="modal-fields">
                <label htmlFor="description">File Description</label>
                <input
                  type="text"
                  value={props?.data?.uploadToAdd?.description as string}
                  name="description"
                  id="description"
                  placeholder="Sample File"
                  onChange={(e) =>
                    props.setUploadData((prevState: IUploadDataAdd) => ({
                      ...prevState,
                      description: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="modal-fields">
                <label htmlFor="file">File Upload</label>
                <input
                  className="file-input"
                  type="file"
                  name="file"
                  id="file"
                  onChange={(e) =>
                    props.setUploadData((prevState: IUploadDataAdd) => ({
                      ...prevState,
                      file: e.target.files,
                    }))
                  }
                />
              </div>
            </div>
            <div className="footer">
              <Button
                type={buttonType}
                variant={buttonVariant}
                text={buttonUploadText}
                bold
                loading={isLoading}
                click={props.add}
              />
              <Button
                type={buttonType}
                variant={buttonVariant}
                text={buttonCancelText}
                bold
                click={props.onHide}
              />
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AddUploadModal;
