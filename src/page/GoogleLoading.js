import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function GoogleLoading() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const code = searchParams.get("code");

  console.log("code: ", code);
  useEffect(() => {
    axios
      .post("/api/oauth2/code/google", {
        code: code,
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
          localStorage.setItem("nickname", response.data.nickname);
        }
        console.log(response.data);
      })
      .catch((error) => {});
  }, []);
  return (
    <div>
      <span>Loading</span>
    </div>
  );
}

export default GoogleLoading;
