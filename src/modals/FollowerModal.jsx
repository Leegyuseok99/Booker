import Modal from "react-modal";
import styles from "../css/modal/FollowerModal.module.css";
import { useNavigate } from "react-router-dom";

function FollowerModal({ isOpen, onCancle, followerList }) {
  const navigate = useNavigate();
  const onCanclehandle = () => {
    onCancle();
  };
  const stopPropagation = (e) => {
    e.stopPropagation();
  };
  const nickname = localStorage.getItem("nickname");
  return (
    <Modal
      className={styles["Follower-content"]}
      overlayClassName={styles["Follower-overlay"]}
      isOpen={isOpen}
      onRequestClose={(e) => {
        onCanclehandle();
        stopPropagation(e);
      }}
      shouldCloseOnOverlayClick={true}
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
            <div className={styles.imgWrap}>
              <img src={follower.imgURL}></img>
            </div>
            <div className={styles.infoWrap}>
              <span>{follower.nickname}</span>
              <span>{follower.intro}</span>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
export default FollowerModal;
