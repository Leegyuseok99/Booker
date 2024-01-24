import React from "react";
import "../css/BookListCard.css";

function BookListCard({ cover, bookId, isbn13, progress, onClick }) {
  return (
    <div className="blcWrap" onClick={onClick}>
      <div className="blcImg">
        <img className="img" src={cover} alt="Book Cover" />
      </div>
    </div>
  );
}

export default BookListCard;
