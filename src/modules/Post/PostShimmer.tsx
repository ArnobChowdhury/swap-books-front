import {
  DummyContent,
  PostOwnerDummyImg,
  DummyImage,
  PostShimmerLower,
  PostShimmerWrapper,
  ImageWrapper,
  DummyPostOwner,
} from './Post.styles';

export const PostShimmer = (): JSX.Element => {
  return (
    <PostShimmerWrapper>
      <DummyPostOwner>
        <PostOwnerDummyImg className="gradient" />
        <DummyContent className="gradient" hasMargin width={90} />
      </DummyPostOwner>
      <ImageWrapper>
        <DummyImage className="gradient" />
      </ImageWrapper>
      <PostShimmerLower>
        <DummyContent height={3.0} className="gradient" width={140} />
      </PostShimmerLower>
    </PostShimmerWrapper>
  );
};
