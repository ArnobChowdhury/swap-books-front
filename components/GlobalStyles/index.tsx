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
    color: ${theme.colorBlackPrimary};
    overflow: ${(props): string | null => (props.overFlowHidden ? 'hidden' : null)};
    margin: 0;
  }
`;

export default GlobalStyles;
