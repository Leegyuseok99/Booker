import React from "react";
import { useRef, useState, useEffect } from "react";
import "../css/ReportUpdate.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

function ReportUpdate() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [reportData, setReportData] = useState({
    image: "",
    title: "",
    content: "",
    radioStatus: "public",
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axios.get(`/report/${reportId}`);
        const { image, title, content, sharing } = response.data;
        setReportData({
          image,
          title,
          content,
          radioStatus: sharing || "public",
        });
      } catch (error) {
        console.error(error);
      }
    };
    fetchReportData();
  }, [reportId]);

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
    setReportData({
      ...reportData,
      radioStatus: e.target.value,
    });
  };

  const handleTitle = (e) => {
    setReportData({
      ...reportData,
      title: e.target.value,
    });
  };
  const handleComment = (e) => {
    setReportData({
      ...reportData,
      content: e.target.value,
    });
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleUpdateReport = async (e) => {
    const formData = new FormData();
    formData.append("reportId", reportId);
    formData.append("imageFile", reportData.image);
    formData.append("title", reportData.title);
    formData.append("content", reportData.content);
    formData.append("sharing", reportData.radioStatus);
    await axios.post("/report", formData).then((response) => {
      window.alert("독후감 수정 완료");
      navigate(`/reportview${reportId}`);
    });
  };
  return (
    <div className="reportUpdate">
      <div className="ruimgWrap">
        <img
          src={previewImage || Image}
          img="img"
          onClick={handleButtonClick}
        />
        {!reportData.image && !reportData.previewImage && (
          <span>이미지 등록해주세요</span>
        )}
        <input
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={onChange}
          ref={fileInput}
        />
      </div>
      <div className="updateReportWrap">
        <div className="ruInputImg">
          <button className="rufile_btn" onClick={handleButtonClick}>
            파일 선택
          </button>
          <div className="rupublic_radio">
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
        <div className="rutitleWrap">
          <input
            className="input"
            value={reportData.title}
            type="text"
            placeholder="제목을 입력해주세요"
            onChange={handleTitle}
          ></input>
        </div>
        <span>독서록</span>
        <div className="rucommentWrap">
          <textarea
            cols="30"
            rows="10"
            className="input"
            value={reportData.content}
            type="text"
            placeholder="내용을 입력해주세요"
            onChange={handleComment}
          ></textarea>
        </div>
        <div className="rubtnWrap">
          <button onClick={handleCancel}>작성 취소</button>
          <button onClick={handleUpdateReport}>수정 완료</button>
        </div>
      </div>
    </div>
  );
}
export default ReportUpdate;
