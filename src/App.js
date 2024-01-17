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
import BookRecomend from "./page/BookRecomend";
import NaverLoading from "./page/NaverLoading";
import GoogleLoading from "./page/GoogleLoading";
import BookInfo from "./page/BookInfo";
import MyBook from "./page/MyBook";
import SubUserBook from "./page/SubUserBook";
import AddReport from "./page/AddReport";
import ReportView from "./page/ReportView";
import ReportUpdate from "./page/ReportUpdate";

function App() {
  // 페이지를 떠날 때나 컴포넌트가 언마운트 될 때 localStorage에서 토큰 제거
  useBeforeUnload(() => {
    // 페이지를 떠날 때만 토큰 삭제 로직 추가
    localStorage.removeItem("accesstoken");
    localStorage.removeItem("refreshtoken");
  });

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile/:memberId" element={<Profile />} />
        <Route path="/main" element={<Main />} />
        <Route path="/" element={<Home />} />
        <Route path="/mybook" element={<MyBook />} />
        <Route path="/subuserbook" element={<SubUserBook />} />
        <Route path="/bookinfo/:isbn13" element={<BookInfo />} />
        <Route path="/reportview/:reportId" element={<ReportView />} />
        <Route path="/addreport" element={<AddReport />} />
        <Route path="/reportupdate/:reportId" element={<ReportUpdate />} />
        <Route path="/bookrecomend" element={<BookRecomend />} />
        <Route path="/Naver_Loading" element={<NaverLoading />}></Route>
        <Route path="/Google_Loading" element={<GoogleLoading />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
