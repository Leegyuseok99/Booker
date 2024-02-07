import React from "react";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import "../css/BookRecommend.css";
import BestSellerCard from "../component/BestSellerCard";
import SimilarUser from "../component/SimilarUser";
import { useNavigate } from "react-router-dom";
import refreshTokenFunc from "../component/Token/RefreshTokenFunc";

function BookRecommend() {
  const navigate = useNavigate();
  let accessToken = localStorage.getItem("accesstoken");
  //베스트 셀러 조회
  let [bookList, setBookList] = useState([]);

  useEffect(() => {
    getBook();
  }, []);
  async function fetchDataGetBook() {
    accessToken = await refreshTokenFunc(navigate);
    getBook();
  }
  let start = 2;
  const getBook = async () => {
    await axios
      .get("/api/book/bestseller", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          start: start,
        },
      })
      .then((response) => {
        console.log(response);
        const newBook = response.data.bestSellerList.map((item) => ({
          isbn13: item.isbn13,
          title: item.title,
          cover: item.cover,
          author: item.author,
          description: item.description,
        }));
        setBookList((prevBookList) => [...prevBookList, ...newBook]);
        start = start + 1;
      })
      .catch((error) => {
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          fetchDataGetBook();
        }
      });
  };
  const bookListRef = useRef(null);
  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = bookListRef.current;

    // 스크롤이 끝에 도달하면 fetchData 호출
    if (scrollTop + clientHeight >= scrollHeight) {
      getBook();
    }
  };
  useEffect(() => {
    const bookListElement = bookListRef.current;
    if (bookListElement) {
      // 스크롤 이벤트 리스너 등록
      bookListElement.addEventListener("scroll", handleScroll);
    }
    // 컴포넌트 언마운트 시 스크롤 이벤트 리스너 해제
    return () => {
      if (bookListElement) {
        bookListElement.removeEventListener("scroll", handleScroll);
      }
    };
  }, [start]);
  //취향 비슷한 유저 정보 가져오기
  const [similarUserList, setSimilarUserList] = useState([]);
  let nowPage = 0;
  const [hasNext, setHasNext] = useState(true);
  async function fetchDataGetOtherUser() {
    accessToken = await refreshTokenFunc(navigate);
    getOtherUser();
  }
  const getOtherUser = async () => {
    if (!hasNext) return;
    await axios
      .get("/api/profile/Recommendation", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          page: nowPage,
        },
      })
      .then((response) => {
        const otherUser = response.data.recommends.map((user) => ({
          profileId: user.profileId,
          nickname: user.nickname,
          image: user.imgURL,
          interests: user.interests,
        }));
        const updatedUser =
          nowPage === 0 ? otherUser : [...similarUserList, ...otherUser];

        setSimilarUserList((prevUser) => [...prevUser, ...updatedUser]);
        nowPage = nowPage + 1;
        setHasNext(response.data.hasNext);
      })
      .catch((error) => {
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          getOtherUser();
        }
      });
  };

  useEffect(() => {
    getOtherUser();
  }, []);

  const handleScroll1 = () => {
    const { scrollTop, scrollHeight, clientHeight } = userListRef.current;

    // 스크롤이 끝에 도달하면 fetchData 호출
    if (scrollTop + clientHeight >= scrollHeight) {
      getOtherUser();
    }
  };

  const userListRef = useRef(null);

  useEffect(() => {
    const userListElement = userListRef.current;
    // 스크롤 이벤트 리스너 등록
    if (userListElement) {
      userListElement.addEventListener("scroll", handleScroll1);
    }
    // 컴포넌트 언마운트 시 스크롤 이벤트 리스너 해제
    return () => {
      if (userListElement) {
        userListElement.removeEventListener("scroll", handleScroll1);
      }
    };
  }, [hasNext]);

  const handleBookClick = (isbn13, bookId) => {
    navigate(`/bookinfo/${isbn13}/${bookId}`);
  };

  const handleUserClick = (profileId) => {
    navigate(`/subuserbook/${profileId}`);
  };
  return (
    <div className="recommendWrap">
      <div className="bestSellerListWrap">
        <span>베스트 셀러</span>
        <div className="bsList" ref={bookListRef}>
          {bookList.map((book) => (
            <BestSellerCard
              isbn13={book.isbn13}
              cover={book.cover}
              title={book.title}
              author={book.author}
              description={book.description}
              onClick={() => handleBookClick(book.isbn13, null)}
            ></BestSellerCard>
          ))}
        </div>
      </div>
      <div className="similarUserWrap">
        <span>취향이 비슷한 유저</span>
        <div className="suList" ref={userListRef}>
          {similarUserList.map((similar) => (
            <SimilarUser
              profileId={similar.profileId}
              nickname={similar.nickname}
              profileimage={similar.image}
              interests={similar.interests}
              onClick={() => handleUserClick(similar.profileId)}
            ></SimilarUser>
          ))}
        </div>
      </div>
    </div>
  );
}
export default BookRecommend;
