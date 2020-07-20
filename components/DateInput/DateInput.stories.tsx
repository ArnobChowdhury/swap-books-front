import { DateInput } from './DateInput';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
// import { action } from '@storybook/addon-actions';
import theme from '../../theme';
import { ThemeProvider } from 'styled-components';
import GlobalStyles from '../GlobalStyles';

export default {
  title: 'DateInput',
  component: DateInput,
  decorators: [withKnobs, withA11y],
  parameters: {
    componentSubtitle: 'Customized Date Input',
    // backgrounds: [{ name: 'Black', value: 'rgb(0,0,0)', default: true }],
  },
};

export const Default = (): JSX.Element => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles storybook />
        <DateInput name="dob" />
      </ThemeProvider>
    </>
  );
};
