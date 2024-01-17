import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

function BookRecomend() {
  const [bookList, setBookList] = useState([]);

  useEffect(() => {
    getBook();
  }, []);

  async function getBook() {
    await axios
      .get("/book")
      .then((response) => {
        console.log(response);
        const newBook = response.data.item.map((item) => ({
          isbn13: item.ISBN13,
          title: item.title,
          cover: item.cover,
        }));
        setBookList(newBook);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const bookInfohandle = () => {
    axios
      .post("/", {
        ISBN13: bookList.isbn13,
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div>
      <div>
        {bookList.map((book) => (
          <div>
            <img src={book.cover}></img>
            <span onClick={bookInfohandle}>{book.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
export default BookRecomend;
