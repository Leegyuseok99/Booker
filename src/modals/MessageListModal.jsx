import Modal from "react-modal";
import styles from "../css/modal/MessageListModal.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import ReceivedMessage from "../component/ReceivedMessage";
import SentMessage from "../component/SentMessage";
import RMessageContentModal from "./RMessageContentModal";
import SMessageContentModal from "./SMessageContentModal";
import refreshTokenFunc from "../component/Token/RefreshTokenFunc";

function MessageListModal({ isOpen, onCancle, messages }) {
  const accessToken = localStorage.getItem("accesstoken");
  const [imageSrc, setImageSrc] = useState("");
  const [sentMessageList, setSentMessageList] = useState([]);
  const [receivedMessageList, setReceivedMessageList] = useState([]);
  const [selectedContent, setSelectedContent] = useState("received");
  const navigate = useNavigate();
  useEffect(() => {
    showReceivedContent();
  }, []);
  const showReceivedContent = () => {
    setSelectedContent("received");
    const receivedMessage = () => {
      axios
        .get("/received/message", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          const messages = response.data.messageList.map((message) => ({
            messageId: message.messageId,
            title: message.title,
            state: message.state,
            redate: message.redate,
            nickname: message.nickname,
            image: `data:${message.imgFileDto.mimeType};base64, ${message.imgFileDto.base64Image}`,
          }));
          setReceivedMessageList(messages);
        })
        .catch((error) => {
          const tokenErr = error.response.data.code;
          if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
            navigate("/login");
          } else if (tokenErr === "JwtTokenExpired") {
            refreshTokenFunc(navigate);
          }
        });
    };
    receivedMessage();
  };

  const showSentContent = () => {
    setSelectedContent("sent");
    const sentMessage = () => {
      axios
        .get("/sent/message", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then((response) => {
          const messages = response.data.messageList.map((message) => ({
            messageId: message.messageId,
            title: message.title,
            state: message.state,
            redate: message.redate,
            nickname: message.nickname,
            image: `data:${message.imgFileDto.mimeType};base64, ${message.imgFileDto.base64Image}`,
          }));
          setSentMessageList(messages);
        })
        .catch((error) => {
          const tokenErr = error.response.data.code;
          if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
            navigate("/login");
          } else if (tokenErr === "JwtTokenExpired") {
            refreshTokenFunc(navigate);
          }
        });
    };
    sentMessage();
  };
  const onCanclehandle = () => {
    setSelectedContent("received");
    onCancle();
  };
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isOpen1, setIsOpen1] = useState(false);

  const handleReceivedMessageClick = (messageId) => {
    const selected = receivedMessageList.find(
      (message) => message.messageId === messageId
    );
    setSelectedMessage(selected);
    setIsOpen1(true);
  };

  const handleModalCancel = () => {
    setSelectedMessage(null);
    setIsOpen1(false);
  };

  const [isOpen2, setIsOpen2] = useState(false);
  const handleSentMessageClick = (messageId) => {
    const selected = sentMessageList.find(
      (message) => message.messageId === messageId
    );
    setSelectedMessage(selected);
    setIsOpen2(true);
  };

  const handleModalCancel2 = () => {
    setSelectedMessage(null);
    setIsOpen2(false);
  };
  return (
    <Modal
      className={styles["MList-content"]}
      overlayClassName={styles["MList-overlay"]}
      isOpen={isOpen}
      onClose={onCancle}
    >
      <div>
        <div className={styles.clickWrap}>
          <div className={styles.btnWrap}>
            <button onClick={showReceivedContent}>받은 쪽지</button>
            <button onClick={showSentContent}>보낸 쪽지</button>
          </div>
          <h3 className={styles.close} onClick={onCanclehandle}>
            X
          </h3>
        </div>
        {selectedContent === "received" ? (
          <div>
            <h2>받은 쪽지</h2>
            {receivedMessageList.map((message, i) => (
              <div
                className={styles.receivedMessageList}
                onClick={() => handleReceivedMessageClick(message.messageId)}
                key={i}
              >
                <ReceivedMessage
                  key={i}
                  messageId={message.messageId}
                  title={message.title}
                  state={message.state}
                  redate={message.redate}
                  nickname={message.nickname}
                  imgFileDto={message.image}
                ></ReceivedMessage>
              </div>
            ))}
            <RMessageContentModal
              isOpen={isOpen1}
              onCancle={handleModalCancel}
              messageId={selectedMessage ? selectedMessage.messageId : null}
            ></RMessageContentModal>
          </div>
        ) : (
          <div>
            <div>
              <h2>보낸 쪽지</h2>
              {sentMessageList.map((message, i) => (
                <div
                  className={styles.receivedMessageList}
                  onClick={() => handleSentMessageClick(message.messageId)}
                  key={i}
                >
                  <SentMessage
                    key={i}
                    messageId={message.messageId}
                    title={message.title}
                    state={message.state}
                    redate={message.redate}
                    nickname={message.nickname}
                    imgFileDto={message.image}
                  ></SentMessage>
                </div>
              ))}
              <SMessageContentModal
                isOpen={isOpen2}
                onCancle={handleModalCancel2}
                messageId={selectedMessage ? selectedMessage.messageId : null}
              ></SMessageContentModal>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

export default MessageListModal;
