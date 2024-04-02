## 📘BOOKER(온라인 속 개인 서재) 


![js](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![js](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![js](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![js](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=JavaScript&logoColor=white)

### 📋소개
사용자가 읽고 싶었던, 읽고 있는, 읽었던 책 모두 서재를 정리하듯 BOOKER를 통해 정리해 보세요.

읽었던 책들은 독후감을 작성해서 기록을 남길 수 있으며, 다른 사용자들의 서재를 통해 책을 알아보고 독후감도 공유할 수 있습니다.

----

### 📅프로젝트 기간
2023.12 ~ 2024.2.20 약 2개월 (추후 수정 작업+a)
### 👥개발 인원
2인 팀프로젝트 - FE(1명),BE(1명)
### 📌아키텍처
<img width="830" alt="아키텍쳐" src="https://github.com/Leegyuseok99/Booker/assets/115774339/20091ab7-49a3-4458-b558-65f4b3f34ab5">

### 🛠
+ 소셜 로그인 구현 (네이버, 구글)
+ JWT를 활용한 로그인 인증, 인가 구현
+ 반응형 웹 구현
+ 프로필 설정, 수정(관심 분야 설정으로 비슷한 취향 유저 확인 가능)
+ 개인 서재 페이지 사용자가 추가한 책 무한스크롤로 페이징 처리
+ 팔로우 기능 구현
+ 추천 페이지 [베스트 셀러, 취향이 비슷한 유저](알라딘 API(베스트 셀러) 사용)
+ 쪽지 기능 구현(사용자들은 쪽지를 통해 책 거래 가능)
+ 책, 유저 검색 페이지 구현


----

🗔


**홈 페이지**


<img width="830" alt="image" src="https://github.com/Leegyuseok99/Booker/assets/115774339/d45feb73-942b-4016-91de-425ac6fbee5f">


**로그인**
+ OAuth 프로토콜을 활용하여 구글,네이버 소셜 로그인을 구현하였습니다.

<img width="600" alt="로그인" src="https://github.com/Leegyuseok99/Booker/assets/115774339/0e26f322-5f1d-4bf3-a29e-64ed6ae0154d">


**회원가입**


<img width="600" alt="회원가입" src="https://github.com/Leegyuseok99/Booker/assets/115774339/b964dee3-09fa-4c25-8307-0fd7d68fc9ba">


**프로필 설정**
+ 회원가입 직후 프로필 설정 페이지로 이동하게 됩니다.(만약 프로필을 설정하지 않고 종료한 해당 아이디에 접속할 시에는 프로필 설정 페이지로 이동하게 됨)
+ 프로필 등록 및 수정 관심 분야로 선택할 수 있는 카테고리는 5개로 제한했습니다
  
<img width="830" alt="프로필 설정" src="https://github.com/Leegyuseok99/Booker/assets/115774339/9c225c98-5a16-483f-ada7-83651fe9f6ca">


**로그인 후 페이지**


<img width="830" alt="메인 페이지" src="https://github.com/Leegyuseok99/Booker/assets/115774339/1fd959b9-1907-4fa3-bd64-82333ec472c9">


**개인 서재**
+ 책 목록 정보를 한 번에 전송하면 대량의 트래픽이 발생할 수 있어, 무한 스크롤링을 통해 데이터를 페이지별로 전송하고, 페이지 마지막 부분에 도달했음을 이벤트로 감지하면 추가 데이터를 요청하는 방식으로 구현했습니다.

![bandicam2024-03-1918-49-46-414-ezgif com-video-to-gif-converter (1)](https://github.com/Leegyuseok99/Booker/assets/115774339/482a242d-c098-4133-b966-8bf35a9c9a48)


**책 추천 페이지**
+ 베스트 셀러와 조회된 유저는 페이징 처리하여 무한 스크롤링 적용했습니다.

![bandicam2024-03-1918-56-29-390-ezgif com-video-to-gif-converter (1)](https://github.com/Leegyuseok99/Booker/assets/115774339/4fe61f64-3625-47b0-a666-d1a034ed057b)


**책 상세 페이지**
+ 책에 대한 기본 적인 정보를 제공하고 책을 추가 하여 개인 서재에 저장 가능합니다
+ 독후감 목록을 확인 할 수 있습니다.
+ 독서 현황을 수정할 수 있으며 독서 삭제가 가능합니다.

<img width="830" alt="책 상세 페이지" src="https://github.com/Leegyuseok99/Booker/assets/115774339/e6ef8261-93ec-4c30-b68a-c3e3691e5efe">

**독후감 상세 페이지**


<img width="830" alt="독후감 상세 페이지" src="https://github.com/Leegyuseok99/Booker/assets/115774339/a2e23a90-ac1a-4214-94b9-b5bb8d0d1669">

그 외의 추가 기능은 https://booker.kro.kr/ 에서 확인 가능 합니다.

## 후기
### 👍만족스러웠던 부분
+ JWT를 통해서 토큰의 개념과 인증에 대한 이해를 향상 할 수 있는 경험이었습니다.
+ 무한 스크롤을 구현해 보면서 이벤트와 요소들에 대한 경험과 이해를 높일 수 있었습니다.
+ 반응형 웹을 구현해 보면서 적절한 단위 사용의 중요성을 깨달았습니다.
### 👎아쉬웠던 부분
+ 무한 스크롤이 특정 viewport에서는 작동이 되지 않았던 부분이 아쉬웠습니다.
+ JWT의 accesstoken이 새로고침 시에 localstorage에서 사라지게 되는 문제를 해결하지 못했습니다. 
