import React from "react";
import "../css/BookListCard.css";

function BookListCard({ cover, onClick }) {
  return (
    <div className="blcWrap" onClick={onClick}>
      <div className="blcImg">
        <img className="img" src={cover} alt="Book Cover" />
      </div>
    </div>
  );
}

export default BookListCard;
