import React from "react";
import { useRef, useState, useEffect } from "react";
import "../css/ReportUpdate.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import CreateIcon from "@mui/icons-material/Create";
function ReportUpdate() {
  const { reportId } = useParams();
  const accessToken = localStorage.getItem("accesstoken");
  const navigate = useNavigate();
  const [reportData, setReportData] = useState({
    image: "",
    title: "",
    content: "",
    radioStatus: "",
    defaultImg: false,
  });
  const [imageSrc, setImageSrc] = useState();
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const response = await axios.get(`/api/report`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            reportId: reportId,
          },
        });
        setImageSrc(response.data.imgURL);
        const { title, content, sharing } = response.data;
        setReportData({
          ...reportData,
          title,
          content,
          radioStatus: sharing || "PUBLIC",
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
      setImage(null); //Image
      setPreviewImage(null);
      return;
    }
  };
  const handleButtonClick = () => {
    fileInput.current.click();
    setIsDefaultImage(false);
  };

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
  const handleImageReset = () => {
    setIsDefaultImage(true);
    setReportData({
      ...reportData,
      defaultImg: true,
      image: null,
    });
    setPreviewImage(null);
  };
  const [isDefaultImage, setIsDefaultImage] = useState(false);

  const handleUpdateReport = async (e) => {
    console.log("reportData=", reportData);
    console.log("previewImage", previewImage);
    const formData = new FormData();
    formData.append("reportId", reportId);
    formData.append("title", reportData.title);
    formData.append("content", reportData.content);
    formData.append("sharing", reportData.radioStatus);
    formData.append("defaultImg", reportData.defaultImg);
    if (reportData.defaultImg === false) {
      if (previewImage !== null) {
        formData.append("imageFile", Image);
      }
    }
    await axios
      .patch("/api/report", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        window.alert("독후감 수정 완료");
        navigate(`/reportview${reportId}`);
      });
  };
  return (
    <div className="reportUpdate">
      <div className="ruimgWrap">
        {isDefaultImage ? (
          <span>기본 이미지로 설정</span>
        ) : (
          <img
            src={previewImage ? previewImage : imageSrc}
            alt="img"
            onClick={handleButtonClick}
          />
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
          <button className="rufile_btn" onClick={handleImageReset}>
            기본 이미지 설정
          </button>
          <div className="rupublic_radio">
            공개 여부
            <label>
              <input
                type="radio"
                value="PUBLIC"
                checked={reportData.radioStatus === "PUBLIC"}
                onChange={handleRadioChange}
              />
              Public
            </label>
            <label>
              <input
                type="radio"
                value="PRIVATE"
                checked={reportData.radioStatus === "PRIVATE"}
                onChange={handleRadioChange}
              />
              Private
            </label>
          </div>
        </div>
        <span>
          <CreateIcon style={{ marginBottom: "-3px" }}></CreateIcon>제목
        </span>
        <div className="rutitleWrap">
          <input
            className="input"
            value={reportData.title}
            type="text"
            placeholder="제목을 입력해주세요"
            onChange={handleTitle}
          ></input>
        </div>
        <span>
          <CreateIcon style={{ marginBottom: "-3px" }}></CreateIcon>독서록
        </span>
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
