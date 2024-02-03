import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/BookInfo.css";
import { useParams } from "react-router-dom";
import FolderIcon from "@mui/icons-material/Folder";
import EditNoteIcon from "@mui/icons-material/EditNote";
function BookInfo({ selectedBook, onSubmit }) {
  const { isbn13, bookId: initialBookId, otherbookstate } = useParams();
  const [bookId, setBookId] = useState(initialBookId);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accesstoken");
  const [bookData, setBookData] = useState([]);
  const [reportList, setReportList] = useState([]);
  const [progress, setProgress] = useState();
  const bookInfo = async () => {
    await axios
      .get(`/api/book`, {
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
  const [exist, setExist] = useState(false);
  const bookExist = async () => {
    if (bookId === "null") {
      await axios
        .get("/api/book/newbook", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            isbn13: isbn13,
          },
        })
        .then((response) => {
          setExist(response.data.exist);
          setBookId(response.data.bookId);
          setProgress(response.data.progress);
          setReportList(response.data.simpleReports);
        });
    }
  };
  useEffect(() => {
    bookExist();
  }, []);

  //책 추가 버튼
  const existhandle = () => {
    axios
      .post(
        "/api/book/mybook",
        {
          isbn13: bookData.isbn13,
          img: bookData.cover,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      )
      .then((response) => {
        navigate("/mybook");
      });
  };

  const [selected, setSelected] = useState("");
  const [selectedBooks, setSelectedBooks] = useState({});

  const onSubmithandle = () => {
    if (selected == "DELETE") {
      axios.delete("/api/book", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          bookId: bookId,
        },
      });
    } else {
      console.log(selected.key);
      axios.patch(
        "/api/book/progress",
        {
          bookId: bookId,
          progress: selected,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    }
    navigate("/main");
  };
  const selectList = [
    { key: "BEFORE", value: "읽기 전" },
    { key: "READING", value: "읽는 중" },
    { key: "COMP", value: "독서 완료" },
    { key: "DELETE", value: "책 삭제하기" },
  ];
  const selecthandle = (e) => {
    setSelected(e.target.value);
    // selectedBooks[selectedBook.isbn13] = e.target.value;
  };

  const [isIntroductionVisible, setIsIntroductionVisible] = useState(true);

  const toggleIntroduction = () => {
    setIsIntroductionVisible(!isIntroductionVisible);
  };
  const [user, setUser] = useState("");
  const getReport = async () => {
    if (bookId !== "null") {
      await axios
        .get(`/api/book/progress/reports`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            bookId: bookId,
          },
        })
        .then((response) => {
          console.log(response.data);
          setUser(response.data.user);
          setExist(response.data.exist);
          setProgress(response.data.progress);
          setReportList(response.data.simpleReports);
        });
    }
  };
  const renderReportList = () => {
    if (reportList.length === 0) {
      return <div className="noreportWrap">독후감이 없습니다.</div>;
    }

    return (
      <div className="reportWrap">
        {reportList.map((report) => (
          <div
            key={report.reportId}
            className="report"
            onClick={() => handleReportClick(report.reportId, user)}
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
  const handleReportClick = (reportId, user) => {
    navigate(`/reportview/${reportId}/${user}`);
  };
  const addReporthandle = () => {
    console.log(bookId);
    navigate(`/addreport/${bookId}`);
  };
  // progress에 해당하는 항목을 찾음
  const selectedOption = selectList.find((item) => item.key === progress);

  // progress에 해당하는 항목을 제외한 나머지 목록
  const restOfSelectList = selectList.filter((item) => item.key !== progress);
  return (
    <div>
      <div className="bookInfo">
        <div className="left">
          <div className="leftUp">
            <div className="infoImgWrap">
              <img className="infoImg" src={bookData.cover} />
            </div>
            <div className="leftUpLeft">
              <div className="infoTitle">{bookData.title}</div>
              <div className="infoauthor">저자 글쓴이 책 발행 년도</div>
              <div>
                {exist == false ? (
                  <button onClick={existhandle}>책 추가</button>
                ) : (
                  <select
                    onChange={selecthandle}
                    value={selected}
                    className="select"
                    disabled={user === "me" ? false : true}
                  >
                    {selectedOption && (
                      <option
                        value={selectedOption.key}
                        key={selectedOption.key}
                      >
                        {selectedOption.value}
                      </option>
                    )}
                    {restOfSelectList.map((item) => (
                      <option value={item.key} key={item.key}>
                        {item.value}
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
            <div className="infoCategory">{bookData.category}</div>
            <div>
              <span className="infoIntroWrap" onClick={toggleIntroduction}>
                <span className="introIcon">
                  {isIntroductionVisible ? ">" : "∧"}
                </span>{" "}
                책 소개
              </span>
              {isIntroductionVisible && (
                <div className="infointro">{bookData.description}</div>
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
              {user === "me" ? (
                exist === true ? (
                  <button className="reportAdd_btn" onClick={addReporthandle}>
                    독서록 추가
                  </button>
                ) : (
                  <div></div>
                )
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default BookInfo;
