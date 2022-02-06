import React from 'react';
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartBar } from '@fortawesome/free-solid-svg-icons';
import { CardInfo } from '../interface/card';
import ImageBox from './ImageBox';

// 스타일 정의부
const CardContainer = styled.div`
  width: 296px;
  height: 338px;
  padding: 28px 24px;
  border-radius: 8px;
  background-color: white;

  @media screen and (max-width: 480px) {
    width: 100%;
  }
`;

const TitleGroup = styled.div`
  height: 130px;
  margin-bottom: 1.5rem;
`;

const InfoGroup = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.5rem;
`;

const Label = styled.div`
  height: 1.125rem;
  margin-bottom: 0.5rem;
  font-size: 12px;
  font-weight: bold;
  line-height: normal;
  color: #524fa1;
`;

const ellipsisStyle = css`
  display: -webkit-box;
  line-height: 1.6;
  overflow: hidden;
  overflow-wrap: break-word;
  white-space: normal;
  word-break: keep-all;
  text-overflow: ellipsis;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Title = styled.div`
  height: 3.5rem;
  margin-bottom: 0.5rem;
  color: #222;
  font-size: 18px;
  font-weight: bold;
  ${ellipsisStyle}
`;

const Description = styled.div`
  font-size: 14px;
  color: #5e5f61;
  ${ellipsisStyle}
`;

// TODO: 아이콘 다른거 찾기.
const IconText = styled.ul`
  > li + li {
    margin-top: 0.5rem;
  }

  > li {
    display: flex;
    align-items: center;
    height: 1.5rem;
    font-size: 24px;
    vertical-align: middle;

    > span {
      margin-left: 8px;
      font-size: 12px;
      color: #7d7e80;
    }
  }
`;

// 컴포넌트 구현부
function CourseCard({ title, description, price, logo }: CardInfo) {
  const getPriceLabel = () => {
    switch (price.enroll_type) {
      case 0:
        return price.is_free ? '무료' : '유료';
      case 4:
        return !price.is_free ? '구독' : '';
      default:
        return '';
    }
  };

  return (
    <CardContainer>
      <TitleGroup>
        <Label>{getPriceLabel()}</Label>
        <Title>{title}</Title>
        <Description>{description}</Description>
      </TitleGroup>
      <InfoGroup>
        <IconText>
          <li>
            <FontAwesomeIcon icon={faChartBar} />
            <span>난이도 : 미설정</span>
          </li>
          <li>
            <FontAwesomeIcon icon={faChartBar} />
            <span>수업 : 온라인</span>
          </li>
          <li>
            <FontAwesomeIcon icon={faChartBar} />
            <span>기간 : 무제한</span>
          </li>
        </IconText>
        <ImageBox src={logo} width="52px" height="52px">
          <span role="img" aria-label="course-logo" />
        </ImageBox>
      </InfoGroup>
    </CardContainer>
  );
}

export default CourseCard;
