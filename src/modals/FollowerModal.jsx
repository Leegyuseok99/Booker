import Modal from "react-modal";
import styles from "../css/modal/FollowerModal.module.css";
import { useNavigate } from "react-router-dom";

function FollowerModal({ isOpen, onCancle, followerList }) {
  const nickname = localStorage.getItem("nickname");
  const navigate = useNavigate();
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
          <div
            key={follower.nickname}
            className={styles.followerWrap}
            onClick={() => {
              if (nickname === follower.nickname) {
                navigate("/mybook");
              } else {
                navigate(`/subuserbook/${follower.profileId}`);
                onCancle();
              }
            }}
          >
            <span>{follower.intro}</span>
            <span>{follower.nickname}</span>
            <button>삭제</button>
          </div>
        ))}
      </div>
    </Modal>
  );
}
export default FollowerModal;
