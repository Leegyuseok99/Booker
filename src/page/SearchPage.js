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
  let accessToken = localStorage.getItem("accesstoken");
  const [search, setSearch] = useState("");
  const [reasonList, setReasonList] = useState([]);
  const [reasonUser, setReasonUser] = useState([]);
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
  async function fetchDataSearchBook() {
    accessToken = await refreshTokenFunc(navigate);
    searchBook();
  }
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
          fetchDataSearchBook();
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
  async function fetchDataSearchUser() {
    accessToken = await refreshTokenFunc(navigate);
    searchUser();
  }
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
          fetchDataSearchUser();
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
