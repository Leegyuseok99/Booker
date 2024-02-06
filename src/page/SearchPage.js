import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../css/SearchPage.css";
import BookSearchCard from "../component/BookSearchCard";
import UserSearchCard from "../component/UserSearchCard";
import { IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import refreshTokenFunc from "../component/Token/RefreshTokenFunc";

function SearchPage() {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accesstoken");
  const [search, setSearch] = useState("");
  const [reasonList, setReasonList] = useState([
    {
      isbn13: "9791171253128",
      title: "푸바오, 언제나 사랑해",
      author:
        "강철원(에버랜드 동물원) (지은이), 류정훈(에버랜드 커뮤니케이션 그룹) (사진)",
      publisher: "시공주니어",
      img: "https://image.aladin.co.kr/product/33226/88/coversum/k452937057_2.jpg",
    },
    {
      isbn13: "9791171710102",
      title:
        "전지적 푸바오 시점 - 판다월드의 작은할부지 송바오가 전하는 푸바오의 뚠빵한 하루",
      author:
        "송영관(에버랜드 동물원) (지은이), 송영관(에버랜드 동물원), 류정훈(에버랜드 커뮤니케이션 그룹) (사진)",
      publisher: "위즈덤하우스",
      img: "https://image.aladin.co.kr/product/32806/58/coversum/k832936705_1.jpg",
    },
    {
      isbn13: "9791171251704",
      title: "푸바오, 매일매일 행복해 - 장난꾸러기 푸바오의 일상 포토 에세이",
      author:
        "강철원(에버랜드 동물원) (지은이), 류정훈(에버랜드 커뮤니케이션 그룹) (사진)",
      publisher: "시공주니어",
      img: "https://image.aladin.co.kr/product/32429/73/coversum/s892937173_1.jpg",
    },
    {
      isbn13: "9791165796396",
      title: "아기 판다 푸바오 - 장난꾸러기 푸바오의 성장 포토 에세이",
      author:
        "에버랜드 동물원 (지은이), 강철원(에버랜드 동물원) (글), 류정훈(에버랜드 커뮤니케이션 그룹) (사진)",
      publisher: "시공주니어",
      img: "https://image.aladin.co.kr/product/27588/17/coversum/k442733017_1.jpg",
    },
    {
      isbn13: "9791163637479",
      title: "판다 대백과 - 행복과 힐링을 주는 판다의 모든 것!",
      author: "상상인샹 (지은이), 김진아 (옮긴이), 홍밍성 (감수)",
      publisher: "뭉치",
      img: "https://image.aladin.co.kr/product/33006/64/coversum/k432937875_1.jpg",
    },
  ]);
  const [reasonUser, setReasonUser] = useState([
    {
      profileId: "k72LMF49fpK72Tsi7xIyx",
      nickname: "홍길동",
      intro: "안녕하세요",
      imgFileDto: {
        base64Image:
          "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",
        mimeType: "image/jpg",
      },
    },
    {
      profileId: "oJs8XzuuNOeh2cqSNxgR_",
      nickname: "길동이",
      intro: "아무나",
      imgFileDto: {
        base64Image:
          "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",
        mimeType: "image/jpg",
      },
    },
  ]);
  const [selectedContent, setSelectedContent] = useState("book");

  useEffect(() => {
    setSelectedContent("book");
  }, []);
  const handlebook = () => {
    setSelectedContent("book");
  };
  const handleuser = () => {
    setSelectedContent("user");
  };
  const searchBook = async () => {
    await axios
      .get("/book/search", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          titleOrAuthor: search,
          start: 0,
          maxResult: 5,
        },
      })
      .then((response) => {
        setReasonList(response.data.searchBooks);
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
  const handleSearchOnchange = (e) => {
    setSearch(e.target.value);
  };
  const handleBookKeyPress = (event) => {
    if (event.key === "Enter") {
      searchBook();
    }
  };
  const handleSearchBook = () => {
    searchBook();
  };
  const handleBookReasonClick = (isbn13) => {
    navigate(`/bookinfo/${isbn13}/null`);
  };
  const searchUser = async () => {
    await axios
      .get("/profile/search", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          nickname: search,
        },
      })
      .then((response) => {
        const otherUser = response.data.searchProfileList.map((user) => ({
          profileId: user.profileId,
          nickname: user.nickname,
          intro: user.intro,
          image: `data:${user.imgFileDto.mimeType};base64, ${user.imgFileDto.base64Image}`,
        }));
        setReasonUser(otherUser);
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
  const handleSearchUser = () => {
    searchUser();
  };
  const handleUserKeyPress = (event) => {
    if (event.key === "Enter") {
      searchUser();
    }
  };
  const handleUserReasonClick = (profileId) => {
    navigate(`/subuserbook/${profileId}`);
  };
  return (
    <div>
      <div className="bgWrap">
        <span>
          <span>BOOKER</span> <br />
          읽고 싶은 책 <br />
          유저 검색 서비스
        </span>
      </div>
      <div className="selecteContent_btn">
        <button onClick={handlebook} autoFocus>
          책 검색
        </button>
        <button onClick={handleuser}>유저 검색</button>
      </div>
      {selectedContent === "book" ? (
        <div>
          <div className="searchWrap">
            <TextField
              InputProps={{
                endAdornment: (
                  <IconButton
                    type="button"
                    sx={{ p: "10px" }}
                    aria-label="search"
                    onClick={handleSearchBook}
                  >
                    <SearchIcon />
                  </IconButton>
                ),
                sx: {
                  borderRadius: "30px",
                  backgroundColor: "white",
                  boxShadow: "2px 2px 2px 2px #999999",
                },
              }}
              id="searchinput"
              type="text"
              value={search}
              placeholder="읽고 싶은 책을 검색해 보세요"
              onChange={handleSearchOnchange}
              onKeyDown={handleBookKeyPress}
            ></TextField>
          </div>
          <div className="reasonListWrap">
            {reasonList.map((reasonb) => (
              <BookSearchCard
                cover={reasonb.img}
                title={reasonb.title}
                isbn13={reasonb.isbn13}
                author={reasonb.author}
                publisher={reasonb.publisher}
                onClick={() => handleBookReasonClick(reasonb.isbn13)}
              ></BookSearchCard>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="searchWrap">
            <TextField
              InputProps={{
                endAdornment: (
                  <IconButton
                    type="button"
                    sx={{ p: "10px" }}
                    aria-label="search"
                    onClick={handleSearchUser}
                  >
                    <SearchIcon />
                  </IconButton>
                ),
                sx: {
                  borderRadius: "30px",
                  backgroundColor: "white",
                  boxShadow: "2px 2px 2px 2px #999999",
                },
              }}
              id="searchinput"
              type="text"
              value={search}
              placeholder="다른 유저를 검색해 보세요"
              onChange={handleSearchOnchange}
              onKeyDown={handleUserKeyPress}
            ></TextField>
          </div>
          <div className="reasonListWrap">
            {reasonUser.map((reasonu) => (
              <UserSearchCard
                profileId={reasonu.profileId}
                nickname={reasonu.nickname}
                intro={reasonu.intro}
                imgFileDto={reasonu.image}
                onClick={() => handleUserReasonClick(reasonu.profileId)}
              ></UserSearchCard>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
export default SearchPage;
