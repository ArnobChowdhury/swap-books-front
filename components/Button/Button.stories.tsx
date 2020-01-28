import Button from './Button';
import { withKnobs, text, boolean } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import theme from '../../theme';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from '../GlobalStyles';

export default {
  title: 'Button',
  component: Button,
  decorators: [withKnobs, withA11y],
  parameters: {
    componentSubtitle: 'Button component using Anchor tag',
    backgrounds: [{ name: 'Black', value: 'rgb(0,0,0)', default: true }],
  },
};

export const Default = (): JSX.Element => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles storybook />
        <Button
          title={text('title', 'Sign Up')}
          onClick={action('onClick')}
          isYellow={boolean('isYellow', true)}
        />
      </ThemeProvider>
    </>
  );
};
