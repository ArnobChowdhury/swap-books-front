import React from 'react';
import {
  DummyContent,
  PostOwnerDummyImg,
  DummyImage,
  PostShimmerLower,
  PostShimmerWrapper,
  ImageWrapper,
  DummyPostOwner,
} from './Post.styles';

export const PostShimmer = React.forwardRef(
  (props, ref: React.Ref<HTMLDivElement>): JSX.Element => {
    return (
      <PostShimmerWrapper ref={ref}>
        <DummyPostOwner>
          <PostOwnerDummyImg className="gradient" />
          <DummyContent className="gradient" hasMargin width={90} />
        </DummyPostOwner>
        <ImageWrapper>
          <DummyImage className="gradient" />
        </ImageWrapper>
        <PostShimmerLower>
          <DummyContent height={3.0} className="gradient" width={140} />
          <DummyContent height={3.0} className="gradient" width={140} />
        </PostShimmerLower>
      </PostShimmerWrapper>
    );
  },
);
