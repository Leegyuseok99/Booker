import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../css/ReportView.css";
import CreateIcon from "@mui/icons-material/Create";
function ReportView() {
  const { reportId, user } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState({});
  const [imageSrc, setImageSrc] = useState("");
  const accessToken = localStorage.getItem("accesstoken");

  useEffect(() => {
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
        console.error(error);
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
    navigate(`/reportupdate/${reportId}`);
  };

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
        navigate(-1);
      })
      .catch((error) => {
        console.error(error.response.data);
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
          <button onClick={handleCancel}>뒤로가기</button>
          {user === "me" ? (
            <div>
              <button onClick={handleUpdateReport}>수정 하기</button>
              <button onClick={handleDeleteReport}>삭제</button>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
export default ReportView;
