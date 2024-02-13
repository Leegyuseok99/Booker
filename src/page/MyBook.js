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
  const [interests, setInterests] = useState([]);

  const [userData, setUserData] = useState({});
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
  const [follower, setFollower] = useState("3");
  const [following, setFollowing] = useState("2");
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
  const [followingList, setFollowingList] = useState([
    {
      profileId: "2HwxdooMuSw10xBQpGEhE",
      nickname: "google",
      intro: "google",
      imgFile: {
        base64Image:
          "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",
        mimeType: "image/jpg",
      },
    },
    {
      profileId: "oJs8XzuuNOeh2cqSNxgR_",
      nickname: "아무나",
      intro: "아무나",
      imgFile: {
        base64Image:
          "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",
        mimeType: "image/jpg",
      },
    },
  ]);
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

  let nowPage = 0;
  const [hasNext, setHasNext] = useState(true);

  const handleScroll = () => {
    // 현재 스크롤 위치
    const scrollY = window.scrollY;
    // 뷰포트의 높이
    const viewportHeight = window.innerHeight;
    // 문서의 전체 높이
    const fullHeight = document.body.scrollHeight;

    // 스크롤이 문서 맨 하단에 도달하면 추가 데이터 로드
    if (scrollY + viewportHeight >= fullHeight && hasNext) {
      getMyBook();
    }
  };

  useEffect(() => {
    // 스크롤 이벤트 리스너
    window.addEventListener("scroll", handleScroll);

    // 컴포넌트가 언마운트되면 이벤트 리스너 제거
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasNext]);
  async function fetchDataGetMyBook() {
    accessToken = await refreshTokenFunc(navigate);
    getMyBook();
  }
  const getMyBook = async () => {
    if (!hasNext) return;
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
        nowPage = response.data.nowPage + 1;
        setHasNext(response.data.hasNext);
      })
      .catch((error) => {
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          fetchDataGetMyBook();
        }
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
