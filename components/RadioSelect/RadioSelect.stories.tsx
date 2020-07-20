import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import GlobalStyles from '../GlobalStyles';
import { ThemeProvider } from 'styled-components';
import theme from '../../theme';
import { RadioSelect } from './RadioSelect';

export default {
  title: 'RadioSelect',
  component: RadioSelect,
  decorators: [withKnobs, withA11y],
  parameters: {
    componentSubtitle: 'NavBar for everypage of app',
  },
};

export const Default = (): JSX.Element => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles storybook />
        <RadioSelect
          name="sex"
          options={[
            { value: 'male', labelText: 'Male' },
            { value: 'female', labelText: 'Female' },
          ]}
        />
      </ThemeProvider>
    </>
  );
};
