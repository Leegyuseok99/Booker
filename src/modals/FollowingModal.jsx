import Modal from "react-modal";
import styles from "../css/modal/FollowingModal.module.css";

function FollowingModal({ isOpen, onCancle, followingList }) {
  const onCanclehandle = () => {
    onCancle();
  };
  return (
    <Modal
      className={styles["Following-content"]}
      overlayClassName={styles["Following-overlay"]}
      isOpen={isOpen}
      onRequestClose={onCanclehandle}
    >
      <div className={styles.ListTitle}>팔로잉</div>
      <div className={styles.followingListWrap}>
        {followingList.map((following) => (
          <div key={following.nickname} className={styles.followingWrap}>
            <span>{following.intro}</span>
            <span>{following.nickname}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}
export default FollowingModal;
