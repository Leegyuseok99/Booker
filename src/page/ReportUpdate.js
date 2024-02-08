import React from "react";
import { useRef, useState, useEffect } from "react";
import "../css/ReportUpdate.css";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import CreateIcon from "@mui/icons-material/Create";
import refreshTokenFunc from "../component/Token/RefreshTokenFunc";

function ReportUpdate() {
  const { reportId, isbn13, bookId, user } = useParams();
  let accessToken = localStorage.getItem("accesstoken");
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
    async function fetchDataFetchReportData() {
      accessToken = await refreshTokenFunc(navigate);
      fetchReportData();
    }
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
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          fetchDataFetchReportData();
        }
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
  async function fetchDataHandleUpdateReport(e) {
    accessToken = await refreshTokenFunc(navigate);
    handleUpdateReport(e);
  }

  let [title_result, setTitle_result] = useState("");
  let [content_result, setContent_result] = useState("");
  useEffect(() => {
    if (title_result != "" || content_result != "") {
      let errorMessage = title_result + "\n" + content_result;
      window.alert(errorMessage);
    }
  }, [title_result, content_result]);

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
        navigate(`/reportview/${reportId}/${user}/${isbn13}/${bookId}`);
      })
      .catch((error) => {
        const tokenErr = error.response.data.code;
        if (tokenErr != undefined) {
          if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
            navigate("/login");
          } else if (tokenErr === "JwtTokenExpired") {
            fetchDataHandleUpdateReport(e);
          }
        } else {
          setTitle_result("");
          setContent_result("");
          const errorKeys = Object.keys(error.response.data);
          const errorValues = [];
          for (const key of errorKeys) {
            errorValues.push(error.response.data[key]);
          }
          errorKeys.forEach((key, index) => {
            switch (key) {
              case "title":
                setTitle_result(errorValues[index]);
                break;
              case "content":
                setContent_result(errorValues[index]);
                break;
            }
          });
        }
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
