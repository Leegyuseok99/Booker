import React from "react";
import { useEffect, useState } from "react";
import BestSeller from "../component/BestSeller";
import axios from "axios";
import BestBookModal from "../modals/BestBookModal";
import { useNavigate } from "react-router-dom";
function Main() {
  const navigate = useNavigate();
  const [bestSeller, setBestSeller] = useState([]);

  useEffect(() => {
    getBook();
  }, []);

  async function getBook() {
    await axios
      .get("/book/bestseller")
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
      <div className="banner">Img</div>
      <div className="bsContainerTitle">
        이달의 <br />
        베스트 셀러
      </div>
      <div className="bsContainer">
        {bestSeller.map((seller) => (
          <BestSeller
            key={seller.key}
            Rank={seller.key}
            title={seller.title}
            cover={seller.cover}
            author={seller.author}
            description={seller.description}
            category={seller.category}
            onClick={() => bookInfohandle(seller.isbn13)}
          />
        ))}
        {selectedBook && (
          <BestBookModal
            isOpen={isOpen}
            selectedBook={selectedBook} // 선택한 도서 정보를 모달에 전달
            onSubmit={handleModalSubmit}
            onCancle={handleModalCancel}
          />
        )}
      </div>
    </div>
  );
}
export default Main;
