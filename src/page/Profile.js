import React, { useState } from "react";
import Category from "../component/Category";
import { TextField } from "@material-ui/core";
import "../css/Profile.css";

function Profile() {
  const [nickName, setNickName] = useState("");
  const [introduction, setIntroduction] = useState("");

  const habdleNickName = (e) => {
    setNickName(e.target.value);
  };
  const handleIntroduction = (e) => {
    setIntroduction(e.target.value);
  };

  const categoryList = [
    "comic",
    "documentary",
    "hero",
    "science fantasy",
    "black comedy",
  ];
  return (
    <div>
      <div className="profile">
        <div className="profileLeft">
          <div className="profileImg"></div>
          <div className="nickName">
            <span>닉네임</span>
            <br />
            <span>사용자님의 닉네임을 작성해주세요.</span>
          </div>
          <div className="pro_inputWrap">
            <TextField
              className="input"
              label="NICKNAME"
              value={nickName}
              type="text"
              placeholder="사용하실 닉네임을 입력해주세요"
              InputProps={{
                disableUnderline: true,
              }}
              onChange={habdleNickName}
            ></TextField>
          </div>
          <div className="introduction">
            <span>소개글</span>
            <br />
            <span>본인을 소개하는 간단한 소개글을 작성해주세요.</span>
          </div>
          <div className="pro_inputWrap">
            <TextField
              className="input"
              label="INTRODUCTION"
              value={introduction}
              type="text"
              placeholder="본인을 소개하는 간단한 글 작성해주세요."
              InputProps={{
                disableUnderline: true,
              }}
              onChange={handleIntroduction}
            ></TextField>
          </div>
        </div>
        <div className="profileRight">
          <div className="categorySection">
            <span>관심 분야 선택</span>
            <br />
            <span>본인의 관심 카테고리를 알려주세요!</span>
            <div className="categorySelector">
              {categoryList.map((categoryName, index) => (
                <Category key={index} Category={categoryName} />
              ))}
            </div>
          </div>
          <div className="categoryTotal"></div>
        </div>
      </div>
    </div>
  );
}
export default Profile;
