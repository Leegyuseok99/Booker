import { TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/App.css";
import Modal from "@material-ui/core";
import LogoutModal from "../modals/LogoutModal";
import "../css/modal/LogoutModal.module.css";

function Header() {
  const navigator = useNavigate();
  const [user, setUser] = useState(false);
  useEffect(() => {
    if (localStorage.getItem("accesstoken") !== null) {
      setUser(true);
    } else setUser(false);
  }, [localStorage.getItem("accesstoken")]);

  //로그아웃 모달

  const [isOpen, setOpen] = useState(false);

  const modalOpenhandle = () => {
    setOpen(true);
  };
  const handleModalSubmit = () => {
    // 모달1 비지니스 로직
    setOpen(false);
    localStorage.removeItem("accesstoken");
    localStorage.removeItem("refreshtoken");
    navigator("/");
  };
  const handleModalCancel = () => {
    setOpen(false);
    console.log("close");
  };

  return (
    <div>
      {user ? (
        <div className="header">
          <Link to="/main" className="logo">
            로고
          </Link>
          <div className="user_info">
            <Link to="/mybook" className="header_individual">
              <span>개인 서재</span>
            </Link>
            <Link to="/bookrecomend" className="header_recomend">
              <span>책 추천</span>
            </Link>
            <Link to="/main" className="header_place">
              <span>도서관</span>
            </Link>
            <TextField
              className="search"
              variant="outlined"
              placeholder="책을 검색해 보세요"
              type="text"
              InputProps={{
                style: {
                  borderRadius: "30px",
                  height: "70%",
                  fontSize: "13px",
                },
              }}
            ></TextField>
            <div className="user_profile"></div>
            <button className="headerLogout_bnt" onClick={modalOpenhandle}>
              로그아웃
            </button>
            <LogoutModal
              isOpen={isOpen}
              onSubmit={handleModalSubmit}
              onCancle={handleModalCancel}
            ></LogoutModal>
          </div>
        </div>
      ) : (
        <div className="header">
          <Link to="/" className="logo">
            로고
          </Link>
          <Link to="/login">
            <button className="headerLogin_btn">로그인</button>
          </Link>
        </div>
      )}
    </div>
  );
}
export default Header;
