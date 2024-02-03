import React from "react";
import axios from "axios";
import styles from "../css/modal/SentMessage.module.css";

function SentMessage(props) {
  const accessToken = localStorage.getItem("accesstoken");
  const messsageDelete = () => {
    axios.delete("/api/message", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  };
  return (
    <div className={styles.sentmessageWrap}>
      <div className={styles.profileImgWrap}>
        <img src={props.imgFileDto}></img>
      </div>
      <div className={styles.messageWrap}>
        <div className={styles.nicknameWrap}>{props.nickname}</div>
        <div className={styles.titleWrap}>{props.title}</div>
      </div>
      <div className={styles.otherWrap}>
        <button onClick={messsageDelete}>삭제</button>
        <div className={styles.date}>{props.redate}</div>
      </div>
    </div>
  );
}
export default SentMessage;
