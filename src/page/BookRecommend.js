import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import "../css/BookRecommend.css";
import BestSellerCard from "../component/BestSellerCard";
import SimilarUser from "../component/SimilarUser";
import { useNavigate } from "react-router-dom";
import refreshTokenFunc from "../component/Token/RefreshTokenFunc";

function BookRecommend() {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accesstoken");
  //베스트 셀러 조회
  const [bookList, setBookList] = useState([]);

  useEffect(() => {
    getBook();
  }, []);

  const getBook = async () => {
    await axios
      .get("/book/bestseller", {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          start: 1,
        },
      })
      .then((response) => {
        console.log(response);
        const newBook = response.data.bestSellerList.map((item) => ({
          isbn13: item.ISBN13,
          title: item.title,
          cover: item.cover,
          author: item.author,
          description: item.description,
        }));
        setBookList(newBook);
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

  //취향 비슷한 유저 정보 가져오기
  const [similarUserList, setSimilarUserList] = useState([]);

  const getOtherUser = async () => {
    await axios
      .get("/profile/Recommendation", {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      .then((response) => {
        const otherUser = response.data.recommends.map((user) => ({
          profileId: user.profileId,
          nickname: user.nickname,
          image: `data:${user.imgFileDto.mimeType};base64, ${user.imgFileDto.base64Image}`,
          interests: user.interests,
        }));
        setSimilarUserList(otherUser);
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
    getOtherUser();
  }, []);

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
        <div className="bsList">
          {bookList.map((book) => (
            <BestSellerCard
              isbn13={book.isbn13}
              cover={book.cover}
              title={book.title}
              author={book.author}
              description={book.description}
              onClick={() => handleBookClick(book.isbn13)}
            ></BestSellerCard>
          ))}
        </div>
      </div>
      <div className="similarUserWrap">
        <span>취향이 비슷한 유저</span>
        <div className="suList">
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
