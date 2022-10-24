import React, { useCallback } from "react";
import { Modal } from "react-bootstrap/";
// import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button } from "..";
import img from "../../assets/delete-image.PNG";
import { IModalProps, IRowData } from "../../config/types";
import { deleteOneUserById } from "../../features/user/userSlice";
import { useTypedDispatch } from "../../hooks/rtk-hooks";
import "./modal.scss";

const DeleteModal = (props: IModalProps) => {
  // const userState = useSelector(state => state.user);
  // const uploadState = useSelector(state => state.upload);
  // const { isLoading, users } = useTypedSelector((state) => state.user);
  const dispatch = useTypedDispatch();
  // const currentUpload = useParams();
  let buttonDeleteText: string = "ok";
  let buttonCancelText: string = "Cancel";
  let buttonType: string = "delete";
  const rowData: IRowData = props.data as IRowData;

  const handleDeleteUser = useCallback(async () => {
    try {
      dispatch(deleteOneUserById(rowData.item.id));
      props.onHide();
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }, [props, rowData?.item?.id, dispatch]);

  // const handleDeleteUpload = async () => {
  //     dispatch(deleteUploadStart());
  //     try {
  //         await deleteUploadById(props.data._id);
  //         dispatch(deleteUploadSuccess(props.data._id));
  //         props.onHide();
  //     } catch (error) {
  //         dispatch(deleteUploadFailed());
  //         toast.error(error.response.data.message);
  //     }
  // };

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
      {...props}
      size="sm"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      dialogClassName="delete-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {props?.data?.type === "upload"
            ? "Confirm File Deletion"
            : props?.data?.type === "user"
            ? "Confirm User Deletion"
            : "Confirm From Web Page"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img src={img} alt="question-mark" />
        <p>Are you Sure?</p>
      </Modal.Body>
      <Modal.Footer>
        {props?.data?.type === "user" && (
          <Button
            type={buttonType}
            text={buttonDeleteText}
            click={handleDeleteUser}
            // loading={userState.loading}
          />
        )}
        {/* {props.data.type === "upload" && (
          <Button
            type={buttonType}
            text={buttonDeleteText}
            // click={handleDeleteUpload}
            // loading={uploadState.loading}
          />
        )}
        {props.data.type === "share" && (
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
