import React from "react";
import "../css/SimilarUser.css";

function SimilarUser(props) {
  console.log("profileimage=", props.profileimage);
  return (
    <div className="smu" onClick={props.onClick}>
      <div className="smuProfileWrap">
        <img src={props.profileimage}></img>
      </div>
      <div className="smuInfoWrap">
        <div className="smuNickname">{props.nickname}</div>
        <div className="smuFavoriteWrap">
          {props.interests.map((interest, idx) => (
            <div key={idx} className="smuFavorite">
              {interest}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
export default SimilarUser;
