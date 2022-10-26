import React from "react";
import { Modal } from "react-bootstrap/";
// import { useParams } from "react-router-dom";
import { Button } from "..";
import img from "../../assets/delete-image.PNG";
import { IDeleteModalProps } from "../../config/types";
import { useTypedSelector } from "../../hooks/rtk-hooks";
import "./modal.scss";

const DeleteModal = (props: IDeleteModalProps) => {
  const { user, upload } = useTypedSelector((state) => state);
  // const currentUpload = useParams();
  let buttonDeleteText: string = "ok";
  let buttonCancelText: string = "Cancel";
  let buttonType: string = "delete";

  // const handleRemoveShare = async () => {
  //     dispatch(unShareUploadStart());
  //     const data = {
  //         uploadId: currentUpload.id,
  //         userId: props.data._id
  //     };
  //     try {
  //         await unshareUploadToUser(data);
  //         dispatch(unShareUploadSuccess(data));
  //         props.onHide();
  //     } catch (error) {
  //         dispatch(unShareUploadFailed());
  //         toast.error(error.response.data.message);
  //     }
  // };

  return (
    <Modal
      onHide={props.onHide}
      show={props.show}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dialogClassName="delete-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props?.data?.type === "uploadsTable" && "Confirm File Deletion"}
          {props?.data?.type === "usersTable" && "Confirm User Deletion"}
          {props?.data?.type === "sharedUploadTable" && "Confirm From Web Page"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img src={img} alt="question-mark" />
        <p>Are you Sure?</p>
      </Modal.Body>
      <Modal.Footer>
        {props?.data?.type === "usersTable" && (
          <Button
            type={buttonType}
            text={buttonDeleteText}
            click={props.delete}
            loading={user.isLoading}
          />
        )}
        {props?.data?.type === "uploadsTable" && (
          <Button
            type={buttonType}
            text={buttonDeleteText}
            click={props.delete}
            loading={upload.isLoading}
          />
        )}
        {/* {props.data.type === "sharedUploadTable" && (
          <Button
            type={buttonType}
            text={buttonDeleteText}
            // click={handleRemoveShare}
            // loading={uploadState.loading}
          />
        )} */}
        <Button
          type={buttonType}
          text={buttonCancelText}
          click={props.onHide}
        />
      </Modal.Footer>
    </Modal>
  );
};

export default React.memo(DeleteModal);
