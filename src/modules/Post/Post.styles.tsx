import styled, { keyframes } from 'styled-components';

export const PostWrapper = styled.div<{
  requestOnGoing: boolean;
  topMargin?: boolean;
}>`
  ${({ theme, topMargin }) => topMargin && `margin-top: ${theme.spaceFive}`};
  background: ${({ theme }) => theme.colorWhite};
  padding-top: ${({ theme }) => theme.spaceSeven};
  width: 100%;
  font-size: ${({ theme }) => theme.fontSmall};
  font-weight: 400;
  box-shadow: ${({ theme }) => theme.boxShadow};
  position: relative;
  background: ${({ theme }) => theme.colorWhite};
  margin-top: ${({ theme, topMargin }) => topMargin && theme.spaceFive};
  border-radius: ${({ theme }) => theme.borderRadius};
  ${({ requestOnGoing }) => requestOnGoing && 'opacity: .5; cursor: wait;'}
`;

export const PostOwner = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spaceSeven};
  padding: ${({ theme }) => `0 ${theme.spaceSeven}`};
`;

export const ImageWrapper = styled.div`
  position: relative;
  height: 420px;
  width: 100%;
  overflow: hidden;

  @media (min-width: 450px) {
    height: 335px;
  }
`;

export const ImagePlaceholder = styled.img<{ mainImgLoaded: boolean }>`
  height: 100%;
  width: 100%;
  object-fit: contain;
  background: ${({ theme }) => theme.colorSeparator};
  opacity: ${({ mainImgLoaded }) => (mainImgLoaded ? 0 : 1)};
  position: absolute;
  left: 0;
  top: 0;
  filter: blur(5px);
  transition: opacity 0.3s linear;
`;

export const Image = styled.img<{ mainImgLoaded: boolean }>`
  height: 100%;
  width: 100%;
  object-fit: contain;
  background: ${({ theme }) => theme.colorSeparator};
  visibility: ${({ mainImgLoaded }) => (mainImgLoaded ? 'visible' : 'hidden')};
`;

export const ValidTillTime = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spaceFive};
  right: ${({ theme }) => theme.spaceSeven};
  padding: ${({ theme }) => `${theme.spaceFour} ${theme.spaceSix}`};
  background: ${({ theme }) => theme.colorPrimary2};
  border-radius: 20px;
  text-transform: capitalize;
  color: ${({ theme }) => theme.colorLogoBlue};
  box-shadow: ${({ theme }) => theme.boxShadow};
`;

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: 450px) {
    flex-basis: 50%;
    border-right: ${({ theme }) => `1px solid ${theme.colorSeparator}`};
  }
`;

export const ContentContainer = styled.div`
  display: flex;
  padding: ${({ theme }) => `${theme.spaceTwo} ${theme.spaceFour}`};
`;

export const BookInfo = styled.div<{ isBookName?: boolean }>`
  background: rgb(255, 255, 255);
  color: ${({ theme }) => theme.colorTextPrimary};
  margin-left: ${({ theme }) => theme.spaceFive};
  ${({ theme, isBookName }) =>
    isBookName &&
    `
      color:  ${theme.colorTextSecondary};
      font-size: ${theme.fontLarge};
      font-weight: 400;
    `};
`;

export const PostBottom = styled.div`
  padding: ${({ theme }) =>
    `${theme.spaceTen} ${theme.spaceTen} ${theme.spaceTen} ${theme.spaceSix}`};
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (min-width: 450px) {
    align-items: stretch;
    justify-content: flex-start;
    padding: ${({ theme }) => theme.spaceThree};

    & button {
      flex-basis: 50%;
      transition: 0.2s;
      font-size: ${({ theme }) => theme.fontLarge};
      min-width: 60px;
    }
  }
`;

export const PostOptionWrapper = styled.div`
  position: absolute;
  right: ${({ theme }) => theme.spaceSeven};
  top: ${({ theme }) => theme.spaceSeven};
`;
// POST SHIMMER STYLES

const placeHolderShimmer = keyframes`
  0%{
    background-position: -600px 0
  }
  40%{
    background-position: 1200px 0
  }
  100%{
    background-position: 600px 0
  }
`;

export const PostShimmerWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  margin-top: ${({ theme }) => theme.spaceFive};
  background: ${({ theme }) => theme.colorWhite};
  box-shadow: ${({ theme }) => theme.boxShadow};
  padding: ${({ theme }) => `${theme.spaceSeven} 0 0 0`};

  & .gradient {
    animation-duration: 1.8s;
    animation-fill-mode: forwards;
    animation-iteration-count: infinite;
    animation-name: ${placeHolderShimmer};
    animation-timing-function: linear;
    background: #f6f7f8;
    background: linear-gradient(to right, #ddd 8%, #f4f4f4 38%, #ddd 54%);
    background-size: 1000px 640px;

    position: relative;
  }
`;

export const DummyPostOwner = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spaceSeven};
  padding: ${({ theme }) => `0 ${theme.spaceSeven}`};
  height: 35px;
`;

export const PostOwnerDummyImg = styled.div`
  height: 3.5rem;
  width: 3.5rem;
  border-radius: 50%;
  margin-right: ${({ theme }) => theme.spaceFive};
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const DummyImage = styled.div`
  height: 100%;
  width: 100%;
`;

export const DummyContent = styled.div<{
  height?: number;
  width: number;
  hasMargin?: boolean;
}>`
  width: ${({ width }) => `${width}px`};
  height: ${({ theme, height }) => (height ? `${height}rem` : theme.spaceTen)};
  background: ${({ theme }) => theme.colorSeparator};
`;

export const PostShimmerLower = styled.div`
  flex-basis: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spaceTen};
`;
