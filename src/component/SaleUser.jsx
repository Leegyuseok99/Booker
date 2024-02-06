import React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import styles from "../css/SaleUser.module.css";
import TelegramIcon from "@mui/icons-material/Telegram";
import MessageSendModal from "../modals/MessageSendModal";
function SaleUser(props) {
  const [isOpen, setOpen] = useState(false);

  const modalOpenhandle = () => {
    setOpen(true);
  };
  const handleModalSubmit = () => {
    // 모달1 비지니스 로직
    setOpen(false);
  };

  const handleModalCancel = () => {
    setOpen(false);
    console.log("close");
  };
  return (
    <div className={styles.posUserCard}>
      <div className={styles.imgWrap} onClick={props.onClick}>
        <img src={props.image}></img>
      </div>
      <div className={styles.userInfoWrap} onClick={props.onClick}>
        <div className={styles.nicknameWrap}>{props.nickname}</div>
        <div className={styles.introWrap}>{props.intro}</div>
      </div>
      <div className={styles.btnWrap}>
        <Button id={styles.submessage_btn} onClick={modalOpenhandle}>
          <TelegramIcon style={{ margin: "0px 5px -5px 0px" }}></TelegramIcon>{" "}
          쪽지 보내기
        </Button>
        <MessageSendModal
          isOpen={isOpen}
          onSubmit={handleModalSubmit}
          onCancle={handleModalCancel}
          profileId={props.profileId}
          profileImg={props.image}
          nickname={props.nickname}
        ></MessageSendModal>
      </div>
    </div>
  );
}
export default SaleUser;
