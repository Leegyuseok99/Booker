import Modal from "react-modal";
import styles from "../css/modal/LogoutModal.module.css";

function LogoutModal({ isOpen, onSubmit, onCancle }) {
  const onSubmithandle = () => {
    onSubmit();
  };
  const onCanclehandle = () => {
    onCancle();
  };
  return (
    <Modal
      className={styles["Logout-content"]}
      overlayClassName={styles["Logout-overlay"]}
      isOpen={isOpen}
    >
      <div className={styles.contentText}>
        <span>로그아웃 하시겠습니까?</span>
      </div>
      <div className={styles.btnWrap}>
        <button className={styles.ok_btn} onClick={onSubmithandle}>
          확인
        </button>
        <button className={styles.cancle_btn} onClick={onCanclehandle}>
          취소
        </button>
      </div>
    </Modal>
  );
}
export default LogoutModal;
