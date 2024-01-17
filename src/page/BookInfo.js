import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/BookInfo.css";
import { useParams } from "react-router-dom";
function BookInfo({ selectedBook, onSubmit }) {
  const { isbn13 } = useParams();
  const navigate = useNavigate();

  const [selected, setSelected] = useState("");
  const [selectedBooks, setSelectedBooks] = useState({});

  useEffect(() => {
    // onSubmit(selectedBook.isbn13, selected);

    setSelected(selectedBooks[selectedBook?.isbn13] || "");
  }, [selectedBook, selectedBooks]);

  const onSubmithandle = () => {
    setSelectedBooks({
      ...selectedBooks,
      // [selectedBook.isbn13]: selected,
    });
    navigate("/main");
  };
  const selectList = [
    "읽기 전",
    "읽고 싶은 책",
    "읽는 중",
    "독서 완료",
    "책 삭제하기",
  ];
  const selecthandle = (e) => {
    setSelected(e.target.value);
    // selectedBooks[selectedBook.isbn13] = e.target.value;
  };

  const [isIntroductionVisible, setIsIntroductionVisible] = useState(true);

  const toggleIntroduction = () => {
    setIsIntroductionVisible(!isIntroductionVisible);
  };
  useEffect(() => {
    getReport();
  });
  const [reportList, setReportList] = useState([
    { reportId: "Uj1-KclDclr4U5T0-mtnX", title: "test", redate: "2024-01-10" },
  ]);

  async function getReport() {
    await axios.get(`/reports/${isbn13}`).then((response) => {
      setReportList(response.data);
    });
  }
  const renderReportList = () => {
    // if (!reportList.exist) {
    //   return <div>해당 책이 개인 서재에 존재하지 않습니다.</div>;
    // }

    // if (reportList.simpleReports.length === 0) {
    //   return <div>독후감이 없습니다.</div>;
    // }

    return (
      <div className="reportWrap">
        {reportList./*simpleReports.*/ map((report) => (
          <div
            key={report.reportId}
            className="report"
            onClick={() => handleReportClick(report.reportId)}
          >
            {report.title} - 작성일: {report.redate}
          </div>
        ))}
      </div>
    );
  };
  const handleReportClick = (reportId) => {
    navigate(`/reportview/${reportId}`);
  };
  const addReporthandle = () => {
    navigate("/addreport");
  };
  return (
    <div>
      <div className="bookInfo">
        <div className="left">
          <div className="leftUp">
            <div className="infoImgWrap">
              <img className="infoImg" />
            </div>
            <div className="leftUpLeft">
              <div className="infoTitle">{selectedBook?.title}</div>
              <div className="infoauthor">저자 글쓴이 책 발행 년도</div>
              <div>
                <select
                  onChange={selecthandle}
                  value={selected}
                  className="select"
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
          <div className="leftDown">
            <div className="infoCategoryWrap">카테고리</div>
            <div className="infoCategory">{selectedBook?.category}</div>
            <div>
              <span className="infoIntroWrap" onClick={toggleIntroduction}>
                책 소개 {isIntroductionVisible ? ">" : "<"}
              </span>
              {isIntroductionVisible && (
                <div className="infointro">{selectedBook?.introduction}</div>
              )}
            </div>
          </div>
        </div>
        <div className="rightWrap">
          <div className="right">
            <div className="reportTitle">남긴 감상평</div>
            {renderReportList()}
            <div className="reportBtnWrap">
              <button className="reportAdd_btn" onClick={onSubmithandle}>
                메인 페이지
              </button>
              <button className="reportAdd_btn" onClick={addReporthandle}>
                독서록 추가
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BookInfo;
