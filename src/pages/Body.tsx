import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { CourseCard, Pagination } from '../components';
import useFetchApi from '../hooks/useFetchApi';
import { PARAM_LIST, PARAM_TABLE } from '../constants/query';

interface OrCondition {
  $or: { [key: string]: number | string | boolean }[];
}

// 필터 JSON Serialize
const serializeFilter = (params: URLSearchParams) => {
  const conditions: OrCondition[] = [];
  PARAM_LIST.forEach((param: string) => {
    if (params.has(param)) {
      conditions.push({
        $or: params.getAll(param).map((key: string) => PARAM_TABLE[param][key]),
      });
    }
  });

  return JSON.stringify({
    $and: [{ title: `%${params.get('keyword') || ''}%` }, ...conditions],
  });
};

// 컴포넌트 구현부
function Body() {
  const { search } = useLocation();
  const [searchParams] = useSearchParams(search);
  const { isLoading, data, error, fetchApi, cancelRequest } = useFetchApi();

  // 테스트 로그
  console.log('body');

  useEffect(() => {
    fetchApi('/course/list/', {
      filterConditions: serializeFilter(searchParams),
    });
    return cancelRequest;
  }, [searchParams, fetchApi, cancelRequest]);

  const handleMove = useCallback(
    (_, pageIndex) => {
      fetchApi('/course/list/', {
        filterConditions: serializeFilter(searchParams),
        offset: pageIndex,
      });
    },
    [fetchApi, searchParams],
  );

  // TODO: 구현 중...
  return (
    <div>
      {isLoading && <div>로딩 중...</div>}
      {error && <div>에러 메시지...</div>}
      {!isLoading && !error && (
        <>
          <CourseCard />
          <Pagination totalCount={data?.totalCount || 0} onMove={handleMove} />
        </>
      )}
    </div>
  );
}

export default Body;
