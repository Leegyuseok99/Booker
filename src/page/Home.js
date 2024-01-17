import React from "react";
import { useEffect, useState } from "react";
import BestSeller from "../component/BestSeller";
import axios from "axios";
import BestBookModal from "../modals/BestBookModal";
function Home() {
  const [bestSeller, setBestSeller] = useState([
    {
      key: "1",
      cover: "https://gdimg.gmarket.co.kr/681948050/still/400?ver=1704238629",
      title: "누가 내 치즈를 옮겼을까?",
      isbn13: "1111111",
      category: "국내도서> 소설/시/희곡> 이탈리아소설",
      introduction:
        "이 책은 니가 알아서 뭐하게 이 책은 이 책은 이 책은 이 책은이 책은 이 책은 이 책은이 책은 이 책은 이 책은 이 책은이 책은 이 책은 이 책은이 책은 이 책은 이 책은",
    },
    {
      key: "2",
      cover:
        "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788914020406.jpg",
      title: "로빈슨 크루소",
      isbn13: "2222222",
      category: "국내도서> 소설/시/희곡> 프랑스소설",
      introduction:
        "이 책은 이 책은 이 책은 이 책은 이 책은이 책은 이 책은 이 책은이 책은 이 책은 이 책은 이 책은이 책은 이 책은 이 책은이 책은 이 책은 이 책은",
    },
  ]);

  useEffect(() => {
    getBook();
  }, []);

  async function getBook() {
    await axios
      .get("/book/bestseller")
      .then((response) => {
        console.log(response);
        const newBestSeller = response.data.item.map((item) => ({
          isbn13: item.ISBN13,
          title: item.title,
          cover: item.cover,
        }));
        setBestSeller(newBestSeller);
      })
      .catch((error) => {
        console.log(error.config.url);
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

export default Home;
