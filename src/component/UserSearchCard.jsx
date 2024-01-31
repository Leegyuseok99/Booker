import React from "react";
import "../css/UserSearchCard.css";

function UserSearchCard(props) {
  return (
    <div className="usc" onClick={props.onClick}>
      <div className="uscImgWrap">
        <img src={props.imgFileDto}></img>
      </div>
      <div className="uscInfoWrap">
        <div className="uscNickname">{props.nickname}</div>
        <div className="uscIntro">{props.intro}</div>
      </div>
    </div>
  );
}
export default UserSearchCard;
