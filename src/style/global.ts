import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

const GlobalStyle = createGlobalStyle`
  ${normalize}

  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
    font-size: 14px;
  }

  html,
  body {
    width: 100%;
    height: 100%;
    background-color: #f0f1f3;
    overflow-x: hidden;
  }

  button {
    outline: none;
    border: none;
    background-color: transparent;
  }

  ul {
    list-style: none;
  }
`;

export default GlobalStyle;
