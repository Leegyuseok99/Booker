import axios from "axios";

export const refreshTokenFunc = () => {
  const refreshToken = localStorage.getItem("refreshtoken");
  const result = axios
    .post("/auth/refresh/token", {
      refreshToken: refreshToken,
    })
    .then((response) => {
      localStorage.setItem("accesstoken", response.data.accessToken);
      console.log(localStorage.getItem("accesstoken"));
    })
    .catch((error) => {
      if (error.response.data.code === "INVALID_RefreshToken") {
        window.alert(error.response.data.message);
        navigator("/login");
      }
    });
  return result;
};
