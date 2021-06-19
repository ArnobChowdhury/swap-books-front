import styled from 'styled-components';
import { smallScreen, mediumScreen } from 'mediaConfig';

export const Container = styled.div``;

export const LogoWrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colorPrimary1};
  padding: ${({ theme }) => theme.spaceFive};
  text-align: center;
`;

export const Block = styled.div<{ background: 'blue' | 'purple' | 'white' }>`
  background: ${({ theme, background }) =>
    background === 'blue'
      ? theme.colorPrimary1
      : background === 'purple'
      ? theme.colorPrimary2
      : theme.colorWhite};
  padding: 40px 30px 10px 30px;
`;

export const FlexBox = styled.div`
  display: flex;
  justify-content: space-around;
`;

export const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

export const MidContainer = styled.div`
  max-width: 800px;
  width: 800px;
  text-align: justify;

  & > p {
    color: ${({ theme }) => theme.colorPrimary1};
    line-height: 30px;
    font-size: 18px;
  }

  & > h1 {
    font-weight: 400;
    font-size: 25px;
    color: ${({ theme }) => theme.colorPrimary1};
    text-align: center;
    letter-spacing: 1px;

    @media (min-width: ${mediumScreen}px) {
      font-size: 30px;
    }
  }
`;

export const DevImageContainer = styled.div`
  height: 120px;
  width: 120px;
  text-align: center;
  border-radius: 100%;
  overflow: hidden;
  transform: rotate(-30deg);
  float: right;
  margin-left: 30px;
  shape-outside: circle();

  @media (min-width: ${smallScreen}px) {
    height: 150px;
    width: 150px;
  }

  @media (min-width: ${mediumScreen}px) {
    height: 200px;
    width: 200px;
  }
`;

export const DevImage = styled.img`
  width: 100%;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

export const ImageContainer = styled.div`
  width: 100px;
  height: 100px;
`;

export const PackageContainer = styled.a`
  text-align: center;
  margin: 0 50px;
  margin-bottom: 50px;
`;
