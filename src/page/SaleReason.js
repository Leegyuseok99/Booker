import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../css/SaleReason.module.css";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import SaleUser from "../component/SaleUser";
import refreshTokenFunc from "../component/Token/RefreshTokenFunc";

function SaleReason() {
  const navigate = useNavigate();
  const location = useLocation();
  const search = location.state?.search;
  const accessToken = localStorage.getItem("accesstoken");
  const { isbn13 } = useParams();
  const [posUserList, setPosUserList] = useState([]);
  const salePosUser = async () => {
    await axios
      .get("/book/saleState", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          isbn13: isbn13,
        },
      })
      .then((response) => {
        const otherUser = response.data.salePosMembers.map((user) => ({
          profileId: user.profileId,
          nickname: user.nickname,
          image: `data:${user.imgFileDto.mimeType};base64, ${user.imgFileDto.base64Image}`,
          intro: user.intro,
        }));
        setPosUserList(otherUser);
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
  useEffect(() => {
    salePosUser();
  }, []);
  const handleUserClick = (profileId) => {
    navigate(`/subuserbook/${profileId}`);
  };
  return (
    <div>
      <div className={styles.searchWrap}>
        <span>"{search}"의 검색 결과</span>
      </div>
      <div className={styles.reasonWrap}>
        {posUserList.map((posuser) => (
          <SaleUser
            image={posuser.image}
            nickname={posuser.nickname}
            intro={posuser.intro}
            profileId={posuser.profileId}
            onClick={() => handleUserClick(posuser.profileId)}
          ></SaleUser>
        ))}
      </div>
    </div>
  );
}
export default SaleReason;
