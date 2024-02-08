import React from "react";
import { useEffect, useState } from "react";
import { Button } from "@material-ui/core";
import Message from "../assets/message.webp";
import Mybook from "../assets/mybook.jpg";
import Write from "../assets/write.jpg";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    const accessToken = localStorage.getItem("accesstoken");
    if (accessToken) {
      navigate("/main");
      return;
    }
  }, []);
  return (
    <div>
      <div className="banner">
        <div className="bannerContent">
          <div className="textWrap">
            <div className="bannerTitle">
              움직이는 서재
              <br /> 온라인 개인 서재
              <br />
              <span>BOOKER</span>
              <div className="bannerBtnWrap">
                <Button
                  id="bannerLoginbtn"
                  onClick={() => {
                    navigate("/login");
                  }}
                >
                  LOGIN
                </Button>
                <span>아래 기능들은 로그인 후 이용 가능한 서비스 입니다.</span>
              </div>
            </div>
          </div>
          <div className="bookWrap">
            <div className="fir">NOVEL</div>
            <div className="sec">HISTORY</div>
            <div className="thir">LITERATURE</div>
          </div>
        </div>
        <div></div>
      </div>
      <div className="exFirst">
        <div className="exFSection1">
          <span>
            온라인으로
            <br />
            만드는
            <br />
            개인서재
          </span>
          <span></span>
        </div>
        <div className="exFSection2">
          <span></span>
          <span>
            내가 읽었던, 읽고 싶은 책들을
            <br />
            BOOKER로 정리를 한 번에
            <br />
            정리된 책들에 대한 생각도
            <br />
            사람들과 공유해 보세요.
          </span>
        </div>
      </div>
      <div className="exSecond">
        <h1>BOOKER 이용방법</h1>
        <div className="exSection">
          <div>
            <img src={Mybook}></img>
            <h3>개인 서재 책관리</h3>
            <div>
              본인의 개인 서재에 읽고 싶었거나 읽고 있는 중인, 읽었던 책들을
              추가하여 관리하고 팔로잉을 통해서 다른 사람들에게 내 서재를
              공유해보세요
            </div>
          </div>
          <div>
            <img src={Write}></img>
            <h3>독서록 추가</h3>
            <div>
              본인이 읽었던 책 중 인상 깊었던 내용들을 사진과 함께 코멘트를 남겨
              다른 사용자들에게 공유해보세요
            </div>
          </div>
          <div>
            <img src={Message}></img>
            <h3>쪽지</h3>
            <div>
              사용자들은 쪽지를 이용하여 자유롭게 소통하며 책거래도 원할하게
              이루어 질 수 있을 것입니다.
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
