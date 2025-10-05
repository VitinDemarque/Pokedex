import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle
`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.main};
    color: ${({ theme }) => theme.colors.text};
    background: linear-gradient(135deg, #6e7b8b 0%, #2c3e50 100%);
    background-attachment: fixed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  ul {
    list-style: none;
  }
`;