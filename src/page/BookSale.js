import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../css/BookSale.module.css";
import { useNavigate } from "react-router-dom";
import BookSearchCard from "../component/BookSearchCard";
import UserSearchCard from "../component/UserSearchCard";
import { IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import refreshTokenFunc from "../component/Token/RefreshTokenFunc";

function BookSale() {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accesstoken");
  const [search, setSearch] = useState("");
  const [reasonList, setReasonList] = useState([]);
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
    navigate(`/salereason/${isbn13}`, { state: { search } });
  };
  return (
    <div>
      <div className={styles.bgWrap}>
        <span>
          <span>BOOKER</span> <br />
          유저들과의
          <br />책 거래 서비스
        </span>
      </div>
      <div className={styles.searchWrap}>
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
          id={styles.searchinput}
          type="text"
          value={search}
          placeholder="거래 하고 싶은 책을 검색해 보세요"
          onChange={handleSearchOnchange}
          onKeyDown={handleBookKeyPress}
        ></TextField>
      </div>
      <div className={styles.reasonListWrap}>
        {reasonList.map((reason) => (
          <BookSearchCard
            cover={reason.img}
            title={reason.title}
            isbn13={reason.isbn13}
            author={reason.author}
            publisher={reason.publisher}
            onClick={() => handleBookReasonClick(reason.isbn13)}
          ></BookSearchCard>
        ))}
      </div>
    </div>
  );
}
export default BookSale;
