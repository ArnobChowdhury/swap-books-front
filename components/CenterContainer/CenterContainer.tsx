import { ContentContainer, PageContainer } from './CenterContainer.styles';

interface CenterContainerProps {
  withPageContainer: boolean;
  children: React.ReactNode;
  containerWidth?: number;
}

export const CenterContainer = ({
  withPageContainer,
  children,
  containerWidth,
}: CenterContainerProps) => {
  return (
    <>
      {withPageContainer ? (
        <PageContainer>
          <ContentContainer containerWidth={containerWidth}>
            {children}
          </ContentContainer>
        </PageContainer>
      ) : (
        <ContentContainer containerWidth={containerWidth}>
          {children}
        </ContentContainer>
      )}
    </>
  );
};
