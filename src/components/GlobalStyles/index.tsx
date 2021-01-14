import { createGlobalStyle } from 'styled-components';
import theme from '../../theme';

interface GlobalStylesProps {
  storybook?: boolean;
  overFlowHidden?: boolean;
}

const GlobalStyles = createGlobalStyle<GlobalStylesProps>`
  *,
  *::after,
  *::before {
    box-sizing: inherit;
    margin: 0;
    padding: 0;
  }

  html {
    font-size: 62.5%;
  }

  body {
    ${(props): string | null =>
      props.storybook
        ? "@import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400&display=swap')"
        : null};
    font-family: 'Rubik', sans-serif;
    box-sizing: border-box;
    font-weight: 300;
    color: ${theme.colorTextPrimary};
    overflow-x: ${(props): string | null =>
      props.overFlowHidden ? 'hidden' : null};
    margin: 0;
    background: ${theme.colorBG};
  }
`;

export default GlobalStyles;
