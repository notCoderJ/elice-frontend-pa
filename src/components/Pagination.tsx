import React, { useState, useMemo, useCallback, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

const PaginationContainer = styled.div`
  display: flex;

  > div:first-child {
    > a {
      margin-right: 6px;
    }
  }

  > div:nth-child(2) {
    display: flex;

    > a {
      margin: 0 6px;
    }
  }

  > div:last-child {
    > a {
      margin-left: 6px;
    }
  }
`;

interface LinkProps {
  activate: boolean;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  'data-page'?: number;
}

const linkStyle = css`
  display: block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  background: transparent;
  text-align: center;
  cursor: pointer;
`;

const NavLink = styled.a<LinkProps>`
  color: ${(props) => (props.activate ? '#222' : '#ccc')};
  ${linkStyle};
`;

const PageLink = styled(NavLink)`
  color: #999;

  ${(props) =>
    props.activate &&
    css`
      background: #524fa1;
      color: white;
    `};
`;

// TODO: 페이지 최대 4개 표시 요구사항이 이게 아닌듯 한데... 문의 필요.
// 컴포넌트 구현부
const COUNT_PER_PAGE = 20;

interface PaginationProps {
  totalCount: number;
  onMove: (pageNum: number, pageIndex?: number) => void;
}

function Pagination({ totalCount, onMove }: PaginationProps) {
  const [current, setCurrent] = useState(0);
  const last = useMemo(
    () => Math.ceil(totalCount / COUNT_PER_PAGE) - 1,
    [totalCount],
  );
  const totalPages = useMemo(
    () => [...Array(last + 1)].map((_, index) => index + 1),
    [last],
  );

  // 테스트 로그
  console.log('전체 페이지수', totalCount, current, last, totalPages);

  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      root.scrollIntoView();
    }
  }, [current]);

  const handlePrev = useCallback(() => {
    if (current === 0) return;
    setCurrent((prev) => prev - 1);
  }, [current]);

  const handleNext = useCallback(() => {
    if (current === last) return;
    setCurrent((prev) => prev + 1);
  }, [current, last]);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      const target = e.target as HTMLAnchorElement;
      setCurrent(Number(target.dataset.page) - 1);
      onMove(Number(target.dataset.page), Number(target.dataset.page) - 1);
    },
    [onMove],
  );

  return (
    <PaginationContainer>
      <div>
        <NavLink
          tabIndex={0}
          activate={current !== 0}
          aria-label="previous"
          onClick={handlePrev}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </NavLink>
      </div>
      <div>
        {totalPages
          .slice(
            current < 5 ? 0 : current - 4,
            last - current > 4 ? current + 5 : last + 1,
          )
          .map((page) => (
            <PageLink
              key={page}
              tabIndex={0}
              activate={page === current + 1}
              data-page={page}
              onClick={handleMove}
            >
              {page}
            </PageLink>
          ))}
      </div>
      <div>
        <NavLink
          tabIndex={0}
          activate={current !== last}
          aria-label="next"
          onClick={handleNext}
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </NavLink>
      </div>
    </PaginationContainer>
  );
}

export default Pagination;
