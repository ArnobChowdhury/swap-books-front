import styled from 'styled-components';

export const PostWrapper = styled.div<{ bottomMargin?: boolean }>`
  border: ${({ theme }) => `1px solid ${theme.colorGreyPrimary}`};
  display: flex;
  padding: ${({ theme }) =>
    `${theme.spaceTen} ${theme.spaceTen} ${theme.spaceFive} ${theme.spaceTen}`};
  border-radius: 5px;
  font-size: ${({ theme }) => theme.fontSizeOne};
  flex-wrap: wrap;
  margin-bottom: ${({ bottomMargin, theme }) => bottomMargin && theme.spaceEight};
`;

export const ImageWrapper = styled.div`
  height: 140px;
  width: 100px;
`;

export const ContentContainer = styled.div`
  flex-grow: 1;
  padding-left: ${({ theme }) => theme.spaceTen};
`;

export const ContentWrapper = styled.div`
  display: flex;
  margin-bottom: ${({ theme }) => theme.spaceFive};
`;

export const ContentLeft = styled.div`
  width: 120px;
  display: flex;
  align-items: center;
`;

export const ContentRight = styled.div<{ isTitle?: boolean }>`
  flex-grow: 1;
  ${({ isTitle, theme }) =>
    isTitle &&
    `color: ${theme.colorBlackDark}; font-size: ${theme.fontSizeTwo}; font-weight: 700;`};
`;

export const Image = styled.img`
  height: 100%;
  width: 100%;
`;

export const InterestIconWrapper = styled.div`
  margin-top: ${({ theme }) => theme.spaceTen};
  border-top: ${({ theme }) => `1px solid ${theme.colorGreyPrimary}`};
  flex-basis: 100%;
  padding: ${({ theme }) => `${theme.spaceFive} 0 0 0`};
  display: flex;
  justify-content: center;
`;

export const InterestButton = styled.button`
  border: none;
  outline: none;
  display: flex;
  align-items: center;
  background: none;
  width: 125px;
  justify-content: space-between;
  cursor: pointer;
  padding: ${({ theme }) => `${theme.spaceFive} ${theme.spaceFour}`};
  border-radius: 5px;
  transition: width 0.3s;
  font-family: inherit;
  font-size: ${({ theme }) => theme.fontSizeMedium};
  &:hover {
    background: ${({ theme }) => theme.colorGreyLight};
  }
`;
