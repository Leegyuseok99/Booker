import React from "react";
import "../css/BookSearchCard.css";

function BookSearchCard(props) {
  return (
    <div className="bsc" onClick={props.onClick}>
      <div className="bscImgWrap">
        <img src={props.cover}></img>
      </div>
      <div className="bscInfoWrap">
        <div className="bscTitle">{props.title}</div>
        <div className="bscplus">
          <div className="bscAuthor">{props.author}</div>
          <div className="bscPublisher">{props.publisher}</div>
        </div>
      </div>
    </div>
  );
}
export default BookSearchCard;
