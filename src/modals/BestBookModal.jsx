import Modal from "react-modal";
import { useState, useEffect } from "react";
import styles from "../css/modal/BestBookModal.module.css";
import { style } from "@mui/system";
import { useNavigate } from "react-router-dom";

function BookeModal({ isOpen, selectedBook, onSubmit, onCancle }) {
  const navigate = useNavigate();

  const [selected, setSelected] = useState("");
  const [selectedBooks, setSelectedBooks] = useState({});

  useEffect(() => {
    // 책이 전환될 때 선택 상태를 갱신
    setSelected(selectedBooks[selectedBook.isbn13] || "");
  }, [selectedBook, selectedBooks]);

  const onSubmithandle = () => {
    onSubmit(selectedBook.isbn13, selected);
    // 선택한 책의 선택 상태를 업데이트
    setSelectedBooks({
      ...selectedBooks,
      [selectedBook.isbn13]: selected,
    });
  };
  const onCanclehandle = () => {
    onCancle();
  };
  const selectList = [
    "읽기 전",
    "읽고 싶은 책",
    "읽는 중",
    "독서 완료",
    "책 삭제하기",
  ];
  const errorhandle = (e) => {
    window.alert("로그인 후 이용가능 한 서비스 입니다.");
    navigate("/login");
  };
  const selecthandle = (e) => {
    setSelected(e.target.value);
    selectedBooks[selectedBook.isbn13] = e.target.value;
  };

  const [isIntroductionVisible, setIsIntroductionVisible] = useState(true);

  const toggleIntroduction = () => {
    setIsIntroductionVisible(!isIntroductionVisible);
  };
  return (
    <Modal
      className={styles["Book-content"]}
      overlayClassName={styles["Book-overlay"]}
      isOpen={isOpen}
    >
      <div className={styles.bookModal}>
        <div className={styles.left}>
          <div className={styles.leftUp}>
            <div className={styles.bmImgWrap}>
              <img
                src={selectedBook.cover}
                alt={selectedBook.title}
                className={styles.bmImg}
              />
            </div>
            <div className={styles.leftUpLeft}>
              <div className={styles.bmTitle}>{selectedBook.title}</div>
              <div className={styles.bmauthor}>저자 글쓴이 책 발행 년도</div>
              <div>
                <select
                  onChange={errorhandle}
                  value={selected}
                  className={styles.select}
                >
                  {selectList.map((item) => (
                    <option value={item} key={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          <div className={styles.leftDown}>
            <div className={styles.bmCategoryWrap}>카테고리</div>
            <div className={styles.bmCategory}>{selectedBook.category}</div>
            <div>
              <span className={styles.bmIntroWrap} onClick={toggleIntroduction}>
                책 소개 {isIntroductionVisible ? ">" : "<"}
              </span>
              <div className={styles.bmintro}>
                {isIntroductionVisible && selectedBook.introduction}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.rightWrap}>
          <div className={styles.right}>
            <div className={styles.reportTitle}>남긴 감상평</div>
            <div className={styles.reportBtnWrap}>
              <button className={styles.reportAdd_btn} onClick={errorhandle}>
                독서록 추가
              </button>
            </div>
          </div>
          <div className={styles.btnWrap}>
            <button className={styles.ok_btn} onClick={onSubmithandle}>
              확인
            </button>
            <button className={styles.cancle_btn} onClick={onCanclehandle}>
              취소
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default BookeModal;
