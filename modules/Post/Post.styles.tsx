import styled from 'styled-components';

export const PostWrapper = styled.div<{ bottomMargin?: boolean }>`
  display: flex;
  padding: ${({ theme }) =>
    `${theme.spaceTen} ${theme.spaceEight} ${theme.spaceTwo} ${theme.spaceEight}`};
  font-size: ${({ theme }) => theme.fontSmall};
  flex-wrap: wrap;
  margin-top: ${({ bottomMargin, theme }) => bottomMargin && theme.spaceFive};
  background: rgb(255, 255, 255);
  box-shadow: 0px 1px 2px rgb(0, 0, 0, 0.2);
  position: relative;

  @media (min-width: 360px) {
    padding: ${({ theme }) =>
      `${theme.spaceEight} ${theme.spaceEight} ${theme.spaceTwo} ${theme.spaceEight}`};
  }

  @media (min-width: 800px) {
    flex-basis: 50%;
  }
`;

export const ImageWrapper = styled.div`
  height: 120px;
  flex-basis: 100%;
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spaceTen};
  padding: ${({ theme }) => theme.spaceTwo};

  @media (min-width: 360px) {
    border: ${({ theme }) => `1px solid ${theme.colorSeparator}`};
    flex-basis: 30%;
    margin-bottom: 0;
  }
`;

export const ContentContainer = styled.div`
  flex-basis: 100%;
  padding-left: ${({ theme }) => theme.spaceTen};

  @media (min-width: 360px) {
    flex-basis: 70%;
  }
`;

export const ContentWrapper = styled.div`
  display: flex;
  margin-bottom: ${({ theme }) => theme.spaceFive};
  align-items: flex-start;
`;

export const ContentLeft = styled.div`
  flex-basis: 30%;
  display: flex;
  align-items: center;
`;

export const ContentRight = styled.div<{ isTitle?: boolean }>`
  flex-basis: 70%;
  ${({ isTitle, theme }) =>
    isTitle && `color: ${theme.colorTextSecondary}; font-weight: 400;`};
`;

export const Image = styled.img`
  height: 100%;
`;

export const InterestIconWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spaceFive};
  border-top: ${({ theme }) => `1px solid ${theme.colorSeparator}`};
  flex-basis: 100%;
  display: flex;
  padding: ${({ theme }) => `${theme.spaceTwo} 0 0 0`};
  justify-content: center;
`;

export const PostOptionWrapper = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spaceTwo};
  right: ${({ theme }) => theme.spaceTwo};
`;
