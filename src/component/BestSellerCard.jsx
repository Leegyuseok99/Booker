import React from "react";
import "../css/BestSellerCard.css";

function BestSellerCaed(props) {
  return (
    <div className="bestsc" onClick={props.onClick}>
      <div className="bestscImgWrap">
        <img src={props.cover}></img>
      </div>
      <div className="bestscInfoWrap">
        <div className="bestscTitle">{props.title}</div>
        <div className="bestscAuthor">{props.author}</div>
        <div className="bestdcDiscriprion">{props.description}</div>
      </div>
    </div>
  );
}
export default BestSellerCaed;
