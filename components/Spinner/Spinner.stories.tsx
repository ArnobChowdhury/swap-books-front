import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { Spinner } from './Spinner';
import { ThemeProvider } from 'styled-components';
import theme from '../../theme';

export default {
  title: 'Spinner',
  component: Spinner,
  decorators: [withKnobs, withA11y],
  parameters: {
    componentSubtitle: 'Spinner',
    backgrounds: [{ name: 'Black', value: 'rgb(65, 65, 65)', default: true }],
  },
};

export const Default = (): JSX.Element => {
  return (
    <ThemeProvider theme={theme}>
      <Spinner />
    </ThemeProvider>
  );
};
