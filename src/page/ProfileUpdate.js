import React, { useEffect, useRef, useState } from "react";
import Category from "../component/Category";
import { TextField } from "@material-ui/core";
import Avatar from "@mui/material/Avatar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import PersonIcon from "@mui/icons-material/Person";
import StickyNote2Icon from "@mui/icons-material/StickyNote2";
import BookmarksIcon from "@mui/icons-material/Bookmarks";
import styles from "../css/ProfileUpdate.module.css";
import refreshTokenFunc from "../component/Token/RefreshTokenFunc";

function ProfileUpdate() {
  const navigate = useNavigate();
  let accessToken = localStorage.getItem("accesstoken");
  //refreshtoken으로 accesstoken 재발급

  //기존 프로필 정보 가져오기
  const [imageSrc, setImageSrc] = useState("");
  const [interests, setInterests] = useState([]);
  const [userData, setUserData] = useState({
    nickname: "",
    intro: "",
    defaultImg: false,
  });

  async function fetchDataGetProfile() {
    accessToken = await refreshTokenFunc(navigate);
    getProfile();
  }
  const getProfile = async () => {
    axios
      .get("/profileInfo", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        // Spring에서 받은 Base64 문자열
        setImageSrc(response.data.imgURL);
        const nickname = response.data.nickname;
        const intro = response.data.intro;
        setInterests(response.data.interets);
        setUserData({ ...userData, nickname, intro });
      })
      .catch((error) => {
        const tokenErr = error.response.data.code;
        if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
          navigate("/login");
        } else if (tokenErr === "JwtTokenExpired") {
          fetchDataGetProfile();
        }
      });
  };
  useEffect(() => {
    getProfile();
  }, []);
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
  const handleButtonClick = () => {
    fileInput.current.click();
    setIsDefaultImage(false);
  };
  const habdleNickName = (e) => {
    setUserData({
      ...userData,
      nickname: e.target.value,
    });
  };
  const handleIntroduction = (e) => {
    setUserData({
      ...userData,
      intro: e.target.value,
    });
  };

  const categoryList = [
    "백과사전",
    "수필집",
    "시집",
    "철학",
    "경제/경영",
    "정치",
    "수학",
    "천문학",
    "만화",
    "언어",
    "백과사전1",
    "수필집1",
    "시집1",
    "철학1",
    "경제/경영1",
    "정치1",
    "수학1",
    "천문학1",
    "만화1",
    "언어1",
  ];

  const [selectedCategories, setSelectedCategories] = useState(interests);
  useEffect(() => {
    // interests 배열이 변경될 때 selectedCategories를 업데이트
    setSelectedCategories(interests);
  }, [interests]);

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
  const handleImageReset = () => {
    setIsDefaultImage(true);
    setUserData({
      ...userData,
      defaultImg: true,
      image: null,
    });
    setPreviewImage(null);
  };
  const [isDefaultImage, setIsDefaultImage] = useState(false);
  async function fetchDataOnProfilehandle(e) {
    accessToken = await refreshTokenFunc(navigate);
    onProfilehandle(e);
  }
  let [intro_result, setIntro_result] = useState("");
  const onProfilehandle = async (e) => {
    const formData = new FormData();
    console.log(userData.intro);
    console.log(selectedCategories);
    if (Image) {
      formData.append("imageFile", Image);
    }
    formData.append("intro", userData.intro);

    selectedCategories.forEach((value, index) => {
      formData.append(`interestList[${index}]`, value);
    });
    formData.append("defaultImg", userData.defaultImg);
    if (userData.defaultImg === false) {
      if (previewImage !== null) {
        formData.append("imageFile", Image);
      }
    }
    await axios
      .patch("/profileInfo", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        window.alert("프로필 수정 완료");
        window.location.replace("/main");
      })
      .catch((error) => {
        const tokenErr = error.response.data.code;
        if (tokenErr != undefined) {
          if (tokenErr === "NotContationToken" || tokenErr === "JwtException") {
            navigate("/login");
          } else if (tokenErr === "JwtTokenExpired") {
            fetchDataOnProfilehandle(e);
          }
        } else {
          if (error.response.data.code == null) {
            setIntro_result("");
            const errorKeys = Object.keys(error.response.data);
            const errorValues = [];
            for (const key of errorKeys) {
              errorValues.push(error.response.data[key]);
            }
            errorKeys.forEach((key, index) => {
              switch (key) {
                case "intro":
                  setIntro_result(errorValues[index]);
                  break;
              }
            });
          }
        }
      });
  };
  return (
    <div>
      <div className={styles.profile}>
        <div className={styles.profileLeft}>
          <div className={styles.profileImg}>
            {isDefaultImage ? (
              <div className={styles.defaultImgWrap}>
                <span>기본 이미지로 설정</span>
              </div>
            ) : (
              <Avatar
                className={styles.profileImgSelect}
                src={previewImage ? previewImage : imageSrc}
                style={{
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "contain",
                }}
                sx={{ width: 260, height: 260 }}
                onClick={handleButtonClick}
              />
            )}
            <input
              type="file"
              style={{ display: "none" }}
              accept="image/*"
              name="profile_img"
              onChange={onChange}
              ref={fileInput}
            />
          </div>
          <div className={styles.puInputImg}>
            <button className={styles.pufile_btn} onClick={handleButtonClick}>
              파일 선택
            </button>
            <button className={styles.pufile_btn} onClick={handleImageReset}>
              기본 이미지 설정
            </button>
          </div>
          <div className={styles.nickName}>
            <span>
              <PersonIcon style={{ marginBottom: "-4px" }}></PersonIcon>닉네임
            </span>
            <br />
            <span>사용자님의 닉네임을 작성해주세요.</span>
          </div>
          <div className={styles.pro_inputWrap}>
            <TextField
              disabled
              className={styles.input}
              label="NICKNAME"
              value={userData.nickname}
              type="text"
              placeholder="사용하실 닉네임을 입력해주세요"
              InputProps={{
                disableUnderline: true,
              }}
              onChange={habdleNickName}
            ></TextField>
          </div>
          <div className={styles.introduction}>
            <span>
              <StickyNote2Icon
                style={{ marginBottom: "-5px" }}
              ></StickyNote2Icon>
              소개글
            </span>
            <br />
            <span>본인을 소개하는 간단한 소개글을 작성해주세요.</span>
          </div>
          <div className={styles.pro_inputWrap}>
            <TextField
              className={styles.input}
              label="INTRODUCTION"
              value={userData.intro}
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
        <div className={styles.profileRight}>
          <div className={styles.categorySection}>
            <span>
              <BookmarksIcon style={{ marginBottom: "-5px" }}></BookmarksIcon>
              관심 분야 선택
            </span>
            <br />
            <span>본인의 관심 카테고리를 알려주세요!</span>
            <div className={styles.categorySelector}>
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
          <div className={styles.categoryTotal}>
            <span>선택된 카테고리</span>
            <div className={styles.selectedCategories}>
              {selectedCategories.map((category, index) => (
                <Category key={index} Category={category} />
              ))}
            </div>
          </div>
          <div className={styles.proBtnWrap}>
            <button className={styles.profile_btn} onClick={onProfilehandle}>
              확인
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProfileUpdate;
