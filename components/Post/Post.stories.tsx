import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';
import { action } from '@storybook/addon-actions';
import GlobalStyles from '../GlobalStyles';
import { ThemeProvider } from 'styled-components';
import theme from '../../theme';
import { Post } from './Post';
import { useState } from 'react';

export default {
  title: 'Post',
  component: Post,
  decorators: [withKnobs, withA11y],
  parameters: {
    componentSubtitle: 'NavBar for everypage of app',
    // backgrounds: [{ name: 'Black', value: 'rgb(65, 65, 65)', default: true }],
  },
};

export const Default = (): JSX.Element => {
  const [isInterested, setIsInterested] = useState<boolean>(false);
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyles storybook />
        <Post
          key={1}
          bookName="Badshah Namdar"
          bookAuthor="Humayun Ahmed"
          bookOwnerName="Tom"
          imgUrl="http://localhost:4000/images/2020-07-11T22-24-34.542Z-badshah_namdar.jpg"
          availableIn="Dhanmondi"
          genre="Novel"
          isInterested={isInterested}
          interestButtonClick={() => setIsInterested(!isInterested)}
          interestReqOnGoing={false}
          isOwners={false}
        />
      </ThemeProvider>
    </>
  );
};
