import styled from 'styled-components';

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
    color: ${({ theme }) => theme.colorPrimary1};
    text-align: center;
  }
`;

export const FlexBox = styled.div`
  display: flex;
  justify-content: space-around;
`;

export const Sides = styled.div<{ bluBackground?: boolean }>`
  padding: ${({ theme }) => theme.spaceTen};

  & > p {
    font-size: 25px;
    font-weight: 400;
    color: ${({ theme, bluBackground }) =>
      bluBackground ? theme.colorPrimary2 : theme.colorPrimary1};
    margin-bottom: ${({ theme }) => theme.spaceThree};

    &:last-of-type {
      margin-bottom: ${({ theme }) => theme.spaceTen};
    }
  }
`;

export const ImageContainer = styled.div`
  height: 320px;
  width: 100%;
  text-align: center;
`;

export const Image = styled.img`
  height: 100%;
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.3);
`;
