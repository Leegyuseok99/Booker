import React from "react";
import { useEffect, useState } from "react";
import BestSeller from "../component/BestSeller";
import axios from "axios";
import BestBookModal from "../modals/BestBookModal";
import Computer from "../assets/computer.jpg";
function Home() {
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    getBook();
  }, []);

  async function getBook() {
    await axios
      .get("/api/book/bestseller")
      .then((response) => {
        console.log(response);
        const newBestSeller = response.data.bestSellerList.map((item) => ({
          isbn13: item.isbn13,
          title: item.title,
          cover: item.cover,
          author: item.author,
          description: item.description,
          category: item.category,
        }));
        setBestSeller(newBestSeller);
      })
      .catch((error) => {
        console.log(error);
      });
  }
  const [selectedBook, setSelectedBook] = useState(null); // 선택한 도서 정보 저장 상태 추가
  const [isOpen, setOpen] = useState(false);

  const bookInfohandle = (isbn13) => {
    // 선택한 도서 정보를 저장
    const selectedBookInfo = bestSeller.find((book) => book.isbn13 === isbn13);
    setSelectedBook(selectedBookInfo);
    modalOpenhandle(); // 모달 열기
  };

  const modalOpenhandle = () => {
    setOpen(true);
  };
  const handleModalSubmit = () => {
    // 모달1 비지니스 로직
    setOpen(false);
  };
  const handleModalCancel = () => {
    setOpen(false);
  };

  return (
    <div>
      <div className="banner">
        <div className="bannerImgWrap">
          <img src={Computer}></img>
        </div>
      </div>
    </div>
  );
}

export default Home;
