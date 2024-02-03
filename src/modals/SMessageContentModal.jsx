import Modal from "react-modal";
import axios from "axios";
import styles from "../css/modal/SMessageContentModal.module.css";
import { useState } from "react";
import { useEffect } from "react";

function SMessageContentModal({ isOpen, onCancle, messageId }) {
  const accessToken = localStorage.getItem("accesstoken");
  const [message, setMessage] = useState([]);
  const [imageSrc, setImageSrc] = useState("");
  const messageContent = async () => {
    await axios
      .get("/api/sent/message/content", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          messageId: messageId,
        },
      })
      .then((response) => {
        setImageSrc(response.data.imgURL);
        setMessage(response.data);
      });
  };
  useEffect(() => {
    if (messageId) {
      messageContent();
    }
  }, [messageId]);
  const onCanclehandle = () => {
    onCancle();
  };

  return (
    <Modal
      className={styles["MC-content"]}
      overlayClassName={styles["MC-overlay"]}
      isOpen={isOpen}
      onClose={onCanclehandle}
    >
      <div>
        {message ? (
          <div>
            <div className={styles.other}>
              <h2>쪽지 내용</h2>
              <div className={styles.close} onClick={onCanclehandle}>
                <h3>X</h3>
              </div>
            </div>
            <div className={styles.messageWrap}>
              <div className={styles.userInfoWrap}>
                <div className={styles.profileWrap}>
                  <img src={imageSrc}></img>
                </div>
                <div className={styles.nicknameWrap}>{message.nickname}</div>
              </div>
              <div className={styles.showWrap}>
                <div className={styles.titleWrap}>{message.title}</div>
                <div className={styles.contentWrap}>{message.content}</div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </Modal>
  );
}
export default SMessageContentModal;
