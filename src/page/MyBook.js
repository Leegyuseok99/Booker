import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../css/MyBook.module.css";
import BookListCard from "../component/BookListCard";
import BookInfo from "./BookInfo";
import FollowerModal from "../modals/FollowerModal";
import FollowingModal from "../modals/FollowingModal";
import TelegramIcon from "@mui/icons-material/Telegram";
import AddIcon from "@mui/icons-material/Add";
import Button from "@mui/material/Button";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import MessageListModal from "../modals/MessageListModal";
import refreshTokenFunc from "../component/Token/RefreshTokenFunc";
import BookIcon from "@mui/icons-material/Book";
import LocalLibraryIcon from "@mui/icons-material/LocalLibrary";
import BeenhereIcon from "@mui/icons-material/Beenhere";

function MyBook() {
  const navigate = useNavigate();

  const [isOpen, setOpen] = useState(false);

  const modalOpenhandle = () => {
    setOpen(true);
  };
  const handleModalSubmit = () => {
    // 모달1 비지니스 로직
    setOpen(false);
  };

  const handleModalCancel = () => {
    setOpen(false);
    console.log("close");
  };

  let accessToken = localStorage.getItem("accesstoken");

  const [imageSrc, setImageSrc] = useState("");
  const [interests, setInterests] = useState([
    "정치",
    "수필집1",
    "정치1",
    "수학1",
    "천문학1",
  ]);

  const [userData, setUserData] = useState({
    nickname: "naver",
    intro: "naver",
  });
  async function fetchDataGetUser() {
    accessToken = await refreshTokenFunc(navigate);
    getUser();
  }
  const getUser = () => {
    axios
      .get("/api/profileInfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setImageSrc(response.data.imgURL);
        setInterests(response.data.interets);
        setUserData(response.data);
      })
      .catch((error) => {
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          fetchDataGetUser();
        }
      });
  };
  useEffect(() => {
    getUser();
  }, []);
  const [follower, setFollower] = useState("");
  const [following, setFollowing] = useState("");
  async function fetchDataGetFollow() {
    accessToken = await refreshTokenFunc(navigate);
    getFollow();
  }
  const getFollow = async () => {
    await axios
      .get("/api/follow/count", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setFollower(response.data.followerCount);
        setFollowing(response.data.followingCount);
      })
      .catch((error) => {
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          fetchDataGetFollow();
        }
        if (error.response.data.code === "INVALID_PROFILEID") {
          window.alert(error.response.data.message);
        }
      });
  };

  useEffect(() => {
    getFollow();
  }, []);

  const [isOpen1, setOpen1] = useState(false);

  const [followerList, setFollowerList] = useState([]);
  async function fetchDataFollowerModalOpenhandle() {
    accessToken = await refreshTokenFunc(navigate);
    followerModalOpenhandle();
  }
  const followerModalOpenhandle = () => {
    setOpen1(true);
    axios
      .get("/api/follower/list", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const followerList = response.data;
        setFollowerList(followerList);
      })
      .catch((error) => {
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          fetchDataFollowerModalOpenhandle();
        }
      });
  };
  const followerhandleModalCancel = () => {
    setOpen1(false);
    console.log("close");
  };

  const [isOpen2, setOpen2] = useState(false);
  const [followingList, setFollowingList] = useState([]);
  async function fetchDataFollowingModalOpenhandle() {
    accessToken = await refreshTokenFunc(navigate);
    followingModalOpenhandle();
  }
  const followingModalOpenhandle = () => {
    setOpen2(true);
    axios
      .get("/api/following/list", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const followingList = response.data;
        setFollowingList(followingList);
      })
      .catch((error) => {
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          fetchDataFollowingModalOpenhandle();
        }
      });
  };
  const followinghandleModalCancel = () => {
    setOpen2(false);
    console.log("close");
  };

  const handleBookplus = () => {
    navigate("/searchpage");
  };
  let [reads, setReads] = useState([]);

  const [nowPage, setNowPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleScroll = () => {
    // 현재 스크롤 위치
    const scrollY = document.documentElement.scrollTop;
    // 뷰포트의 높이
    const viewportHeight = document.documentElement.clientHeight;
    // 문서의 전체 높이
    const fullHeight = document.documentElement.scrollHeight;

    // 스크롤이 문서 맨 하단에 도달하면 추가 데이터 로드
    if (scrollY + viewportHeight >= fullHeight - 10 && hasNext && !loading) {
      getMyBook();
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasNext, loading]);
  async function fetchDataGetMyBook() {
    accessToken = await refreshTokenFunc(navigate);
    getMyBook();
  }

  const getMyBook = async () => {
    if (!hasNext || loading) return;
    setLoading(true);
    console.log(nowPage);
    await axios
      .get("/api/book/library/list", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page: nowPage,
        },
      })
      .then((response) => {
        console.log(response.data);
        const updatedReads =
          nowPage === 0
            ? response.data.bookLists
            : [...reads, ...response.data.bookLists];

        setReads((prevReads) => [...prevReads, ...updatedReads]);
        setNowPage(response.data.nowPage + 1);
        setHasNext(response.data.hasNext);
      })
      .catch((error) => {
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          fetchDataGetMyBook();
        }
      })
      .finally(() => {
        setLoading(false); // 데이터를 모두 받아온 후에 로딩 상태 변경
      });
  };

  useEffect(() => {
    getMyBook();
  }, []);
  const chunkSize = 4;

  const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

  const chunkedReads = chunkArray(reads, chunkSize);

  const [selectedBook, setSelectedBook] = useState(null);

  const handleBookClick = async (isbn13, bookId) => {
    navigate(`/bookinfo/${isbn13}/${bookId}`);
  };

  async function fetchDataSaleStatusChange(bookId) {
    accessToken = await refreshTokenFunc(navigate);
    saleStatusChange(bookId);
  }

  const saleStatusChange = (bookId) => {
    const clickedBookIndex = reads.findIndex((book) => book.bookId === bookId);

    const newSaleStatus =
      reads[clickedBookIndex].saleState === "POS" ? "IMP" : "POS";
    try {
      axios.patch(
        "/api/book/saleState",
        {
          bookId: reads[clickedBookIndex].bookId,
          saleState: newSaleStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const updatedReads = [...reads];
      updatedReads[clickedBookIndex].saleState = newSaleStatus;
      setReads(updatedReads);
    } catch (error) {
      const tokenErr = error.response.data.code;
      if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
        navigate("/login");
      } else if (tokenErr === "JwtTokenExpired") {
        fetchDataSaleStatusChange(bookId);
      }
    }
  };
  function iconSelect(pro) {
    switch (pro) {
      case "READING":
        return <LocalLibraryIcon></LocalLibraryIcon>;

      case "BEFORE":
        return <BookIcon></BookIcon>;

      default:
        return <BeenhereIcon></BeenhereIcon>;
    }
  }
  return (
    <div className={styles.myBookWrap}>
      <div className={styles.mbProfile}>
        <div className={styles.mbProfileImg}>
          <img src={imageSrc} className={styles.mbImg}></img>
        </div>
        <div className={styles.mbInfo}>
          <div className={styles.mbNickname}>{userData.nickname}</div>
          <div className={styles.mbFavoriteWrap}>
            {interests.map((interest, idx) => (
              <div key={idx} className={styles.mbFavorite}>
                {interest}
              </div>
            ))}
          </div>
        </div>
        <div className={styles.message}>
          <Button id={styles.message_btn} onClick={modalOpenhandle}>
            <TelegramIcon style={{ marginBottom: "-5px" }}></TelegramIcon> 쪽지
            목록
          </Button>
          <MessageListModal
            isOpen={isOpen}
            onCancle={handleModalCancel}
          ></MessageListModal>
        </div>
      </div>
      <div className={styles.followWrap}>
        <div className={styles.follower}>
          팔라워{" "}
          <span style={{ cursor: "pointer" }} onClick={followerModalOpenhandle}>
            {follower}
          </span>
          <FollowerModal
            isOpen={isOpen1}
            onCancle={followerhandleModalCancel}
            followerList={followerList}
          ></FollowerModal>
        </div>
        <span> ● </span>
        <div className={styles.following}>
          팔로잉{" "}
          <span
            style={{ cursor: "pointer" }}
            onClick={followingModalOpenhandle}
          >
            {following}
          </span>
          <FollowingModal
            isOpen={isOpen2}
            onCancle={followinghandleModalCancel}
            followingList={followingList}
            myProfileId={userData.profileId}
          ></FollowingModal>
        </div>
      </div>
      <div className={styles.plusWrap}>
        <div className={styles.mbIntro}>{userData.intro}</div>
        <div>
          <Button id={styles.bookPlus_btn} onClick={handleBookplus}>
            <AddIcon style={{ marginBottom: "-5px" }}></AddIcon> 책 추가
          </Button>
        </div>
      </div>
      <hr style={{ margin: "30px 0px 15px" }} />
      <div className={styles.sellIconWrap}>
        <span>
          <ShoppingCartIcon style={{ marginBottom: "-5px" }}></ShoppingCartIcon>{" "}
          거래 가능
        </span>
        <span>
          <RemoveShoppingCartIcon
            style={{ marginBottom: "-5px" }}
          ></RemoveShoppingCartIcon>{" "}
          거래 불가능
        </span>
      </div>
      <div className={styles.mbBookListWrap}>
        {chunkedReads.map((chunk, idx) => (
          <div key={idx} className={styles.mbBookList}>
            {chunk.map((read, i) => (
              <div className={styles.bookListCard}>
                <BookListCard
                  key={i}
                  bookId={read.bookId}
                  progress={read.progress}
                  isbn13={read.isbn13}
                  cover={read.img}
                  onClick={() => handleBookClick(read.isbn13, read.bookId)}
                ></BookListCard>
                <div className={styles.iconWrap}>
                  <div className={styles.sellIconWrap}>
                    {read.saleState === "POS" ? (
                      <span onClick={() => saleStatusChange(read.bookId)}>
                        <ShoppingCartIcon></ShoppingCartIcon>
                      </span>
                    ) : (
                      <span onClick={() => saleStatusChange(read.bookId)}>
                        <RemoveShoppingCartIcon></RemoveShoppingCartIcon>
                      </span>
                    )}
                  </div>
                  <div className={styles.progressWrap}>
                    {iconSelect(read.progress)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {selectedBook && <BookInfo selectedBook={selectedBook} />}
    </div>
  );
}
export default MyBook;
