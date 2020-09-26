import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import GlobalStyles from '../GlobalStyles';
import { ThemeProvider } from 'styled-components';
import theme from '../../theme';
import { UserInfo } from './UserInfo';

export default {
  title: 'UserInfo',
  component: UserInfo,
  decorators: [withKnobs, withA11y],
  parameters: {
    componentSubtitle: 'User info containter in profile page',
  },
};

export const Default = (): JSX.Element => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles storybook />
        <UserInfo
          userName="Sam"
          availableBooksToSwap={5}
          booksSwappedTillNow={2}
          withinYour5km
        />
      </ThemeProvider>
    </>
  );
};
