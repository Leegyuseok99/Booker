import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/BookInfo.css";
import { useParams } from "react-router-dom";
import FolderIcon from "@mui/icons-material/Folder";
import EditNoteIcon from "@mui/icons-material/EditNote";
function BookInfo({ selectedBook, onSubmit }) {
  const { isbn13, bookId } = useParams();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accesstoken");
  const [bookData, setBookData] = useState([]);
  const bookInfo = async () => {
    await axios
      .get(`/book`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          ISBN13: isbn13,
        },
      })
      .then((response) => {
        setBookData(response.data);
      });
  };
  useEffect(() => {
    bookInfo();
  }, []);

  // 책 존재 여부 확인(셀렉트 박스, 책 추가 버튼)
  const [exsit, setExsit] = useState("false");
  const bookExist = async () => {
    await axios
      .get("/book/newbook", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          isbn13: isbn13,
        },
      })
      .then((response) => {
        setExsit(response.data.exsit);
      });
  };
  useEffect(() => {
    bookExist();
  }, []);

  //책 추가 버튼
  const existhandle = () => {
    navigate("/mybook");
  };

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
  const [reportList, setReportList] = useState([]);

  const getReport = async () => {
    await axios
      .get(`/book/progress/reports`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          bookId: bookId,
        },
      })
      .then((response) => {
        console.log(response.data);
        setReportList(response.data.simpleReports);
      });
  };
  const renderReportList = () => {
    if (reportList.length === 0) {
      return <div>독후감이 없습니다.</div>;
    }

    return (
      <div className="reportWrap">
        {reportList.map((report) => (
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
  useEffect(() => {
    getReport();
  }, []);
  const handleReportClick = (reportId) => {
    navigate(`/reportview/${reportId}`);
  };
  const addReporthandle = () => {
    navigate(`/addreport/${bookId}`);
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
              <div className="infoTitle">{bookData.title}</div>
              <div className="infoauthor">저자 글쓴이 책 발행 년도</div>
              <div>
                {exsit === "false" ? (
                  <button onClick={existhandle}>책 추가</button>
                ) : (
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
                )}
              </div>
            </div>
          </div>
          <div className="leftDown">
            <div className="infoCategoryWrap">
              <FolderIcon style={{ marginBottom: "-5px" }}></FolderIcon>카테고리
            </div>
            <div className="infoCategory">{selectedBook?.category}</div>
            <div>
              <span className="infoIntroWrap" onClick={toggleIntroduction}>
                <span className="introIcon">
                  {isIntroductionVisible ? ">" : "∧"}
                </span>{" "}
                책 소개
              </span>
              {isIntroductionVisible && (
                <div className="infointro">{selectedBook?.introduction}</div>
              )}
            </div>
          </div>
        </div>
        <div className="rightWrap">
          <div className="right">
            <div className="reportTitle">
              <EditNoteIcon
                style={{ marginBottom: "-9px", fontSize: "xx-large" }}
              ></EditNoteIcon>
              남긴 감상평
            </div>
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
