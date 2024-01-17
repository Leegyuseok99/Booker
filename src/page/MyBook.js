import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/MyBook.css";
import BookListCard from "../component/BookListCard";
import BookInfo from "./BookInfo";
import FollowerModal from "../modals/FollowerModal";
import FollowingModal from "../modals/FollowingModal";

function MyBook() {
  const navigate = useNavigate();

  const [follower, setFollower] = useState("");
  const [following, setFollowing] = useState("");
  const getFollow = async () => {
    await axios
      .get("/follow/count")
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
      .get("/follower/list")
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
      .get("/following/list")
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

  const reads = [
    {
      cover: "https://gdimg.gmarket.co.kr/681948050/still/400?ver=1704238629",
      isbn13: "1111111",
    },
    {
      cover:
        "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788914020406.jpg",
      isbn13: "222222",
    },
    {
      cover:
        "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788914020406.jpg",
      isbn13: "222222",
    },
    {
      cover:
        "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788914020406.jpg",
      isbn13: "222222",
    },
    {
      cover:
        "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788914020406.jpg",
      isbn13: "222222",
    },
    {
      cover:
        "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788914020406.jpg",
      isbn13: "222222",
    },
  ];
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

  const handleBookClick = async (isbn13) => {
    navigate(`/bookinfo/${isbn13}`);
    try {
      const response = await axios.get(`/book/${isbn13}`);
      setSelectedBook(response.data);
    } catch (error) {
      console.error("Error fetching book details:", error);
    }
  };
  return (
    <div className="myBookWrap">
      <div className="mbProfile">
        <div className="mbProfileImg">
          <img className="mbImg"></img>
        </div>
        <div className="mbInfo">
          <div className="mbNickname">gyu_stone99</div>
          <div className="mbFavoriteWrap">
            <div className="mbFavorite"></div>
            <div className="mbFavorite"></div>
            <div className="mbFavorite"></div>
            <div className="mbFavorite"></div>
            <div className="mbFavorite"></div>
          </div>
        </div>
        <div className="message">
          <button className="message_btn">쪽지 목록</button>
        </div>
      </div>
      <div className="followWrap">
        <div className="follower">
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
        <div className="following">
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
      <div className="plusWrap">
        <div className="mbIntro">저는 sf를 좋아하는 이규석이라고 합니다.</div>
        <div>
          <button className="bookPlus_btn">책 추가</button>
        </div>
      </div>
      <hr style={{ margin: "30px 0px" }} />
      <div className="mbBookListWrap">
        {chunkedReads.map((chunk, idx) => (
          <div key={idx} className="mbBookList">
            {chunk.map((read, i) => (
              <BookListCard
                key={i}
                cover={read.cover}
                onClick={() => handleBookClick(read.isbn13)}
              ></BookListCard>
            ))}
          </div>
        ))}
      </div>
      {selectedBook && <BookInfo selectedBook={selectedBook} />}
    </div>
  );
}
export default MyBook;
