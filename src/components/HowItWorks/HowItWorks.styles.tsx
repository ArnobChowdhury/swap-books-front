import styled from 'styled-components';
import { smallScreen, mediumScreen } from 'mediaConfig';

export const Container = styled.div``;

export const LogoWrapper = styled.div`
  width: 100%;
  background: ${({ theme }) => theme.colorPrimary1};
  padding: ${({ theme }) => theme.spaceFive};
  text-align: center;
`;

export const Block = styled.div<{ backgroundSecondary?: boolean }>`
  background: ${({ theme, backgroundSecondary }) =>
    backgroundSecondary ? theme.colorPrimary2 : theme.colorPrimary1};
  padding: ${({ theme }) => theme.spaceTen};

  & > h1 {
    font-weight: 700;
    font-size: 25px;
    color: ${({ theme }) => theme.colorPrimary1};
    text-align: center;

    @media (min-width: ${mediumScreen}px) {
      font-size: 30px;
    }
  }
`;

export const FlexBox = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`;

export const Sides = styled.div<{ bluBackground?: boolean }>`
  padding: ${({ theme }) => theme.spaceTen};
  text-align: center;

  & > p {
    font-size: 20px;
    font-weight: 400;
    color: ${({ theme, bluBackground }) =>
      bluBackground ? theme.colorPrimary2 : theme.colorPrimary1};
    margin-bottom: ${({ theme }) => theme.spaceThree};

    &:last-of-type {
      margin-bottom: ${({ theme }) => theme.spaceTen};
    }

    @media (min-width: ${mediumScreen}px) {
      font-size: 25px;
    }
  }
`;

export const ImageContainer = styled.div`
  height: 150px;
  width: 100%;
  text-align: center;

  @media (min-width: ${smallScreen}px) {
    height: 180px;
  }

  @media (min-width: 500px) {
    height: 250px;
  }

  @media (min-width: ${mediumScreen}px) {
    height: 300px;
  }
`;

export const Image = styled.img`
  height: 100%;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.3);
`;
