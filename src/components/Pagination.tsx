import React, { useCallback, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';

// 스타일 정의부
const PaginationContainer = styled.div`
  display: flex;
  width: fit-content;

  > div:first-child {
    > a {
      margin-right: 6px;
    }
  }

  > div:last-child {
    > a {
      margin-left: 6px;
    }
  }
`;

const PageContainer = styled.div`
  display: flex;

  > a {
    margin: 0 6px;
  }
`;

interface LinkProps {
  activate: boolean;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
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
  ${linkStyle};
  color: #ccc;
  cursor: not-allowed;

  ${(props) =>
    props.activate &&
    css`
      color: #222;
      cursor: pointer;
    `}
`;

const PageLink = styled.a<LinkProps>`
  ${linkStyle};
  font-size: 14px;
  color: #999;
  transition: background-color 0.5s ease;

  ${(props) =>
    props.activate &&
    css`
      background: #524fa1;
      color: white;
    `};

  :hover {
    background-color: transparent;
    color: #524fa1;
    font-weight: 700;
  }
`;

// TODO: 페이지 최대 4개 표시 요구사항이 이게 아닌듯 한데... 답변 대기중.
// 컴포넌트 구현부
interface PaginationProps {
  current: number;
  last: number;
  totalPages: number[];
  onMove: (pageNum: number, pageIndex?: number) => void;
}

function Pagination({ current, last, totalPages, onMove }: PaginationProps) {
  useEffect(() => {
    const root = document.getElementById('root');
    if (root) {
      root.scrollIntoView();
    }
  }, [current]);

  const handlePrev = useCallback(() => {
    if (current === 0) return;
    onMove(current, current - 1);
  }, [current, onMove]);

  const handleNext = useCallback(() => {
    if (current === last) return;
    onMove(current + 2, current + 1);
  }, [current, last, onMove]);

  const handleMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'A') {
        return;
      }

      onMove(Number(target.dataset.page), Number(target.dataset.page) - 1);
    },
    [onMove],
  );

  return (
    <PaginationContainer>
      <div>
        <NavLink
          tabIndex={0}
          activate={current > 0}
          aria-label="previous"
          onClick={handlePrev}
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </NavLink>
      </div>
      <PageContainer onClick={handleMove}>
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
            >
              {page}
            </PageLink>
          ))}
      </PageContainer>
      <div>
        <NavLink
          tabIndex={0}
          activate={current < last}
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
