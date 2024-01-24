import Modal from "react-modal";
import styles from "../css/modal/MessageListModal.module.css";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function MessageListModal({ isOpen, onCancle }) {
  const [selectedContent, setSelectedContent] = useState("received");

  const showReceivedContent = () => {
    setSelectedContent("received");
  };

  const showSentContent = () => {
    setSelectedContent("sent");
  };

  return (
    <Modal
      className={styles["MList-content"]}
      overlayClassName={styles["MList-overlay"]}
      isOpen={isOpen}
      onClose={onCancle}
    >
      <div>
        {selectedContent === "received" ? (
          <div>
            <h2>받은 쪽지</h2>
          </div>
        ) : (
          <div>
            <h2>보낸 쪽지</h2>
          </div>
        )}

        <button onClick={showReceivedContent}>받은 쪽지</button>
        <button onClick={showSentContent}>보낸 쪽지</button>
      </div>
    </Modal>
  );
}

export default MessageListModal;
