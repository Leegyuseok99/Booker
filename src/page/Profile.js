import React, { useRef, useState } from "react";
import Category from "../component/Category";
import { TextField } from "@material-ui/core";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import "../css/Profile.css";
import refreshTokenFunc from "../component/Token/RefreshTokenFunc";

function Profile() {
  const navigate = useNavigate();
  const { memberId } = useParams();
  const [nickName, setNickName] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [Image, setImage] = useState("");
  const [previewImage, setPreviewImage] = useState(null);

  const fileInput = useRef(null);
  const onChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      //업로드 취소할 시
      setImage(Image);
      setPreviewImage(null);
      return;
    }
  };
  const habdleNickName = (e) => {
    setNickName(e.target.value);
  };
  const handleIntroduction = (e) => {
    setIntroduction(e.target.value);
  };

  const categoryList = [
    "소설",
    "자기계발",
    "평론",
    "역사",
    "철학",
    "과학",
    "정치/사회",
    "미스터리",
    "판타지",
    "공상과학",
    "로맨스",
    "경제",
    "요리",
    "여행",
    "예술",
    "스포츠",
    "건강/의학",
    "신화/전설",
    "언어",
    "만화",
  ];

  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategorySelect = (categoryName) => {
    if (selectedCategories) {
      if (selectedCategories.length < 5) {
        setSelectedCategories((prevSelected) => {
          const isSelected = prevSelected.includes(categoryName);

          if (isSelected) {
            // 이미 선택된 경우, 해당 카테고리를 리스트에서 제거
            return prevSelected.filter((category) => category !== categoryName);
          } else {
            // 선택되지 않은 경우, 최대 5개까지 추가
            return [...prevSelected, categoryName];
          }
        });
      } else {
        // 이미 5개가 선택된 경우, 선택을 추가하지 않음
        if (!selectedCategories.includes(categoryName)) {
          window.alert("카테고리의 선택 가능 개수는 최대 5개 입니다.");
        }
        setSelectedCategories((prevSelected) =>
          prevSelected.includes(categoryName)
            ? prevSelected.filter((category) => category !== categoryName)
            : prevSelected
        );
      }
    }
  };

  let [nickName_result, setNickname_result] = useState("");
  let [intro_result, setIntro_result] = useState("");
  const onProfilehandle = async (e) => {
    const formData = new FormData();
    formData.append("memberId", memberId);
    if (Image) {
      formData.append("imageFile", Image);
    }
    formData.append("nickname", nickName);
    formData.append("intro", introduction);

    selectedCategories.forEach((value, index) => {
      formData.append(`interestList[${index}]`, value);
    });

    await axios
      .post("/api/profile", formData)
      .then((response) => {
        if (response.data.social === "NORMARL") {
          console.log(response.data);
          window.alert("프로필 설정 완료");
          navigate(response.data.redirect);
        } else {
          localStorage.setItem("accesstoken", response.data.accessToken);
          localStorage.setItem("refreshtoken", response.data.refreshToken);
          localStorage.setItem("nickname", response.data.nickname);
          navigate("/Main");
        }
      })
      .catch((error) => {
        if (error.response.data.code == null) {
          setNickname_result("");
          setIntro_result("");
          const errorKeys = Object.keys(error.response.data);
          const errorValues = [];
          for (const key of errorKeys) {
            errorValues.push(error.response.data[key]);
          }
          errorKeys.forEach((key, index) => {
            switch (key) {
              case "nickname":
                setNickname_result(errorValues[index]);
                break;
              case "intro":
                setIntro_result(errorValues[index]);
                break;
            }
          });
        } else {
          setNickname_result("");
          setNickname_result("이미 사용 중인 닉네임입니다.");
          setIntro_result("");
        }
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          refreshTokenFunc(navigate);
          onProfilehandle(e);
        }
      });
  };
  return (
    <div>
      <div className="profile">
        <div className="profileLeft">
          <div className="profileImg">
            <Avatar
              className="profileImgSelect"
              src={previewImage || Image}
              style={{
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "contain",
              }}
              sx={{ width: 330, height: 330 }}
              onClick={() => {
                fileInput.current.click();
              }}
            />
            <input
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              name="profile_img"
              onChange={onChange}
              ref={fileInput}
            />
          </div>
          <div className="nickName">
            <span>
              <PersonIcon style={{ marginBottom: "-4px" }}></PersonIcon>닉네임
            </span>
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
              error={Boolean(nickName_result)}
              helperText={nickName_result}
            ></TextField>
          </div>
          <div className="introduction">
            <span>
              <StickyNote2Icon
                style={{ marginBottom: "-5px" }}
              ></StickyNote2Icon>
              소개글
            </span>
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
              error={Boolean(intro_result)}
              helperText={intro_result}
            ></TextField>
          </div>
        </div>
        <div className="profileRight">
          <div className="categorySection">
            <span>
              <BookmarksIcon style={{ marginBottom: "-5px" }}></BookmarksIcon>
              관심 분야 선택
            </span>
            <br />
            <span>본인의 관심 카테고리를 알려주세요!</span>
            <div className="categorySelector">
              {categoryList.map((categoryName, index) => (
                <Category
                  key={index}
                  Category={categoryName}
                  onClick={() => handleCategorySelect(categoryName)}
                  isSelected={selectedCategories.includes(categoryName)}
                />
              ))}
            </div>
          </div>
          <div className="categoryTotal">
            <span>선택된 카테고리</span>
            <div className="selectedCategories">
              {selectedCategories.map((category, index) => (
                <Category key={index} Category={category} />
              ))}
            </div>
          </div>
          <div className="proBtnWrap">
            <button className="profile_btn" onClick={onProfilehandle}>
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Profile;
