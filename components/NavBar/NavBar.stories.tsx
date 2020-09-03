import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import GlobalStyles from '../GlobalStyles';
import { ThemeProvider } from 'styled-components';
import theme from '../../theme';
import { NavBar } from './NavBar';

export default {
  title: 'Navbar',
  component: NavBar,
  decorators: [withKnobs, withA11y],
  parameters: {
    componentSubtitle: 'NavBar for everypage of app',
    // backgrounds: [{ name: 'Black', value: 'rgb(65, 65, 65)', default: true }],
  },
};

export const Default = (): JSX.Element => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles storybook />
        <NavBar isSignedIn={true} userName="Arnob" />
      </ThemeProvider>
    </>
  );
};
