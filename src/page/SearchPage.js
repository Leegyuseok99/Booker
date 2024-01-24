import React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../css/SearchPage.css";
import SearchCard from "../component/SearchCard";
import { IconButton, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

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
      isbn13: "9798",
      title: "dd, 언제나 사랑해",
      author:
        "강철원(에버랜드 동물원) (지은이), 류정훈(에버랜드 커뮤니케이션 그룹) (사진)",
      publisher: "시공",
      img: "https://image.aladin.co.kr/product/33226/88/coversum/k452937057_2.jpg",
    },
  ]);

  const searchBook = async () => {
    await axios
      .get("/book/search", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          titleOrAuthor: search,
        },
      })
      .then((response) => {
        setReasonList(response.data.searchBooks);
      });
  };
  const handleSearchOnchange = (e) => {
    setSearch(e.target.value);
  };
  const handleSearch = () => {
    searchBook();
  };
  const handleReasonClick = () => {
    navigate("/");
  };
  return (
    <div>
      <div className="searchWrap">
        <TextField
          InputProps={{
            endAdornment: (
              <IconButton
                type="button"
                sx={{ p: "10px" }}
                aria-label="search"
                onClick={handleSearch}
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
        ></TextField>
      </div>
      <div className="reasonListWrap">
        {reasonList.map((reason) => (
          <SearchCard
            cover={reason.img}
            title={reason.title}
            isbn13={reason.isbn13}
            author={reason.author}
            publisher={reason.publisher}
            onClick={handleReasonClick}
          ></SearchCard>
        ))}
      </div>
    </div>
  );
}
export default SearchPage;
