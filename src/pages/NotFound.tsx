import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ErrRoute } from '../assets/images';

// 스타일 정의부
const NotFoundPage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  padding 1.5rem;

  > div:first-child {
      max-width: 26.25rem;
      max-height: 15rem;

    > img {
      width: 100%;
      height: 100%;
    }
  }

  > div:nth-child(2) {
    font-size: 16px;
    font-weight: 700;
    color: rgb(21, 22, 24);
    margin: 1.5rem 0 2rem 0;
  }

  > a {
    display: flex;
    min-width: 5rem;
    height: 2.5rem;
    padding: 0 1rem;
    border: 1px solid rgb(153, 153, 153);
    border-radius: 3px;
    background-color: rgba(0, 0, 0, 0);
    line-height: 2.375rem;
    font-size: 14px;
    font-weight: 700;
    color: rgb(34, 34, 34);

    :hover {
      border-color: #999;
      background-color: hsla(0,0%,60%,.1);
    }
  }
`;

// 컴포넌트 구현부
function NotFound() {
  return (
    <NotFoundPage>
      <div>
        <img src={ErrRoute} alt="error-route" />
      </div>
      <div>페이지를 찾을 수 없습니다.</div>
      <Link to="/">이전 페이지로 가기</Link>
    </NotFoundPage>
  );
}

export default NotFound;
