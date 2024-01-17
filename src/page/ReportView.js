import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../css/ReportView.css";
function ReportView() {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState({ title: "dsds", content: "dsdsds" });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get(`/report/${reportId}`);
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
      .delete("/book", {
        params: {
          reportId: reportId,
        },
      })
      .then((response) => {
        window.alert("삭제 완료.");
        navigate(-1);
      })
      .catch((error) => {
        console.error("세션 데이터를 가져오는데 실패함", error);
      });
  };
  return (
    <div className="reportView">
      <div className="rvimgWrap">
        <img src="https://www.google.co.kr/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"></img>
      </div>
      <div className="rvReportWrap">
        <span>제목</span>
        <div className="rvtitleWrap">{report.title}</div>
        <span>독서록</span>
        <div className="rvcommentWrap">{report.content}</div>
        <div className="rvbtnWrap">
          <button onClick={handleCancel}>뒤로가기</button>
          <button onClick={handleUpdateReport}>수정 하기</button>
          <button onClick={handleDeleteReport}>삭제</button>
        </div>
      </div>
    </div>
  );
}
export default ReportView;
