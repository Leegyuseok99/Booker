import React from "react";
import axios from "axios";
import styles from "../css/modal/ReceivedMessage.module.css";
import refreshTokenFunc from "../component/Token/RefreshTokenFunc";
import { useNavigate } from "react-router-dom";

function ReceivedMessage(props) {
  let accessToken = localStorage.getItem("accesstoken");
  const navigate = useNavigate();

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
        <div className={styles.date}>{props.redate}</div>
      </div>
    </div>
  );
}
export default ReceivedMessage;
