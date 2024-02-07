import Modal from "react-modal";
import styles from "../css/modal/MessageSendModal.module.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import refreshTokenFunc from "../component/Token/RefreshTokenFunc";

function MessageSendModal({
  isOpen,
  onSubmit,
  onCancle,
  profileId,
  profileImg,
  nickname,
}) {
  let accessToken = localStorage.getItem("accesstoken");
  const navigate = useNavigate();
  async function fetchDataOnSubmithandle() {
    accessToken = await refreshTokenFunc(navigate);
    onSubmithandle();
  }
  const onSubmithandle = () => {
    axios
      .post(
        "/api/message",
        {
          recipientId: profileId,
          title: title,
          content: content,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        window.alert("발신 완료");
      })
      .catch((error) => {
        console.log(error);
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          fetchDataOnSubmithandle();
        }
      });
    onSubmit();
  };
  const onCanclehandle = () => {
    onCancle();
  };
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleContent = (e) => {
    setContent(e.target.value);
  };
  return (
    <Modal
      className={styles["Send-content"]}
      overlayClassName={styles["Send-overlay"]}
      isOpen={isOpen}
      onClose={onCanclehandle}
    >
      <div className={styles.msm}>
        <div className={styles.msmUser}>
          <div className={styles.msmprofileImgWrap}>
            <img className={styles.msmprofileImg} src={profileImg}></img>
          </div>
          <div className={styles.msmNicknameWrap}>{nickname} 님</div>
        </div>
        <div className={styles.msmTitleInputWrap}>
          <span>제목</span>
          <input
            type="text"
            placeholder="제목을 입력해주세요"
            onChange={handleTitle}
          ></input>
        </div>
        <div className={styles.msmContentInputWrap}>
          <span>내용</span>
          <textarea
            cols="30"
            rows="10"
            type="text"
            placeholder="내용을 입력해주세요"
            onChange={handleContent}
          ></textarea>
        </div>
        <div className={styles.btnWrap}>
          <button onClick={onCanclehandle}>전송 취소</button>
          <button onClick={onSubmithandle}>쪽지 전송</button>
        </div>
      </div>
    </Modal>
  );
}
export default MessageSendModal;
