import { LayoutWrapper, PageContainer } from './PageLayout.styles';

interface PageLayoutProps {
  children?: React.ReactNode;
}

export const PageLayout = ({ children }: PageLayoutProps): JSX.Element => {
  return (
    <LayoutWrapper>
      <PageContainer>{children}</PageContainer>
    </LayoutWrapper>
  );
};
