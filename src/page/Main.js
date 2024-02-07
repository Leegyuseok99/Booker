import React from "react";
import { useEffect, useState } from "react";
import BestSeller from "../component/BestSeller";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "../css/Main.module.css";
import refreshTokenFunc from "../component/Token/RefreshTokenFunc";
import bannerimg from "../assets/mainbanner.jpg";
function Main() {
  const navigate = useNavigate();
  const [bestSeller, setBestSeller] = useState([]);
  let accessToken = localStorage.getItem("accesstoken");

  useEffect(() => {
    if (!accessToken) {
      navigate("/home");
      return;
    }
    getBook();
  }, []);

  async function fetchDataGetBook() {
    accessToken = await refreshTokenFunc(navigate);
    getBook();
  }
  async function getBook() {
    await axios
      .get("/api/book/bestseller")
      .then((response) => {
        console.log(response);
        const newBestSeller = response.data.bestSellerList.map((item) => ({
          isbn13: item.isbn13,
          title: item.title,
          cover: item.cover,
          author: item.author,
          description: item.description,
          category: item.category,
        }));
        setBestSeller(newBestSeller);
      })
      .catch((error) => {
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          fetchDataGetBook();
        }
      });
  }
  const handleBookReasonClick = (isbn13) => {
    navigate(`/bookinfo/${isbn13}/null`);
  };
  return (
    <div>
      <div className={styles.banner}>
        <div className={styles.bannerLeft}>
          <div>BOOKER</div>
          <div>ONLINE Library Platform.</div>
          <div>온라인 개인 서재 플랫폼 BOOKER</div>
        </div>
        <div className={styles.bnImgWrap}>
          <img src={bannerimg}></img>
        </div>
      </div>
      <div className={styles.bsContainerTitle}>
        이달의 <br />
        베스트 셀러
      </div>
      <div className={styles.bsContainer}>
        {bestSeller.map((seller) => (
          <BestSeller
            key={seller.isbn13}
            title={seller.title}
            cover={seller.cover}
            author={seller.author}
            description={seller.description}
            category={seller.category}
            onClick={() => handleBookReasonClick(seller.isbn13, null)}
          />
        ))}
      </div>
    </div>
  );
}
export default Main;
