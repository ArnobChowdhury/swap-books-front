import { createGlobalStyle } from 'styled-components';

interface GlobalStylesProps {
  storybook?: boolean;
}

const GlobalStyles = createGlobalStyle<GlobalStylesProps>`
  *,
  *::after,
  *::before {
    box-sizing: inherit;
  }

  html {
    font-size: 62.5%;
  }

  body {
    ${(props): string | null =>
      props.storybook
        ? "@import url('https://fonts.googleapis.com/css?family=Quicksand:300,400,500,600,700&display=swap')"
        : null};
    font-family: 'Quicksand', sans-serif;
    box-sizing: border-box;
    font-weight: 400;
  }
`;

export default GlobalStyles;
