import { TextField } from "@material-ui/core";
import React from "react";
import { lazy, Suspense, createContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
import axios from "axios";
function Login() {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  // const [idValid, setIdValid] = useState(false);
  // const [pwValid, setPwValid] = useState(false);
  const [notAllow, setNotAllow] = useState(true);

  const handleId = (e) => {
    setId(e.target.value);
  };
  const handlePw = (e) => {
    setPw(e.target.value);
  };

  useEffect(() => {
    if (id && pw) {
      setNotAllow(false);
      return;
    }
    setNotAllow(true);
  }, [id, pw]);
  const loginhandle = async (e) => {
    e.preventDefault();
    localStorage.setItem("accesstoken", "1");
    localStorage.setItem("refreshtoken", "2");
    localStorage.setItem("nickname", "테스트");
    navigate("/Main");
    await axios
      .post("/login", {
        id: id,
        pw: pw,
      })
      .then((response) => {
        localStorage.setItem("accesstoken", response.data.accessToken);
        localStorage.setItem("refreshtoken", response.data.refreshToken);
        localStorage.setItem("nickname", response.data.nickname);
        navigate("/Main");
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error.response.data.resultCode);
        console.log(error.response.data.result);
        setId("");
        setPw("");
        const memberId = error.response.data.memberId;
        const redirectPath = error.response.data.Redirect;
        console.log(`Redirecting to: ${redirectPath}`);
        if (memberId == undefined) {
          navigate(redirectPath);
        } else {
          navigate(`${redirectPath}/${memberId}`);
        }
      });
  };

  return (
    <div>
      <div className="loginContent">
        <div className="titleWrap">
          아이디와 비밀번호를
          <br />
          입력해주세요
        </div>
        <div className="Login">
          <div className="inputWrap">
            <TextField
              className="input"
              label="ID"
              value={id}
              placeholder="ex) lgs2260@naver.com"
              InputProps={{
                disableUnderline: true,
              }}
              onChange={handleId}
            ></TextField>
          </div>

          <div className="inputWrap">
            <TextField
              className="input"
              label="PASSWORD"
              value={pw}
              type="password"
              placeholder="영문,숫자,특수문자 포함 8자 이상"
              InputProps={{
                disableUnderline: true,
              }}
              onChange={handlePw}
            ></TextField>
          </div>
        </div>
        <div className="loginBtnWrap">
          <button
            disabled={notAllow}
            onClick={loginhandle}
            className="login_btn"
          >
            로그인
          </button>
          <button className="login_btn Naver">
            <a href="https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=ecsL5MvzOYbAIc1P0ibw&redirect_uri=http://localhost:3000/Naver_Loading&state=abc123def456gh">
              네이버
            </a>
          </button>
          <button className="login_btn Google">
            <a href="https://accounts.google.com/o/oauth2/v2/auth?client_id=763294776408-sfbjopkckihspia8kjrrdekk3250bg25.apps.googleusercontent.com&redirect_uri=http://localhost:3000/Google_Loading&response_type=code&scope=email profile">
              <img
                className="google"
                src="https://www.google.co.kr/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png"
              ></img>
            </a>
          </button>
        </div>
        <ul className="findWrap">
          <li>
            <Link to="/SignUp" className="SignUp_li">
              회원가입
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Login;
