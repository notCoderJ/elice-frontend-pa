import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createSearchParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import useFetchApi from '../hooks/useFetchApi';
import { CourseCard, Pagination, ImageBox } from '../components';
import { CardInfo } from '../interface/card';
import { Price } from '../interface/query';
import { COUNT_PER_PAGE } from '../constants';
import { PARAM_LIST, PARAM_TABLE } from '../constants/query';
import { Loading, NoResult } from '../assets/images';

// 스타일 정의부
const BodyContainer = styled.div`
  width: 100%;
`;

const CardInfoArea = styled.div`
  > div:first-child {
    padding: 12px 0;
    border-bottom: 1.25px solid rgb(225, 226, 228);
    font-size: 12px;
    font-weight: 700;
  }
`;

const PaginationArea = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 24px;
`;

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: 4px -8px -6px -8px;

  > div {
    display: flex;
    flex: 1 1 296px;
    max-width: 25%;

    > div {
      width: 100%;
      margin: 8px;
    }

    @media screen and (max-width: 1280px) {
      max-width: 33.3333%;
    }
    @media screen and (max-width: 768px) {
      max-width: 50%;
    }
    @media screen and (max-width: 576px) {
      max-width: 100%;
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  text-align: center;

  > span {
    margin-top: 1.5rem;
    color: rgb(153, 153, 153);
  }
`;

const NoResultContainer = styled(LoadingContainer)`
  height: 231.719px;
`;

interface OrCondition {
  $or: Price[];
}

// 필터 JSON Serialize
const serializeFilter = (query: string) => {
  const conditions: OrCondition[] = [];
  const searchParams = createSearchParams(query);
  PARAM_LIST.forEach((param: string) => {
    if (searchParams.has(param)) {
      conditions.push({
        $or: searchParams
          .getAll(param)
          .map((key: string) => PARAM_TABLE[param][key]),
      });
    }
  });

  return JSON.stringify({
    $and: [{ title: `%${searchParams.get('keyword') || ''}%` }, ...conditions],
  });
};

// 컴포넌트 구현부
function Body() {
  const { search } = useLocation();
  const { isLoading, totalCount, data, fetchApi, cancel } = useFetchApi();
  const [current, setCurrent] = useState(0);
  const last = Math.ceil(totalCount / COUNT_PER_PAGE) - 1;

  const totalPages = useMemo(
    () => (last > -1 ? [...Array(last + 1)].map((_, index) => index + 1) : []),
    [last],
  );

  useEffect(() => {
    setCurrent(0);
  }, [search]);

  useEffect(() => {
    fetchApi('/course/list/', {
      filterConditions: serializeFilter(search),
      offset: current,
    });
    return cancel;
  }, [current, search, fetchApi, cancel]);

  const handleMove = useCallback((_, pageIndex) => {
    setCurrent(pageIndex);
  }, []);

  return (
    <BodyContainer>
      {isLoading ? (
        <LoadingContainer>
          <ImageBox src={Loading} width="180px" height="180px">
            <span role="img" aria-label="loading" />
          </ImageBox>
          <span>
            최고의 코딩 과목으로 곧 찾아뵙겠습니다.
            <br />
            잠시만 기다려 주세요!
          </span>
        </LoadingContainer>
      ) : (
        <div>
          {!data || totalCount === 0 ? (
            <NoResultContainer>
              <ImageBox src={NoResult} width="64px" height="64px">
                <span role="img" aria-label="no result" />
              </ImageBox>
              <span>검색 결과가 없습니다.</span>
            </NoResultContainer>
          ) : (
            <CardInfoArea>
              <div>전체 {totalCount}개</div>
              <CardsContainer>
                {data?.courses.map(
                  ({ title, description, price, logo }: CardInfo, index) => (
                    <div key={`${title}-${index + 1}`}>
                      <CourseCard
                        title={title}
                        description={description}
                        price={price}
                        logo={logo}
                      />
                    </div>
                  ),
                )}
              </CardsContainer>
              {totalCount > COUNT_PER_PAGE && (
                <PaginationArea>
                  <Pagination
                    current={current}
                    last={last}
                    totalPages={totalPages}
                    onMove={handleMove}
                  />
                </PaginationArea>
              )}
            </CardInfoArea>
          )}
        </div>
      )}
    </BodyContainer>
  );
}

export default Body;
