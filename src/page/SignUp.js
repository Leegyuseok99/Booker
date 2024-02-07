import { TextField } from "@material-ui/core";
import React from "react";
import { lazy, Suspense, createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/SignUp.css";

function SignUp() {
  const navigate = useNavigate();
  /*회원 정보*/
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [pwCheck, setPwCheck] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [notAllow, setNotAllow] = useState(true);

  const handleId = (e) => {
    setId(e.target.value);
  };
  const handlePw = (e) => {
    setPw(e.target.value);
  };
  const handlePwCheck = (e) => {
    setPwCheck(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleName = (e) => {
    setName(e.target.value);
  };
  const handleBirth = (e) => {
    let inputValue = e.target.value;

    // 입력된 텍스트를 형식에 맞게 수정
    inputValue = inputValue.replace(/[^0-9-]/g, ""); // 숫자와 '-' 이외의 문자 제거

    // 생년월일 형식에 맞게 추가
    if (inputValue.length >= 5 && inputValue.charAt(4) !== "-") {
      inputValue = inputValue.slice(0, 4) + "-" + inputValue.slice(4);
    }

    if (inputValue.length >= 8 && inputValue.charAt(7) !== "-") {
      inputValue = inputValue.slice(0, 7) + "-" + inputValue.slice(7);
    }

    setBirth(inputValue);
  };

  //비밀번호 확인
  const hasNotPwSame = (passwordEntered) => (pw != pwCheck ? true : false);

  let [id_result, setId_result] = useState("");
  let [pw_result, setPw_result] = useState("");
  let [name_result, setName_result] = useState("");
  let [email_result, setEmail_result] = useState("");
  let [birth_result, setBirth_result] = useState("");

  //확인 버튼 활성화
  useEffect(() => {
    if (id && pw && pwCheck && email && name && birth) {
      setNotAllow(false);
      return;
    }
    setNotAllow(true);
  }, [id, pw, pwCheck, email, name, birth]);

  const onSubmithandle = async (e) => {
    e.preventDefault();
    await axios
      .post("/signup", {
        id: id,
        pw: pw,
        email: email,
        name: name,
        birth: birth,
      })
      .then((response) => {
        window.alert("회원가입 완료");
        const memberId = response.data.memberId;
        navigate(`/Profile/${memberId}`);
        setId("");
        setPw("");
        setEmail("");
        setName("");
        setBirth("");
      })
      .catch((error) => {
        console.log(error.response.data);
        if (error.response.data.code == null) {
          setId_result("");
          setPw_result("");
          setName_result("");
          setEmail_result("");
          setBirth_result("");
          const errorKeys = Object.keys(error.response.data);
          const errorValues = [];
          for (const key of errorKeys) {
            errorValues.push(error.response.data[key]);
          }
          errorKeys.forEach((key, index) => {
            switch (key) {
              case "id":
                setId_result(errorValues[index]);
                break;
              case "pw":
                setPw_result(errorValues[index]);
                break;
              case "name":
                setName_result(errorValues[index]);
                break;
              case "email":
                setEmail_result(errorValues[index]);
                break;
              default:
                setBirth_result(errorValues[index]);
                break;
            }
          });
        } else {
          setId("");
          setId_result("이미 사용 중인 아이디입니다.");
          setPw_result("");
          setName_result("");
          setEmail_result("");
          setBirth_result("");
        }
      });
  };
  return (
    <div className="signUpContent">
      <div className="titleWrap">
        회원가입
        <br />
        정보를 입력해 주세요
      </div>
      <div className="SingUp">
        <div className="inputWrap">
          <TextField
            className="input"
            label="ID"
            value={id}
            placeholder="ID 입력"
            InputProps={{
              disableUnderline: true,
            }}
            autoComplete="currentID"
            onChange={handleId}
            error={Boolean(id_result)}
            helperText={id_result}
          ></TextField>
        </div>

        <div className="inputWrap">
          <TextField
            error={Boolean(pw_result)}
            helperText={pw_result}
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

        <div className="inputWrap">
          <TextField
            error={hasNotPwSame("pwCheck")}
            helperText={
              hasNotPwSame("pwCheck")
                ? "입력하신 비밀번호가 일치하지 않습니다."
                : null
            }
            className="input"
            label="PASSWORD *"
            value={pwCheck}
            type="password"
            placeholder="비밀번호 확인"
            InputProps={{
              disableUnderline: true,
            }}
            onChange={handlePwCheck}
          ></TextField>
        </div>

        <div className="inputWrap">
          <TextField
            error={Boolean(email_result)}
            helperText={email_result}
            className="input"
            label="Email"
            value={email}
            type="Email"
            placeholder="비밀번호 분실 시 확인용 이메일"
            InputProps={{
              disableUnderline: true,
            }}
            onChange={handleEmail}
          ></TextField>
        </div>
        <div className="inputWrap">
          <TextField
            className="input"
            label="Name"
            value={name}
            type="text"
            placeholder="이름"
            InputProps={{
              disableUnderline: true,
            }}
            onChange={handleName}
            error={Boolean(name_result)}
            helperText={name_result}
          ></TextField>
        </div>

        <div className="inputWrap">
          <TextField
            error={Boolean(birth_result)}
            helperText={birth_result}
            className="input"
            label="Birth"
            value={birth}
            type="text"
            placeholder="생년월일 8자리"
            maxLength
            InputProps={{
              disableUnderline: true,
            }}
            inputProps={{
              maxLength: 10,
            }}
            onChange={handleBirth}
          ></TextField>
        </div>
        <button
          disabled={notAllow}
          onClick={onSubmithandle}
          className="signUp_btn"
        >
          확인
        </button>
      </div>
    </div>
  );
}
export default SignUp;
