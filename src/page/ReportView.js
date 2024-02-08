import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../css/ReportView.css";
import CreateIcon from "@mui/icons-material/Create";
import refreshTokenFunc from "../component/Token/RefreshTokenFunc";

function ReportView() {
  const { reportId, bookId, isbn13, user } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState({});
  const [imageSrc, setImageSrc] = useState("");
  let accessToken = localStorage.getItem("accesstoken");

  useEffect(() => {
    async function fetchDataFetchReport() {
      accessToken = await refreshTokenFunc(navigate);
      fetchReport();
    }
    const fetchReport = async () => {
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
        setReport(response.data);
      } catch (error) {
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          fetchDataFetchReport();
        }
      }
    };

    fetchReport();
  }, [reportId]);

  //   if (!report) {
  //     return <div>Loading...</div>;
  //   }

  const handleCancel = () => {
    navigate(-1);
  };

  const handleUpdateReport = () => {
    navigate(`/reportupdate/${reportId}/${user}/${isbn13}/${bookId}`);
  };

  async function fetchDataHandleDeleteReport() {
    accessToken = await refreshTokenFunc(navigate);
    handleDeleteReport();
  }

  const handleDeleteReport = () => {
    axios
      .delete("/api/report", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          reportId: reportId,
        },
      })
      .then((response) => {
        window.alert("삭제 완료.");
        navigate(`/bookinfo/${isbn13}/${bookId}`);
      })
      .catch((error) => {
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          fetchDataHandleDeleteReport();
        }
      });
  };
  return (
    <div className="reportView">
      <div className="rvimgWrap">
        <img src={imageSrc}></img>
      </div>
      <div className="rvReportWrap">
        <span>
          <CreateIcon style={{ marginBottom: "-3px" }}></CreateIcon>제목
        </span>
        <div className="rvtitleWrap">{report.title}</div>
        <span>
          <CreateIcon style={{ marginBottom: "-3px" }}></CreateIcon>독서록
        </span>
        <div className="rvcommentWrap">{report.content}</div>
        <div className="rvbtnWrap">
          {user === "me" ? (
            <div>
              <button onClick={handleCancel}>뒤로가기</button>
              <button onClick={handleUpdateReport}>수정 하기</button>
              <button onClick={handleDeleteReport}>삭제</button>
            </div>
          ) : (
            <button onClick={handleCancel}>뒤로가기</button>
          )}
        </div>
      </div>
    </div>
  );
}
export default ReportView;
