import React from "react";
import { useRef, useState } from "react";
import "../css/AddReport.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function AddReport() {
  const navigate = useNavigate();

  const [Image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const fileInput = useRef(null);
  const onChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      //업로드 취소할 시
      setImage(Image);
      setPreviewImage(null);
      return;
    }
  };
  const handleButtonClick = () => {
    fileInput.current.click();
  };
  const [radioStatus, setRadioStatus] = useState("public");

  const handleRadioChange = (e) => {
    setRadioStatus(e.target.value);
  };
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleAddReport = async (e) => {
    const formData = new FormData();
    formData.append("imageFile", Image);
    formData.append("title", title);
    formData.append("content", comment);
    formData.append("sharing", radioStatus);
    await axios
      .post("/report", formData)
      .then((response) => {
        window.alert("독후감 등록 완료");
        navigate("/");
      })
      .catch((error) => {
        if (error.response && error.response.data) {
          const { title, content } = error.response.data;

          if (title) {
            window.alert("제목은 30글자 이내로 작성해주세요.");
          }

          if (content) {
            window.alert("내용을 작성해주세요.");
          }
        } else {
          window.alert("독후감 등록에 실패했습니다. 다시 시도해주세요.");
        }
      });
  };
  return (
    <div className="addReport">
      <div className="imgWrap">
        <img
          src={previewImage || Image}
          img="img"
          onClick={handleButtonClick}
        />
        {!previewImage && !Image && <span>이미지 등록해주세요</span>}
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={onChange}
          ref={fileInput}
        />
      </div>
      <div className="addReportWrap">
        <div className="InputImg">
          <button className="file_btn" onClick={handleButtonClick}>
            파일 선택
          </button>
          <div className="public_radio">
            공개 여부
            <label>
              <input
                type="radio"
                value="public"
                checked={radioStatus === "public"}
                onChange={handleRadioChange}
              />
              Public
            </label>
            <label>
              <input
                type="radio"
                value="private"
                checked={radioStatus === "private"}
                onChange={handleRadioChange}
              />
              Private
            </label>
          </div>
        </div>
        <span>제목</span>
        <div className="rptitleWrap">
          <input
            className="input"
            value={title}
            type="text"
            placeholder="제목을 입력해주세요"
            onChange={handleTitle}
          ></input>
        </div>
        <span>독서록</span>
        <div className="rpcommentWrap">
          <textarea
            cols="30"
            rows="10"
            className="input"
            value={comment}
            type="text"
            placeholder="내용을 입력해주세요"
            onChange={handleComment}
          ></textarea>
        </div>
        <div className="rpbtnWrap">
          <button onClick={handleCancel}>작성 취소</button>
          <button onClick={handleAddReport}>작성 완료</button>
        </div>
      </div>
    </div>
  );
}
export default AddReport;
