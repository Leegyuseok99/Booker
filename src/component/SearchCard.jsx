import React from "react";
import "../css/SearchCard.css";

function SearchCard(props) {
  return (
    <div className="sc" onClick={props.onClick}>
      <div className="scImgWrap">
        <img src={props.cover}></img>
      </div>
      <div className="scInfoWrap">
        <div className="scTitle">{props.title}</div>
        <div className="scplus">
          <div className="scAuthor">{props.author}</div>
          <div className="scPublisher">{props.publisher}</div>
        </div>
      </div>
    </div>
  );
}
export default SearchCard;
