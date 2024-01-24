import React from "react";
import "../css/BestSellerCard.css";

function BestSellerCaed(props) {
  return (
    <div className="bsc" onClick={props.onClick}>
      <div className="bscImgWrap">
        <img src={props.cover}></img>
      </div>
      <div className="bscInfoWrap">
        <div className="bscTitle">{props.title}</div>
        <div className="bscAuthor">{props.author}</div>
        <div className="bdcDiscriprion">{props.description}</div>
      </div>
    </div>
  );
}
export default BestSellerCaed;
