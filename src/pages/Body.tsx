import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createSearchParams, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import useFetch, {
  FetchReturnType,
  CourseDataType,
  ResponseDataType,
  OptionsType,
} from '../hooks/useFetch';
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

// TODO: issue#27
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

    @media screen and (max-width: 1215.3px) {
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
  justify-content: center;
  align-items: center;
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #00000076;
  z-index: 100;

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

interface CourseInfo {
  totalCount: number;
  courses: CardInfo[];
}

// 코스 카드 데이터 파싱 함수
const parseCourseInfo = (data: ResponseDataType | null): CourseInfo => {
  if (!data) {
    return {
      totalCount: 0,
      courses: [],
    };
  }

  return {
    totalCount: data.course_count,
    courses: data.courses.map((course: CourseDataType) => ({
      title: course.title,
      description: course.short_description,
      price: {
        enroll_type: course.enroll_type,
        is_free: course.is_free,
      },
      logo: course.logo_file_url,
    })),
  };
};

// 마지막 인덱스 반환 함수
const getLastIndex = (totalCount: number): number => {
  return Math.ceil(totalCount / COUNT_PER_PAGE) - 1;
};

// 전체 페이지 번호 변환 함수
const getPageNumbers = (lastIndex: number): number[] => {
  return lastIndex > -1
    ? [...Array(lastIndex + 1)].map((_, index) => index + 1)
    : [];
};

// 컴포넌트 구현부
function Body() {
  const { search } = useLocation();
  const [current, setCurrent] = useState(0);
  const [options, setOptions] = useState<OptionsType | undefined>();
  const { isLoading, data }: FetchReturnType = useFetch(
    '/course/list/',
    options,
  );
  const courseInfo = useMemo(() => parseCourseInfo(data), [data]);
  const last = useMemo(
    () => getLastIndex(courseInfo.totalCount),
    [courseInfo.totalCount],
  );
  const totalPages = useMemo(() => getPageNumbers(last), [last]);

  useEffect(() => {
    setOptions({
      filterConditions: serializeFilter(search),
      offset: current,
    });
  }, [current, search]);

  useEffect(() => {
    setCurrent(0);
  }, [search]);

  const handleMove = useCallback((_, pageIndex) => {
    setCurrent(pageIndex);
  }, []);

  const ChildComponents = {
    noResult: (
      <NoResultContainer>
        <ImageBox src={NoResult} width="64px" height="64px">
          <span role="img" aria-label="no result" />
        </ImageBox>
        <span>검색 결과가 없습니다.</span>
      </NoResultContainer>
    ),
    loading: (
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
    ),
    courseCards: (
      <CardsContainer>
        {courseInfo.courses.map(
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
    ),
    pagination: (
      <Pagination
        current={current}
        last={last}
        totalPages={totalPages}
        onMove={handleMove}
      />
    ),
  };

  if (!isLoading && !data) {
    return ChildComponents.noResult;
  }

  return (
    <BodyContainer>
      <div>
        {isLoading && ChildComponents.loading}
        {data && (
          <CardInfoArea>
            <div>전체 {courseInfo.totalCount}개</div>
            {ChildComponents.courseCards}
            {courseInfo.totalCount > COUNT_PER_PAGE && (
              <PaginationArea>{ChildComponents.pagination}</PaginationArea>
            )}
          </CardInfoArea>
        )}
      </div>
    </BodyContainer>
  );
}

export default Body;
