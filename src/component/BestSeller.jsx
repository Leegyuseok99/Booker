import React from "react";
import "../css/BestSeller.css";

function BestSeller(props) {
  return (
    <div className="bsCard">
      <div className="bsCardContent">
        <div className="bsImgWrap">
          <img src={props.cover} onClick={props.onClick}></img>
        </div>
        <div className="bsTitleWrap">
          <span>{props.title}</span>
        </div>
      </div>
    </div>
  );
}
export default BestSeller;
