import theme from '../theme';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from '../components/GlobalStyles';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: { expanded: true },
};

export const decorators = [
  Story => (
    <ThemeProvider theme={theme}>
      <GlobalStyles storybook />
      <Story />
    </ThemeProvider>
  ),
];
