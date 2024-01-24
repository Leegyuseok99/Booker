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

  const accessToken = localStorage.getItem("accesstoken");
  const [imageSrc, setImageSrc] = useState("");
  const [interests, setInterests] = useState([]);

  const [userData, setUserData] = useState({});
  const getUser = () => {
    axios
      .get("/profileInfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        const image = response.data.imgFile.base64Image;
        const mimeType = response.data.imgFile.mimeType;
        // Spring에서 받은 Base64 문자열
        setImageSrc(`data:${mimeType};base64, ${image}`);
        setInterests(response.data.interets);
        setUserData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    getUser();
  }, []);
  const [follower, setFollower] = useState("");
  const [following, setFollowing] = useState("");
  const getFollow = async () => {
    await axios
      .get("/follow/count", {
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
  const followerModalOpenhandle = () => {
    setOpen1(true);
    axios
      .get("/follower/list", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const followerList = response.data;
        setFollowerList(followerList);
      })
      .catch((error) => {
        console.log(error.data);
      });
  };
  const followerhandleModalCancel = () => {
    setOpen1(false);
    console.log("close");
  };

  const [isOpen2, setOpen2] = useState(false);
  const [followingList, setFollowingList] = useState([]);
  const followingModalOpenhandle = () => {
    setOpen2(true);
    axios
      .get("/following/list", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const followingList = response.data;
        setFollowingList(followingList);
      })
      .catch((error) => {
        console.log(error.data);
      });
  };
  const followinghandleModalCancel = () => {
    setOpen2(false);
    console.log("close");
  };

  const [reads, setReads] = useState([
    {
      bookId: "3zx3SoJbytMSDrMNPatet",
      isbn13: "9788901276533",
      progress: "READING",
      saleState: "POS",
      img: "https://image.aladin.co.kr/product/32892/38/coversum/8901276534_2.jpg",
    },
    {
      bookId: "BKVl2gBsviqimxTWGFgrV",
      isbn13: "9788917239508",
      progress: "READING",
      saleState: "POS",
      img: "https://image.aladin.co.kr/product/33010/94/coversum/8917239501_1.jpg",
    },
    {
      bookId: "Oyc1vJwLOtTiQF6x9aYuf",
      isbn13: "9788917239492",
      progress: "READING",
      saleState: "IMP",
      img: "https://image.aladin.co.kr/product/33010/94/coversum/8917239501_1.jpg",
    },
  ]);

  const [nowPage, setNowPage] = useState(0);
  const [hasNext, setHasNext] = useState(true);

  const handleScroll = () => {
    // 현재 스크롤 위치
    const scrollY = window.scrollY;
    // 뷰포트의 높이
    const viewportHeight = window.innerHeight;
    // 문서의 전체 높이
    const fullHeight = document.body.scrollHeight;

    // 스크롤이 문서 맨 하단에 도달하면 추가 데이터 로드
    if (scrollY + viewportHeight === fullHeight) {
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
  }, []);

  const getMyBook = async () => {
    if (!hasNext) return;
    await axios
      .get("/book/library/list", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log(response.data.bookLists);
        const updatedReads =
          nowPage === 0
            ? response.data.bookLists
            : [...reads, ...response.data.bookLists];

        setReads(updatedReads);
        setNowPage(nowPage + 1);
        setHasNext(response.data.hasNext);
      });
  };

  useEffect(() => {
    getMyBook();
  }, []);
  const chunkSize = 5;

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
    // try {
    //     const response = await axios.get(`/book/${isbn13}`);
    //     setSelectedBook(response.data);
    // } catch (error) {
    //     console.error("Error fetching book details:", error);
    // }
  };

  const saleStatusChange = (bookId) => {
    const clickedBookIndex = reads.findIndex((book) => book.bookId === bookId);

    const newSaleStatus =
      reads[clickedBookIndex].saleState === "POS" ? "IMP" : "POS";
    try {
      axios.patch(
        "/book/saleState",
        {
          bookId: reads.bookId,
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
      console.error(error);
    }
  };
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
          ></FollowingModal>
        </div>
      </div>
      <div className={styles.plusWrap}>
        <div className={styles.mbIntro}>{userData.intro}</div>
        <div>
          <Button id={styles.bookPlus_btn}>
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
