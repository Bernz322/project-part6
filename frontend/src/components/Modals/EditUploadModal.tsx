import { Modal } from "react-bootstrap/";
import { Button } from "..";
import { useTypedSelector } from "../../hooks/rtk-hooks";
import "./modal.scss";
import { IEditUploadModalProps, IUploadDataEdit } from "../../config/types";

const EditUploadModal = (props: IEditUploadModalProps) => {
  const { isLoading } = useTypedSelector((state) => state.upload);
  let buttonSaveText: string = "Save";
  let buttonCancelText: string = "Cancel";
  let buttonType: string = "add";
  let buttonVariant: string = "dark";

  return (
    <Modal
      onHide={props.onHide}
      show={props.show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dialogClassName="edit-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Edit</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <label htmlFor="edit-description">File Description</label>
        <input
          defaultValue={props?.data?.uploadToEditData?.label as string}
          type="text"
          name="edit-description"
          id="edit-description"
          placeholder="Enter updated upload name"
          onChange={(e) =>
            props.setLabel((prevState: IUploadDataEdit) => ({
              ...prevState,
              label: e.target.value,
            }))
          }
        />
      </Modal.Body>
      <Modal.Footer>
        <div className="empty" />
        <div className="button-container">
          <Button
            type={buttonType}
            variant={buttonVariant}
            text={buttonSaveText}
            bold
            click={props.edit}
            loading={isLoading}
          />
          <Button
            type={buttonType}
            variant={buttonVariant}
            text={buttonCancelText}
            bold
            click={props.onHide}
          />
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default EditUploadModal;
