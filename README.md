# yychoice를 소개합니다!

선택이 고민될 때 사용해보세요!

-   테스트 서버(베타버전): https://yychoice.netlify.app
-   backend repository: https://github.com/kimyoungyin/yychoice__server

## 스택

-   client: Typescript, React, Axios
-   server: Typescript, Express
-   typeORM: Sequelize
-   database: mysql, RDS
-   storage: S3
-   deploy: netlify(client) + ec2(server)

## Architecture

![yychoice구현](https://github.com/kimyoungyin/yychoice__server/assets/78777345/d724aa6c-f4dc-4428-b220-1cbd1ceacb9b)

## 구현 페이지: 반응형(모바일, pc), 다크모드 지원

<details>
  <summary><h4>Home: 전체 혹은 특정 카테고리로 필터링하여 유저들의 고민들을 찾아보세요</h4></summary>
<img width="1440" alt="스크린샷 2023-08-17 오후 5 34 01" src="https://github.com/kimyoungyin/yychoice__client/assets/78777345/26689ca1-7f45-41e1-bc95-00bbcd805d06">

</details>
<details>
  <summary><h4>Upload: 카테고리를 선택/생성하고 고민되는 두 선택지를 (이미지와 함께) 업로드하세요</h4></summary>
<img width="1440" alt="스크린샷 2023-08-17 오후 5 34 12" src="https://github.com/kimyoungyin/yychoice__client/assets/78777345/d0fd7b51-780f-434b-b21c-4fc864845c6c">

</details>
<details>
  <summary><h4>Profile: 계정 정보, 내가 올린 게시물 수, 내가 올린 게시물들을 따로 확인해보세요</h4></summary>
<img width="1440" alt="스크린샷 2023-08-17 오후 5 34 23" src="https://github.com/kimyoungyin/yychoice__client/assets/78777345/f26b1d91-0489-45b5-8baa-fbc67607e2a5">

</details>
<details>
  <summary><h4>Detail: 직접 둘 중 하나의 선택지를 골라 다른 유저의 고민 해결을 도와주세요</h4></summary>
<img width="1440" alt="스크린샷 2023-08-17 오후 5 34 57" src="https://github.com/kimyoungyin/yychoice__client/assets/78777345/7275cb77-e434-4fe2-b776-647af6b02fe5">
</details>

## 추후 구현 예정

-   [ ] 카테고리 검색
-   [ ] 게시물 검색
-   [ ] 전역 state 관리
