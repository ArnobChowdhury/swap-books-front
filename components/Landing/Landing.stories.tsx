import Landing from './Landing';
import GlobalStyles from '../GlobalStyles';

export default {
  title: 'Landing',
  component: Landing,
  parameters: {
    componentSubtitle: 'This is how the Landing page looks',
  },
};

export const LandingPage = (): JSX.Element => {
  return (
    <>
      <GlobalStyles storybook overFlowHidden />
      <Landing />
    </>
  );
};
