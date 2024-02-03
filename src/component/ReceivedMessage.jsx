import React from "react";
import axios from "axios";
import styles from "../css/modal/ReceivedMessage.module.css";

function ReceivedMessage(props) {
  const accessToken = localStorage.getItem("accesstoken");
  const messsageDelete = () => {
    axios.delete("/api/message", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        messageId: props.messageId,
      },
    });
  };
  return (
    <div className={styles.receivedmessageWrap}>
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
export default ReceivedMessage;
