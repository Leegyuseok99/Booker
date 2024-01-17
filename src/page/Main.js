import { TextField } from "@material-ui/core";
import React from "react";
import { lazy, Suspense, createContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Main.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import ReadingBookitem from "../component/ReadingBookitem";

import BookInfo from "./BookInfo";

function Main() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState();
  const [userPw, setUserPw] = useState();
  const reads = [
    {
      cover:
        "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788914020406.jpg",
      title: "짜라투스",
      story: "짜라투스 트라는 내친구",
      isbn13: "1111123",
    },
    {
      title: "로빈슨dsdsadaddsadasdsadsadasdsadsadsadsadsd",
      story:
        "무인도에서 살아남기 무인도에서 살아남기 무인도에서 살아남기 무인도에서 살아남기 무인도에서 살아남기 무인도에서 살아남기 무인도에서 살아남기 무인도에서 살아남기 무인도에서 살아남기 무인도에서 살아남기 무인도에서 살아남기 무인도에서 살아남기 ",
    },
    {
      title: "마이클 조던",
      story: "농구 천재의 이야기",
    },
    {
      title: "서울",
      story: "과거 서울의 이야기",
    },
    {
      title: "누가 치즈를",
      story: "철학자들의 이야기",
    },
  ];
  const [userData, setUserData] = useState();
  const getHome = async () => {
    const accessToken = localStorage.getItem("accesstoken");
    await axios
      .get("", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setUserData(response.data);
      })
      .catch((error) => {
        if (error.response.message == "토큰이 만료 되었습니다.") {
          //토큰 기간이 만료가 된 경우
          const { accessToken, refreshToken } = getNewRefreshToken();
          error.config.headers.Authorization = accessToken; //새로운 accesstoken 넣어주기
          localStorage.setItem("accesstoken", accessToken);
          localStorage.setItem("refreshtoken", refreshToken);
          return axios.get(error.config.url, error.config).data;
        }
      });
  };
  useEffect(() => {
    getHome();
  }, []);

  const getNewRefreshToken = async () => {
    const accessToken = localStorage.getItem("accesstoken");
    const refreshToken = localStorage.getItem("refreshtoken");
    await axios.post(
      "",
      {
        refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  };
  // useEffect(() => {
  //   getUser();
  // }, []);

  // async function getUser() {
  //   await axios
  //     .get("")
  //     .then((response) => {
  //       console.log(response.data);
  //       setUserId(response.data.userId);
  //       setUserPw(response.data.userPw);
  //       localStorage.setItem("accesstoken", response.data.accesstoken);
  //       localStorage.setItem("refreshtoken", response.data.refreshtoken);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }

  const [selectedBook, setSelectedBook] = useState(null); // 선택한 책의 정보를 저장할 상태

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
    <div>
      <div className="mainTitleWrap">
        {localStorage.getItem("accesstoken")} 님, 안녕하세요
      </div>
      <div className="readingBook">
        <h1>읽고 있는 책 목록</h1>
        <Swiper
          modules={[Pagination, Navigation]}
          pagination={{
            clickable: true,
          }}
          navigation={{
            clickable: true,
          }}
          slidesPerView={1}
          spaceBetween={20}
          effect={"fade"}
          loop={true}
          speed={300}
          className="readingBookCoontainer"
        >
          <div className="readingBookWrap">
            {reads.map((read, idx) => {
              return (
                <SwiperSlide
                  key={idx}
                  onClick={() => handleBookClick(read.isbn13)}
                >
                  <ReadingBookitem
                    cover={read.cover}
                    title={read.title}
                    story={read.story}
                    onClick={() => handleBookClick(read.isbn13)}
                  />
                </SwiperSlide>
              );
            })}
          </div>
        </Swiper>
      </div>
      {selectedBook && <BookInfo selectedBook={selectedBook} />}
    </div>
  );
}
export default Main;
