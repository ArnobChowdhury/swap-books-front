import { NotificationChild } from './NotificationChild';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import theme from '../../theme';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from '../GlobalStyles';

export default {
  title: 'NotificationChild',
  component: NotificationChild,
  decorators: [withKnobs, withA11y],
  parameters: {
    componentSubtitle: 'A single notification',
    backgrounds: [{ name: 'Light', value: 'rgb(250,255,255)', default: true }],
  },
};

export const Default = (): JSX.Element => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles storybook />
        <NotificationChild
          seen={false}
          fromId="1233355"
          fromName="Shakhawat"
          bookName="Amazing"
          type="interest"
        />
      </ThemeProvider>
    </>
  );
};

export const TypeMatch = (): JSX.Element => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles storybook />
        <NotificationChild
          seen={false}
          fromId="1233355"
          fromName="Shakhawat"
          bookName="Amazing"
          type="match"
          matchLink="http://localhost:4000/books"
        />
      </ThemeProvider>
    </>
  );
};
