import React, { useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { OptionItems } from '../interface/filter';
import Button from './Button';

// 스타일 정의부
const FilterContainer = styled.div`
  padding: 0 8px;
`;

// 컴포넌트 구현부
interface FilterProps {
  readonly type: string;
  readonly options: OptionItems[];
}

function Filter({ type, options }: FilterProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredList, setFilteredList] = useState(
    new Set(searchParams.getAll(type)),
  );

  const handleChange = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLButtonElement;
      if (target.tagName !== 'BUTTON') {
        return;
      }

      const newFilterList = filteredList.has(target.value)
        ? [...filteredList].filter((item) => item !== target.value)
        : [...filteredList, target.value];

      setFilteredList(() => new Set(newFilterList));
      searchParams.delete(type);
      newFilterList.forEach((value) => {
        searchParams.append(type, value);
      });
      setSearchParams(searchParams);
    },
    [type, searchParams, filteredList, setSearchParams],
  );

  return (
    <FilterContainer onClick={handleChange}>
      {options.map(({ label, value }: OptionItems) => (
        <Button
          key={label}
          activate={filteredList.has(value)}
          type="button"
          value={value}
        >
          {label}
        </Button>
      ))}
    </FilterContainer>
  );
}

export default Filter;
