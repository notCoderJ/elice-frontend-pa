import React, { useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

// 스타일 정의부
interface TextboxProps {
  activate: boolean;
}

const Textbox = styled.div<TextboxProps>`
  display: flex;
  width: 100%;
  height: 46px;
  border: solid 1px
    ${(props) => (props.activate ? 'rgb(82, 79, 161)' : 'rgb(201, 202, 204)')};
  border-radius: 4px;
  background-color: white;

  > div:first-child {
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 16px;
    color: ${(props) =>
      props.activate ? 'rgb(82, 79, 161)' : 'rgb(34, 34, 34)'};
  }

  > input {
    width: 100%;
    border: none;
    background-color: transparent;

    ::placeholder {
      margin: 12px 0;
      color: gray;
    }
  }
`;

// Debounce Hook 구현부
interface DebounceHook {
  (func: (e: string) => void, delay: number): (e: string) => void;
}

const useDebounce = (): DebounceHook => {
  const timerId = useRef<number | undefined>(undefined);
  return (func, delay) => (keyword: string) => {
    clearTimeout(timerId.current);
    timerId.current = window.setTimeout(() => func(keyword), delay);
  };
};

// 컴포넌트 구현부
function SearchBar() {
  const { search } = useLocation();
  const [searchParams, setSearchParams] = useSearchParams(search);
  const [inputVal, setInputVal] = useState(searchParams.get('keyword') || '');
  const [activate, setActivate] = useState(false);
  const debounce: DebounceHook = useDebounce();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
    debounce((keyword: string) => {
      searchParams.set('keyword', keyword);
      setSearchParams(searchParams);
    }, 300)(e.target.value);
  };

  // 리렌더링 테스트 로그
  console.log('search bar');

  return (
    <Textbox activate={activate}>
      <div>
        <FontAwesomeIcon icon={faSearch} />
      </div>
      <input
        type="text"
        placeholder="배우고 싶은 언어, 기술을 검색해 보세요"
        value={inputVal}
        onChange={handleChange}
        onFocus={() => setActivate(true)}
        onBlur={() => setActivate(false)}
      />
    </Textbox>
  );
}

export default SearchBar;
