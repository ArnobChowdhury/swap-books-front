import { LayoutWrapper, PageContainer } from './PageLayout.styles';
import { NextPage } from 'next';

interface PageLayout {
  children?: React.ReactNode;
}

export const PageLayout: NextPage = ({ children }: PageLayout): JSX.Element => {
  return (
    <LayoutWrapper>
      <PageContainer>{children}</PageContainer>
    </LayoutWrapper>
  );
};
