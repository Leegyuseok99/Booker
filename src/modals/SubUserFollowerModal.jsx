import Modal from "react-modal";
import styles from "../css/modal/SubUserFollowerModal.module.css";

function FollowerModal({ isOpen, onCancle, followerList }) {
  const onCanclehandle = () => {
    onCancle();
  };
  return (
    <Modal
      className={styles["Follower-content"]}
      overlayClassName={styles["Follower-overlay"]}
      isOpen={isOpen}
      onRequestClose={onCanclehandle}
    >
      <div className={styles.ListTitle}>팔로워</div>
      <div className={styles.followerListWrap}>
        {followerList.map((follower) => (
          <div key={follower.nickname} className={styles.followerWrap}>
            <span>{follower.intro}</span>
            <span>{follower.nickname}</span>
          </div>
        ))}
      </div>
    </Modal>
  );
}
export default FollowerModal;
