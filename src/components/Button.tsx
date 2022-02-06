import styled, { css } from 'styled-components';

interface ButtonProps {
  activate: boolean;
}

const Button = styled.button<ButtonProps>`
  padding: 0.25rem 0.75rem;
  margin: 0.5rem;
  border-radius: 1.875rem;
  border: 1px solid rgb(240, 241, 243);
  background-color: rgb(240, 241, 243);
  color: rgb(94, 95, 97);
  font-size: 14px;
  word-break: keep-all;
  line-height: 1.5;
  transition: all 150ms ease-in-out 0s;
  cursor: pointer;

  ${(props) =>
    props.activate &&
    css`
      border-color: rgb(82, 79, 161);
      background-color: rgb(82, 79, 161);
      color: white;
    `}

  :hover {
    background-color: rgb(225, 226, 228);
    border-color: rgb(225, 226, 228);
    color: black;

    ${(props) =>
      props.activate &&
      css`
        background-color: rgb(66, 63, 140);
        border-color: rgb(66, 63, 140);
        color: rgb(240, 241, 243);
      `}
  }
`;

export default Button;
