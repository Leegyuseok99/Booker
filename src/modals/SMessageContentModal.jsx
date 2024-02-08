import Modal from "react-modal";
import axios from "axios";
import styles from "../css/modal/SMessageContentModal.module.css";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import refreshTokenFunc from "../component/Token/RefreshTokenFunc";

function SMessageContentModal({ isOpen, onCancle, onCancle3, messageId }) {
  let accessToken = localStorage.getItem("accesstoken");
  const [message, setMessage] = useState([]);
  const [imageSrc, setImageSrc] = useState("");
  const navigate = useNavigate();
  async function fetchDataMessageContent() {
    accessToken = await refreshTokenFunc(navigate);
    messageContent();
  }
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
      })
      .catch((error) => {
        console.log(error);
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          fetchDataMessageContent();
        }
      });
  };
  async function fetchDataMessageDelete() {
    accessToken = await refreshTokenFunc(navigate);
    messageDelete();
  }
  const messageDelete = () => {
    axios
      .delete("/api/message", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          messageId: messageId,
        },
      })
      .then(() => {
        window.alert("삭제 완료");
        onCancle();
        onCancle3();
      })
      .catch((error) => {
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          fetchDataMessageDelete();
        }
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
              <div className={styles.deletebtnWrap}>
                <button onClick={messageDelete}>삭제</button>
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
