import React from "react";
import { useEffect, useState } from "react";
import BestSeller from "../component/BestSeller";
import axios from "axios";
import BestBookModal from "../modals/BestBookModal";
import { useNavigate } from "react-router-dom";
function Main() {
  const navigate = useNavigate();
  const [bestSeller, setBestSeller] = useState([
    {
      isbn13: "9788901276533",
      title:
        "나는 메트로폴리탄 미술관의 경비원입니다 - 경이로운 세계 속으로 숨어버린 한 남자의 이야기",
      cover:
        "https://image.aladin.co.kr/product/32892/38/coversum/8901276534_2.jpg",
      author: "패트릭 브링리 (지은이), 김희정, 조현주 (옮긴이)",
      publisher: "웅진지식하우스",
      category: "국내도서>에세이>외국에세이",
      description:
        "뉴욕 메트로폴리탄 미술관에서 경비원으로 근무했던 패트릭 브링리의 독특하면서도 지적인 회고를 담은 에세이다. 가족의 죽음으로 고통 속에 웅크리고 있던 한 남자가 미술관에서 10년이라는 시간을 보내며 상실감을 극복하고 마침내 세상으로 나아갈 힘을 얻는 여정을 섬세하게 그려냈다.",
    },
    {
      isbn13: "9791171253128",
      title: "푸바오, 언제나 사랑해",
      cover:
        "https://image.aladin.co.kr/product/33226/88/coversum/k452937057_2.jpg",
      author:
        "강철원(에버랜드 동물원) (지은이), 류정훈(에버랜드 커뮤니케이션 그룹) (사진)",
      publisher: "시공주니어",
      category: "국내도서>에세이>사진/그림 에세이",
      description:
        "국내 탄생 1호 아기 판다로 우리에게 큰 기쁨을 주었던 푸바오가 이제 새로운 여정을 준비한다. 《아기 판다 푸바오》가 푸바오의 탄생을, 《푸바오, 매일매일 행복해》가 푸바오의 성장을 다루었다면, 《푸바오, 언제나 사랑해》는 푸바오가 한국에서 보내는 마지막 1년의 시간을 담고 있다.",
    },
    {
      isbn13: "9791140707492",
      title:
        "처음부터 시작하는 주식투자 단타전략 - 15만 원으로 10억 만든 실전투자대회 1위 수상자의 필승 트레이딩 공식",
      cover:
        "https://image.aladin.co.kr/product/33034/23/coversum/k912937580_1.jpg",
      author: "홍인기 (지은이)",
      publisher: "길벗",
      category: "국내도서>경제경영>재테크/투자>주식/펀드",
      description:
        "카카오TV, 넷플릭스 방영 &lt개미는 오늘도 뚠뚠&gt 전 챕터 최고 수익률 133%, MZ세대 대왕개미의 투자법. 여의도 제도권 취업보다 전업투자를 선택하게 만든 안전한 주식 단기 매매 공식을 담은 책이다.",
    },
    {
      isbn13: "9788917239508",
      title:
        "ETS 토익 정기시험 기출문제집 1000 Vol. 4 Reading (리딩) - 토익 기출문제 독점출간/ ALL NEW 최신기출 10회 수록/ 문제집+해설집+무료 동영상 강의+기출어휘 단어장(PDF)+APP 모바일 학습",
      cover:
        "https://image.aladin.co.kr/product/33010/94/coversum/8917239501_1.jpg",
      author: "ETS (엮은이)",
      publisher: "(주)YBM(와이비엠)",
      category: "국내도서>외국어>토익>Reading",
      description:
        "정기시험 최신 기출문제 10세트가 수록되어 있다. 시험에 나온 최신 기출문제로 실전 감각을 키워 시험에 확실하게 대비할 수 있다. 교재 내 QR코드는 해당 회차의 무료 동영상 강의로 연결된다. 오답률 높은 고난도 문항을 친절한 해설 강의와 함께 수록하였다.",
    },
    {
      isbn13: "9791168473690",
      title: "세이노의 가르침 (70만 부 기념 빨간 표지) - 피보다 진하게 살아라",
      cover:
        "https://image.aladin.co.kr/product/30929/51/coversum/s302832892_3.jpg",
      author: "세이노(SayNo) (지은이)",
      publisher: "데이원",
      category: "국내도서>자기계발>성공>성공학",
      description:
        "2000년부터 발표된 그의 주옥같은 글들. 독자들이 자발적으로 만든 제본서는 물론, 전자책과 앱까지 나왔던 《세이노의 가르침》이 드디어 전국 서점에서 독자들을 마주한다. 여러 판본을 모으고 저자의 확인을 거쳐 최근 생각을 추가로 수록하였다. 정식 출간본에만 추가로 수록된 글들은 목차와 본문에 별도 표시하였다.",
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
