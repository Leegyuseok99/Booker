import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/BookInfo.css";
import { useParams } from "react-router-dom";
import FolderIcon from "@mui/icons-material/Folder";
import EditNoteIcon from "@mui/icons-material/EditNote";
import refreshTokenFunc from "../component/Token/RefreshTokenFunc";

function BookInfo({ selectedBook, onSubmit }) {
  const { isbn13, bookId: initialBookId } = useParams();
  const [bookId, setBookId] = useState(initialBookId);
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accesstoken");
  const [bookData, setBookData] = useState([]);
  const [reportList, setReportList] = useState([]);
  const [progress, setProgress] = useState();
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
      })
      .catch((error) => {
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          refreshTokenFunc(navigate);
        }
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
        .get("/book/newbook", {
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
        })
        .catch((error) => {
          const tokenErr = error.response.data.code;
          if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
            navigate("/login");
          } else if (tokenErr === "JwtTokenExpired") {
            refreshTokenFunc(navigate);
          }
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
        "/book/mybook",
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
      })
      .catch((error) => {
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          refreshTokenFunc(navigate);
        }
      });
  };

  const [selected, setSelected] = useState("");

  const onSubmithandle = () => {
    if (selected == "DELETE") {
      axios
        .delete("/book", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            bookId: bookId,
          },
        })
        .catch((error) => {
          const tokenErr = error.response.data.code;
          if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
            navigate("/login");
          } else if (tokenErr === "JwtTokenExpired") {
            refreshTokenFunc(navigate);
          }
        });
    } else {
      console.log(selected.key);
      axios
        .patch(
          "/book/progress",
          {
            bookId: bookId,
            progress: selected,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        )
        .catch((error) => {
          const tokenErr = error.response.data.code;
          if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
            navigate("/login");
          } else if (tokenErr === "JwtTokenExpired") {
            refreshTokenFunc(navigate);
          }
        });
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

  const getReport = async () => {
    if (bookId !== "null") {
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
          setExist(response.data.exist);
          setProgress(response.data.progress);
          setReportList(response.data.simpleReports);
        })
        .catch((error) => {
          const tokenErr = error.response.data.code;
          if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
            navigate("/login");
          } else if (tokenErr === "JwtTokenExpired") {
            refreshTokenFunc(navigate);
          }
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
              <div className="infoauthor">
                <span>{bookData.author}</span>
                <br />
                <span>{bookData.publisher}</span>
                <span>{bookData.pubDate}</span>
              </div>
              <div>
                {exist == false ? (
                  <button onClick={existhandle}>책 추가</button>
                ) : (
                  <select
                    onChange={selecthandle}
                    value={selected}
                    className="select"
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
              {exist === true ? (
                <button className="reportAdd_btn" onClick={addReporthandle}>
                  독서록 추가
                </button>
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
