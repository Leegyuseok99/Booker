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
  const { isbn13, bookId: initialBookId, otherbookstate } = useParams();
  const [bookId, setBookId] = useState(initialBookId);
  const navigate = useNavigate();
  let accessToken = localStorage.getItem("accesstoken");
  const [bookData, setBookData] = useState([
    {
      title:
        "나는 메트로폴리탄 미술관의 경비원입니다 - 경이로운 세계 속으로 숨어버린 한 남자의 이야기",
      author: "패트릭 브링리 (지은이), 김희정, 조현주 (옮긴이)",
      publisher: "웅진지식하우스",
      pubDate: "2023-11-24",
      cover:
        "https://image.aladin.co.kr/product/32892/38/coversum/8901276534_2.jpg",
      category: "국내도서>에세이>외국에세이",
      description:
        "뉴욕 메트로폴리탄 미술관에서 경비원으로 근무했던 패트릭 브링리의 독특하면서도 지적인 회고를 담은 에세이다. 가족의 죽음으로 고통 속에 웅크리고 있던 한 남자가 미술관에서 10년이라는 시간을 보내며 상실감을 극복하고 마침내 세상으로 나아갈 힘을 얻는 여정을 섬세하게 그려냈다.",
    },
  ]);
  const [reportList, setReportList] = useState([]);
  const [progress, setProgress] = useState();

  async function fetchDataBookInfo() {
    accessToken = await refreshTokenFunc(navigate);
    bookInfo();
  }

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
      })
      .catch((error) => {
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          fetchDataBookInfo();
        }
      });
  };
  useEffect(() => {
    bookInfo();
  }, []);

  // 책 존재 여부 확인(셀렉트 박스, 책 추가 버튼)
  const [exist, setExist] = useState(false);

  async function fetchDataBookExist() {
    accessToken = await refreshTokenFunc(navigate);
    bookExist();
  }
  const [user, setUser] = useState("");
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
          setUser(response.data.user);
        })
        .catch((error) => {
          const tokenErr = error.response.data.code;
          if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
            navigate("/login");
          } else if (tokenErr === "JwtTokenExpired") {
            fetchDataBookExist();
          }
        });
    }
  };
  useEffect(() => {
    bookExist();
  }, []);

  async function fetchDataExisthandle() {
    accessToken = await refreshTokenFunc(navigate);
    existhandle();
  }

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
      })
      .catch((error) => {
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          fetchDataExisthandle();
        }
      });
  };

  const [selected, setSelected] = useState("");

  async function fetchDataOnSubmithandle() {
    accessToken = await refreshTokenFunc(navigate);
    onSubmithandle();
  }

  const onSubmithandle = () => {
    if (selected == "DELETE") {
      axios
        .delete("/api/book", {
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
            fetchDataOnSubmithandle();
          }
        });
    } else {
      console.log(selected.key);
      axios
        .patch(
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
        )
        .catch((error) => {
          const tokenErr = error.response.data.code;
          if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
            navigate("/login");
          } else if (tokenErr === "JwtTokenExpired") {
            fetchDataOnSubmithandle();
          }
        });
    }
    navigate("/main");
  };
  const selectList = [
    {
      key: "BEFORE",
      value: "읽기 전",
    },
    {
      key: "READING",
      value: "읽는 중",
    },
    { key: "COMP", value: "독서 완료" },
    {
      key: "DELETE",
      value: "책 삭제하기",
    },
  ];
  const selecthandle = (e) => {
    setSelected(e.target.value);
    // selectedBooks[selectedBook.isbn13] = e.target.value;
  };

  const [isIntroductionVisible, setIsIntroductionVisible] = useState(true);

  const toggleIntroduction = () => {
    setIsIntroductionVisible(!isIntroductionVisible);
  };
  async function fetchDataGetReport() {
    accessToken = await refreshTokenFunc(navigate);
    getReport();
  }
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
        })
        .catch((error) => {
          const tokenErr = error.response.data.code;
          if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
            navigate("/login");
          } else if (tokenErr === "JwtTokenExpired") {
            fetchDataGetReport();
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
            onClick={() =>
              handleReportClick(report.reportId, user, isbn13, bookId)
            }
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
    navigate(`/reportview/${reportId}/${user}/${isbn13}/${bookId}`);
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
            <div className="leftUpRight">
              <div className="infoTitle">{bookData.title}</div>
              <div className="infoauthor">저자 글쓴이 책 발행 년도</div>
              <div>
                {exist == false ? (
                  <button className="bookAdd_btn" onClick={existhandle}>
                    책 추가
                  </button>
                ) : (
                  <select
                    onChange={selecthandle}
                    value={selected}
                    className="select"
                    disabled={user === "me" && exist === true ? false : true}
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
