import React, { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "../css/SubUserBook.css";
import BookListCard from "../component/BookListCard";
import SubUserFollowerModal from "../modals/SubUserFollowerModal";
import FollowingModal from "../modals/FollowingModal";
import TelegramIcon from "@mui/icons-material/Telegram";
import Button from "@mui/material/Button";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import RemoveShoppingCartIcon from "@mui/icons-material/RemoveShoppingCart";
import MessageSendModal from "../modals/MessageSendModal";
import refreshTokenFunc from "../component/Token/RefreshTokenFunc";

function SubUserBook() {
  const navigate = useNavigate();
  const mynickname = localStorage.getItem("nickname");
  const { profileId } = useParams();

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

  const [subUserInfo, setSubUserInfo] = useState([]);
  const [imageSrc, setImageSrc] = useState("");
  const [interests, setInterests] = useState([]);

  async function fetchDataProfileInfo() {
    accessToken = await refreshTokenFunc(navigate);
    profileInfo();
  }

  const profileInfo = async () => {
    await axios
      .get("/api/profileInfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          profileId: profileId,
        },
      })
      .then((response) => {
        setImageSrc(response.data.imgURL);
        setInterests(response.data.interets);
        setSubUserInfo(response.data);
      })
      .catch((error) => {
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          fetchDataProfileInfo();
        }
      });
  };

  useEffect(() => {
    profileInfo();
  }, []);

  const [follower, setFollower] = useState("");
  const [following, setFollowing] = useState("");
  const accessToken = localStorage.getItem("accesstoken");

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
        params: {
          profileId: profileId,
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
        params: {
          profileId: profileId,
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
        params: {
          profileId: profileId,
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

  const [followingStatus, setFollowingStatus] = useState("");

  async function fetchDataIsFollowing() {
    accessToken = await refreshTokenFunc(navigate);
    isFollowing();
  }

  const isFollowing = async () => {
    await axios
      .get(`/api/follow/isFollowing`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          targetProfileId: profileId,
        },
      })
      .then((response) => {
        setFollowingStatus(response.data.following);
      })
      .catch((error) => {
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          fetchDataIsFollowing();
        }
      });
  };
  useEffect(() => {
    isFollowing();
  }, []);

  async function fetchDatahandleFollowToggle() {
    accessToken = await refreshTokenFunc(navigate);
    handleFollowToggle();
  }

  const handleFollowToggle = async () => {
    if (followingStatus) {
      try {
        await axios.delete("/api/unfollow", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          params: {
            targetProfileId: profileId,
          },
        });
        setFollowingStatus(false);
      } catch (error) {
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          fetchDatahandleFollowToggle();
        }
      }
    } else {
      try {
        await axios.post(
          "/api/follow",
          {
            profileId: profileId,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setFollowingStatus(true);
      } catch (error) {
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          fetchDatahandleFollowToggle();
        }
      }
    }
  };

  //개인 서재 api // 무한 스크롤 기능
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
      getUserBook();
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

  async function fetchDataGetUserBook() {
    accessToken = await refreshTokenFunc(navigate);
    getUserBook();
  }

  const getUserBook = async () => {
    if (!hasNext) return;
    console.log(nowPage);
    await axios
      .get("/api/book/library/list", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page: nowPage,
          profileId: profileId,
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
          fetchDataGetUserBook();
        }
      });
  };

  useEffect(() => {
    getUserBook();
  }, []);
  const chunkSize = 4;

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

  async function fetchDataHandleBookClick(isbn13) {
    accessToken = await refreshTokenFunc(navigate);
    handleBookClick(isbn13);
  }
  const handleBookClick = async (isbn13) => {
    navigate(`/bookinfo/${isbn13}`);
    try {
      const response = await axios.get(`/api/book/${isbn13}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setSelectedBook(response.data);
    } catch (error) {
      const tokenErr = error.response.data.code;
      if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
        navigate("/login");
      } else if (tokenErr === "JwtTokenExpired") {
        fetchDataHandleBookClick(isbn13);
      }
    }
  };

  return (
    <div className="SubUserBookWrap">
      <div className="subProfile">
        <div className="subProfileImg">
          <img className="subImg" src={imageSrc}></img>
        </div>
        <div className="subInfo">
          <div className="subNickname">{subUserInfo.nickname}</div>
          <div className="subFavoriteWrap">
            {interests.map((interest, idx) => (
              <div key={idx} className="subFavorite">
                {interest}
              </div>
            ))}
          </div>
        </div>
        <div className="submessage">
          <Button id="submessage_btn" onClick={modalOpenhandle}>
            <TelegramIcon style={{ margin: "0px 5px -5px 0px" }}></TelegramIcon>{" "}
            쪽지 보내기
          </Button>
          <MessageSendModal
            isOpen={isOpen}
            onSubmit={handleModalSubmit}
            onCancle={handleModalCancel}
            profileId={profileId}
            profileImg={imageSrc}
            nickname={subUserInfo.nickname}
          ></MessageSendModal>
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
        <div className="subIntro">{subUserInfo.intro}</div>
        <div>
          <Button
            id="following_btn"
            onClick={handleFollowToggle}
            startIcon={
              followingStatus ? <PersonRemoveIcon /> : <PersonAddAlt1Icon />
            }
          >
            {followingStatus ? " 팔로잉" : " 팔로우"}
          </Button>
        </div>
      </div>
      <hr style={{ margin: "30px 0px 15px" }} />
      <div className="sellIconWrap">
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
      <div className="subBookListWrap">
        {chunkedReads.map((chunk, idx) => (
          <div key={idx} className="subBookList">
            {chunk.map((read, i) => (
              <div className="bookListCard">
                <BookListCard
                  key={i}
                  cover={read.img}
                  onClick={handleBookClick}
                ></BookListCard>
                <div className="sellIconWrap">
                  {read.saleStatus === "POS" ? (
                    <span>
                      <ShoppingCartIcon></ShoppingCartIcon>
                    </span>
                  ) : (
                    <span>
                      <RemoveShoppingCartIcon></RemoveShoppingCartIcon>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
export default SubUserBook;
