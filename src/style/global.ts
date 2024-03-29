import { createGlobalStyle } from 'styled-components';
import { normalize } from 'styled-normalize';

const GlobalStyle = createGlobalStyle`
  ${normalize}

  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  html,
  body {
    width: 100vw;
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

  a {
    text-decoration: none;
    color: black;
  }
`;

export default GlobalStyle;
