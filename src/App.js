import "./css/App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import useBeforeUnload from "./component/UseBeforeUnload";
import Login from "./page/Login";
import SignUp from "./page/SignUp";
import Home from "./page/Home";
import Header from "./component/Header";
import Profile from "./page/Profile";
import Main from "./page/Main";
import BookRecommend from "./page/BookRecommend";
import NaverLoading from "./page/NaverLoading";
import GoogleLoading from "./page/GoogleLoading";
import BookInfo from "./page/BookInfo";
import MyBook from "./page/MyBook";
import SubUserBook from "./page/SubUserBook";
import AddReport from "./page/AddReport";
import ReportView from "./page/ReportView";
import ReportUpdate from "./page/ReportUpdate";
import SearchPage from "./page/SearchPage";
import ProfileUpdate from "./page/ProfileUpdate";
import BookSale from "./page/BookSale";
import SaleReason from "./page/SaleReason";

function App() {
  // 페이지를 떠날 때나 컴포넌트가 언마운트 될 때 localStorage에서 토큰 제거
  // useBeforeUnload(() => {
  //     // 페이지를 떠날 때만 토큰 삭제 로직 추가
  //     localStorage.removeItem("accesstoken");
  //     localStorage.removeItem("refreshtoken");
  // });

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile/:memberId" element={<Profile />} />
        <Route path="/profileupdate" element={<ProfileUpdate />} />
        <Route path="/main" element={<Main />} />
        <Route path="/" element={<Home />} />
        <Route path="/mybook" element={<MyBook />} />
        <Route path="/subuserbook/:profileId" element={<SubUserBook />} />
        <Route path="/bookinfo/:isbn13/:bookId" element={<BookInfo />} />
        <Route path="/reportview/:reportId/:user" element={<ReportView />} />
        <Route path="/addreport/:bookId" element={<AddReport />} />
        <Route path="/reportupdate/:reportId" element={<ReportUpdate />} />
        <Route path="/bookrecommend" element={<BookRecommend />} />
        <Route path="/Naver_Loading" element={<NaverLoading />}></Route>
        <Route path="/Google_Loading" element={<GoogleLoading />}></Route>
        <Route path="/searchpage" element={<SearchPage />}></Route>
        <Route path="/booksale" element={<BookSale />}></Route>
        <Route path="/salereason/:isbn13" element={<SaleReason />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
