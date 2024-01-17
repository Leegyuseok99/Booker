import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/SubUserBook.css";
import BookListCard from "../component/BookListCard";
import SubUserFollowerModal from "../modals/SubUserFollowerModal";
import FollowingModal from "../modals/FollowingModal";

function SubUserBook() {
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

  const [followingStatus, setFollowingStatus] = useState("");
  useEffect(async () => {
    await axios.get(`/follow/isFollowing`).then((response) => {
      setFollowingStatus(response.data.following);
    });
  }, []);

  const handleFollowToggle = async () => {
    if (followingStatus) {
      try {
        await axios.delete("/unfollow", {
          params: {
            //프로필 id
          },
        });
        setFollowingStatus(false);
      } catch (error) {
        console.error("사용자 언팔로우 중 오류 발생:", error);
      }
    } else {
      try {
        await axios.post("/follow", {
          //프로필 ID
        });
        setFollowingStatus(true);
      } catch (error) {
        console.error("사용자 팔로우 중 오류 발생:", error);
      }
    }
  };

  const reads = [
    {
      cover: "https://gdimg.gmarket.co.kr/681948050/still/400?ver=1704238629",
      isbn13: "1111111",
    },
    {
      cover:
        "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788914020406.jpg",
      isbn13: "1111111",
    },
  ];
  const chunkSize = 5;

  // 배열을 지정된 크기의 청크로 나누는 함수
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
    <div className="SubUserBookWrap">
      <div className="subProfile">
        <div className="subProfileImg">
          <img className="subImg"></img>
        </div>
        <div className="subInfo">
          <div className="subNickname">gyu_stone99</div>
          <div className="subFavoriteWrap">
            <div className="subFavorite"></div>
            <div className="subFavorite"></div>
            <div className="subFavorite"></div>
            <div className="subFavorite"></div>
            <div className="subFavorite"></div>
          </div>
        </div>
        <div className="submessage">
          <button className="submessage_btn">쪽지 보내기</button>
        </div>
      </div>
      <div className="followWrap">
        <div className="follower">
          팔라워{" "}
          <span style={{ cursor: "pointer" }} onClick={followerModalOpenhandle}>
            {follower}
          </span>
          <SubUserFollowerModal
            isOpen={isOpen1}
            onCancle={followerhandleModalCancel}
            followerList={followerList}
          ></SubUserFollowerModal>
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
      <div className="subplusWrap">
        <div className="subIntro">저는 sf를 좋아하는 이규석이라고 합니다.</div>
        <div>
          <button className="following_btn" onClick={handleFollowToggle}>
            {followingStatus ? "- 팔로잉" : "+ 팔로우"}
          </button>
        </div>
      </div>
      <hr style={{ margin: "30px 0px" }} />
      <div className="subBookListWrap">
        {chunkedReads.map((chunk, idx) => (
          <div key={idx} className="subBookList">
            {chunk.map((read, i) => (
              <BookListCard key={i} cover={read.cover}></BookListCard>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
export default SubUserBook;
