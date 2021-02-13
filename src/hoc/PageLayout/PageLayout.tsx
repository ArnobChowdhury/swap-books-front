import { LayoutWrapper, PageContainer } from './PageLayout.styles';

interface PageLayoutProps {
  children?: React.ReactNode;
  largeTopMargin?: boolean;
}

export const PageLayout = ({
  children,
  largeTopMargin,
}: PageLayoutProps): JSX.Element => {
  return (
    <LayoutWrapper>
      <PageContainer largeTopMargin={largeTopMargin}>{children}</PageContainer>
    </LayoutWrapper>
  );
};
