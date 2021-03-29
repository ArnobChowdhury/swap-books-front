import { LayoutWrapper, PageContainer } from './PageLayout.styles';

interface PageLayoutProps {
  children?: React.ReactNode;
  largeTopMargin?: boolean;
  formPage?: boolean;
}

export const PageLayout = ({
  children,
  largeTopMargin,
  formPage = false,
}: PageLayoutProps): JSX.Element => {
  return (
    <LayoutWrapper>
      <PageContainer formPage={formPage} largeTopMargin={largeTopMargin}>
        {children}
      </PageContainer>
    </LayoutWrapper>
  );
};
