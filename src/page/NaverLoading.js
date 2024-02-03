import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function NaverLoading() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  console.log(code);
  console.log(state);
  useEffect(() => {
    axios
      .post("/api/oauth2/code/naver", {
        code: code,
        state: state,
      })
      .then((response) => {
        if (
          response.data.memberId !== null &&
          response.data.memberId !== undefined
        ) {
          const memberId = response.data.memberId;
          navigate(`/Profile/${memberId}`);
        } else {
          navigate("/Main");
          localStorage.setItem("accesstoken", response.data.accessToken);
          localStorage.setItem("refreshtoken", response.data.refreshToken);
        }
        console.log(response.data);
      })
      .catch((error) => {
        // 에러 처리
      });
  }, []);
  return (
    <div>
      <span>Loading</span>
    </div>
  );
}

export default NaverLoading;
