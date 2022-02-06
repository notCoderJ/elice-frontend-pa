# 엘리스 프론트엔드 PA

## 기술 스택

<img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white"> <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=white"> <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=React-Router&logoColor=black"> <img src="https://img.shields.io/badge/axios-6F02B5?style=for-the-badge"> <img src="https://img.shields.io/badge/Styled--Components-DB7093?style=for-the-badge&logo=styled-components&logoColor=yellow">

<br/>

## 디렉토리 구조

src  
ㅤ|-- api : api 인스턴트 구현  
ㅤ|-- assets : 이미지 리소스 관리 디렉토리  
ㅤ|-- components : 검색창, 필터, 과목 카드 등 컴포넌트 구현  
ㅤ|-- constants : 컴포넌트, 페이지에서 사용한 상수 정의  
ㅤ|-- hooks : Fetch API 등 커스텀 훅 구현  
ㅤ|-- interface : 컴포넌트, 페이지에서 사용할 인터페이스 정의  
ㅤ|-- pages : 페이지 컴포넌트 구현  
ㅤ|-- style : 글로벌 스타일 및 공통 스타일 정의  
ㅤ|-- types : 커스텀 타입 정의

<br/>

## 요구 기능 요약
<img src=https://user-images.githubusercontent.com/21259498/152674630-44c93169-2705-4030-8c5a-44598306d900.png alt="요구 기능 요약" width=450px height=350px />

<br/>

## 컴포넌트 구상 및 구현 과정

### 1. 컴포넌트 분리
<div align=center>
<img src=https://user-images.githubusercontent.com/21259498/152674517-93f4977b-d82a-494d-a081-240b00fc4b04.png alt="와이어프레임" width=450px height=350px />
<img src=https://user-images.githubusercontent.com/21259498/152674554-309d8fed-7b5b-4f64-b382-97c6facd911c.png alt="컴포넌트 구조" width=450px height=350px />
</div>

주어진 요구사항대로 각 부분을 하나의 컴포넌트로 생각하고 포함관계를 구성했습니다.
모든 기능들이 레이아웃 안에 포함되므로 레이아웃을 최상위 컴포넌트로 설정하였고, 바디 부분에서 페이지 이동이 가능해야하므로 페이지네이션 컴포넌트들 바디 컴포넌트의 자식 컴포넌트로 설정했습니다.

### 2. CORS 에러 우회
개발 시에는 웹팩 개발 서버를 proxy 서버로 사용하여 우회하였고, 이후 제시해주신 크롬 확장팩을 설치하여 api 통신을 확인했습니다.

### 3. 상태관리 및 URL 쿼리 동기화
소규모 과제이므로 별도의 상태 관리 라이브러리를 설치할 필요가 없어 보여 React 자체 Hook을 사용하여 컴포넌트의 상태를 관리했습니다.
UI 상태가 변경되면 React Router의 useSearchParams Hook을 사용하여 현재 조건을 URL에 반영하였고, 새로고침 시 URL에서 쿼리 정보를 파싱해 상태에 반영하여 UI 상태를 유지시켰습니다.

초기 생각은 API 요청에 검색어와 필터 조건을 모두 포함해야 하므로 둘의 상태를 최상위 컴포넌트로 끌어올리고, 상태 변경 시 최상위 컴포넌트에서 URL에 한번에 반영하도록 했습니다.
하지만 이렇게 하니 조건 변경마다 하위 컴포넌트들이 여러번 리렌더링되는 문제가 발생했습니다. 그래서 검색어, 필터 컴포넌트로 상태관리 로직을 분리하였고, 해당 컴포넌트에서 url에 반영하도록 하여 부모 컴포넌트의 상태 변경으로 인한 연쇄적인 리렌더링을 해결했습니다.

### 4. 기능 구현 과정
Search Bar
- 디바운스 기능: useRef 훅을 사용하여 현재 설정한 타이머 id를 저장하고 연속 입력 이벤트 발생 시 해당 타이머를 클리어 후 재설정하도록 했습니다.

Filter
- 버튼 클릭 시 배열에 클릭한 값들의 상태를 저장한 후 URLSearchParams를 사용해 변경 상태를 URL에 반영했습니다.

Body
- API에 카드 정보를 요청하기 위해 URLSearchParams를 사용해 URL에서 쿼리 데이터를 얻은 후 주어진 몽고 디비 요청 형식에 맞게 파싱한 후 요청했습니다.
- axios를 사용해 API 요청이나 컴포넌트 언마운트 시 이전 요청을 취소하도록 하여 연속적인 데이터 요청으로 인한 race condition 문제와 컴포넌트 언마운트로 발생하는 메모리 leak을 방지했습니다.
- REST API 응답에 따라 과목 카드 컴포넌트나 결과 없음 이미지를 조건부 랜더링하여 진행 상황을 표시했습니다.
- Body 컴포넌트에서 현재 페이지 인덱스의 상태를 관리하여 페이지 이동 시 조건부 랜더링으로 페이지네이션 컴포넌트가 언마운트되며 발생하는 인덱스 초기화 문제를 해결했습니다. 
- 페이지 이동으로 API 요청 시 현재 페이지의 인덱스를 offset으로 전달하여 해당 페이지에 맞는 데이터를 요청하도록 했습니다.

Pagination
- 페이지 지정 선택 시 이벤트 핸들러에서 해당 페이지 번호를 콜백함수로 전달하여 현재 페이지 인덱스를 갱신하였고, 페이지가 갱신되면 useEffect 훅에서 API를 요청하도록 했습니다.
- Arrow 버튼으로 페이지 이동 시 현재 페이지 인덱스와 시작, 끝 페이지 인덱스를 비교하여 버튼을 비활성화했습니다.
- 양옆에 최대 4개의 페이지가 표시되게 하기 위해 현재 페이지 인덱스와 시작, 끝 페이지 인덱스 간 차이를 계산하여 4이상인 경우 연속된 4개만 표시하도록 했습니다.
- 페이지 이동 시 React Router의 Link를 사용할 경우 변경사항 없는 검색창, 필터 컴포넌트까지 리랜더링되는 문제가 있어 href 속성을 제거한 a태그를 사용하여 부모 컴포넌트(Body)까지로 리랜더링 범위를 축소했습니다.
- href 속성을 제거한 a태그의 경우 nvda와 같은 스크린 리더가 감지하지 못하므로 사용자 접근성 향상을 위해 tabindex와 aria 속성을 추가했습니다.
