import Landing from './Landing';
import GlobalStyles from '../GlobalStyles';
import { ThemeProvider } from 'styled-components';
import theme from '../../theme';
import { action } from '@storybook/addon-actions';

export default {
  title: 'Landing',
  component: Landing,
  parameters: {
    componentSubtitle: 'This is how the Landing page looks',
  },
};

const loginAction = action('loginOnClick');
const signupAction = action('signupOnClick');

export const LandingPage = (): JSX.Element => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles storybook overFlowHidden />
        <Landing loginOnClick={loginAction} signupOnClick={signupAction} />
      </ThemeProvider>
    </>
  );
};
