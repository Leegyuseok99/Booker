import React from "react";
import axios from "axios";
import styles from "../css/modal/SentMessage.module.css";
import refreshTokenFunc from "../component/Token/RefreshTokenFunc";
import { useNavigate } from "react-router-dom";

function SentMessage(props) {
  const accessToken = localStorage.getItem("accesstoken");
  const navigate = useNavigate();
  const messsageDelete = () => {
    axios
      .delete("/message", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
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
