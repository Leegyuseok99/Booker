import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../css/App.css";
import LogoutModal from "../modals/LogoutModal";
import "../css/modal/LogoutModal.module.css";
import axios from "axios";
import refreshTokenFunc from "../component/Token/RefreshTokenFunc";
import logo from "../assets/BOOKERLOGO.png";

function Header() {
  let accessToken = localStorage.getItem("accesstoken");
  const navigate = useNavigate();
  const [user, setUser] = useState(false);

  useEffect(() => {
    if (accessToken !== null) {
      setUser(true);
    } else setUser(false);
  }, [accessToken]);
  useEffect(() => {
    userData();
  }, [accessToken]);
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
    localStorage.removeItem("nickname");
    navigator("/");
  };
  const handleModalCancel = () => {
    setOpen(false);
    console.log("close");
  };
  const [imageSrc, setImageSrc] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  async function fetchDataUserData() {
    accessToken = await refreshTokenFunc(navigate);
    userData();
  }
  const userData = async () => {
    await axios
      .get("/api/profileInfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        setImageSrc(response.data.imgURL);
      })
      .catch((error) => {
        console.log(error);
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          fetchDataUserData();
        }
      });
  };
  return (
    <div>
      {user ? (
        <div className="header">
          <Link to="/main" className="logo">
            <img src={logo} alt="로고"></img>
          </Link>
          <div className="user_info">
            <Link to="/mybook" className="header_individual">
              <span>개인 서재</span>
            </Link>
            <Link to="/bookrecommend" className="header_recomend">
              <span>책 추천</span>
            </Link>
            <Link to="/booksale" className="header_place">
              <span>책 거래</span>
            </Link>
            <Link to="/searchpage" className="search">
              <span>책 검색</span>
            </Link>
            <div
              className="user_profile"
              onClick={() => {
                navigate("/profileupdate");
              }}
            >
              <img src={imageSrc} alt="프로필(클릭 시 프로필 수정)"></img>
            </div>
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
            <img src={logo} alt="로고"></img>
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
