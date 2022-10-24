import { FC, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { Button } from "../components";
import { ISendMessage } from "../config/types";
import { fetchAllMessage, sendChatMessage } from "../features/chat/chatSlice";
import { fetchCurrentLoggedUser } from "../features/user/userSlice";
import { useTypedDispatch, useTypedSelector } from "../hooks/rtk-hooks";
import classes from "../styles/group-chat.module.scss";
import { getMessageDate } from "../utils/helpers";

const GroupChat: FC = () => {
  const { chats, isLoading } = useTypedSelector((state) => state.chat);
  const { currentUser } = useTypedSelector((state) => state.user);
  const dispatch = useTypedDispatch();
  const [message, setMessage] = useState<string>("");
  const [refresh, setRefresh] = useState<boolean>(false);
  const scrollRef = useRef<null | HTMLDivElement>(null);
  let buttonType: string = "unstyled";
  let buttonTextSend: string = "Send";
  let buttonTextRefresh: string = "Refresh";

  useEffect(() => {
    const fetch = async () => {
      try {
        dispatch(fetchCurrentLoggedUser());
        dispatch(fetchAllMessage());
      } catch (error: any) {
        toast.error(error.response.data.message);
      }
    };
    fetch();
  }, [dispatch, refresh]);

  const scrollToBottom = () => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [chats]);

  const handleSendMessage = useCallback(async () => {
    const date = getMessageDate();
    if (message.trim() === "") return toast.warn("Message is required");

    const messageData: ISendMessage = {
      sender_id: currentUser?.id,
      message,
      time: date,
    };
    try {
      dispatch(sendChatMessage(messageData));
      setMessage("");
      dispatch(fetchAllMessage());
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }, [currentUser.id, message, dispatch]);

  return (
    <div className={classes.container}>
      <div className={classes.gcHeader}>
        <h5>Group Chat</h5>
        <button
          type="button"
          className={classes.btnClose}
          aria-label="Close"
        ></button>
      </div>
      <div className={classes.gcBody}>
        {chats?.map((message) => {
          return (
            <p key={message?.id}>
              [{message?.time}] {message?.user?.name} : {message?.message}
            </p>
          );
        })}
        <div ref={scrollRef} />
      </div>
      <div className={classes.gcFooter}>
        <label htmlFor="message">{currentUser?.name}</label>
        <input
          type="text"
          name="message"
          value={message}
          placeholder="I am good"
          onChange={(e) => setMessage(e.target.value)}
        />
        <div className={classes.actions}>
          <Button
            type={buttonType}
            text={buttonTextSend}
            loading={isLoading}
            bold
            click={handleSendMessage}
          />
          <Button
            type={buttonType}
            text={buttonTextRefresh}
            bold
            click={() => {
              setRefresh(!refresh);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default GroupChat;
