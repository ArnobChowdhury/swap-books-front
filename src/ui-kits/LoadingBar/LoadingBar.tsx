import React from 'react';
import { Container, Shimmer } from './LoadingBar.styles';

export const LoadingBar = (): JSX.Element => {
  return (
    <Container>
      <Shimmer>
        <div className="loadingShimmer"></div>
      </Shimmer>
    </Container>
  );
};
