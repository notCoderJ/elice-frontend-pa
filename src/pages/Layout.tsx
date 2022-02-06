import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import { SearchBar, Filter } from '../components';
import { FILTER_OPTIONS } from '../constants/filter';

// 스타일 정의부
const StyledLayout = styled.div`
  width: 1280px;
  margin: auto;
  padding: 24px;

  @media screen and (max-width: 1280px) {
    width: 100%;
  }
`;

const SearchArea = styled.div`
  width: 100%;
  padding: 12px 0;
`;

const FilterArea = styled.div`
  margin-bottom: 0.75rem;
`;

const FilterGroup = styled.div`
  display: flex;
  min-height: 47px;
  border: 1px solid rgb(225, 226, 228);
  background-color: white;

  > div:first-child {
    min-width: 6rem;
    padding: 0.875rem 1rem;
    border-right: 1px solid rgb(225, 226, 228);
    background-color: rgb(249, 250, 252);
    color: rgb(94, 95, 97);
    font-size: 12px;
    font-weight: 700;
    line-height: 1.5;
  }
`;

// 컴포넌트 구현부
function Layout() {
  return (
    <StyledLayout>
      <SearchArea>
        <SearchBar />
      </SearchArea>
      <FilterArea>
        <FilterGroup>
          <div>가격</div>
          <Filter type="price" options={FILTER_OPTIONS.price} />
        </FilterGroup>
      </FilterArea>
      <Outlet />
    </StyledLayout>
  );
}

export default Layout;
