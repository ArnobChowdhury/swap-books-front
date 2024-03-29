import styled from 'styled-components';

export const ErrorMessage = styled.div`
  text-align: center;
  font-weight: 400;
  font-size: ${({ theme }) => theme.fontLarge};
  color: ${({ theme }) => theme.colorAlert};
`;
export const MatchContainer = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  border-radius: ${({ theme }) => theme.borderRadius};
  overflow: hidden;
`;

export const NameContainer = styled.div<{ isSelected: boolean }>`
  flex-basis: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spaceFive};
  background: ${({ theme, isSelected }) =>
    isSelected ? theme.colorSeparator : theme.colorWhite};
  box-shadow: ${({ theme, isSelected }) => (isSelected ? theme.boxShadow : 'none')};

  &:hover {
    background: ${({ theme }) => theme.colorSeparator};
    cursor: pointer;
    box-shadow: ${({ theme }) => theme.boxShadow};
  }
`;

export const Name = styled.div`
  display: flex;
  align-items: center;

  & > div {
    margin-right: ${({ theme }) => theme.spaceFive};
  }
`;

export const BooksListContainer = styled.div<{ show: boolean; reqOnGoing: boolean }>`
  flex-basis: 100%;
  padding: ${({ show }) => (show ? '10px 10px 10px 10px' : '0')};
  max-height: ${({ show }) => (show ? '500px' : '0')};
  text-align: ${({ reqOnGoing }) => (reqOnGoing ? 'center' : 'left')};
  transition: max-height 0.3s ease-in-out;
`;

export const BooksListUl = styled.ul`
  list-style: none;
  text-align: left;
`;

export const BooksListLi = styled.li`
  font-size: ${({ theme }) => theme.fontSmall};
  font-weight: 400;
  display: flex;
  align-items: center;
  margin: ${({ theme }) => `${theme.spaceFive} 0`};
  justify-content: space-between;
`;

export const ListImageAndTitleContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const BooksListImage = styled.img`
  width: 60px;
  height: 40px;
  object-fit: contain;
  display: inline-block;
  border: ${({ theme }) => `1px solid ${theme.colorPrimary2}`};
  margin-right: ${({ theme }) => theme.spaceFive};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

export const NoMatchesFound = styled.div`
  font-size: ${({ theme }) => theme.fontLarge};
  font-weight: 400;
  text-align: center;
`;

export const PendingSwapWrapper = styled.div`
  padding: ${({ theme }) => theme.spaceFive};
  border-radius: ${({ theme }) => theme.borderRadius};
  background: ${({ theme }) => theme.colorPrimary2Transparent};
  border: ${({ theme }) => `1px solid ${theme.colorPrimary3}`};
  margin-bottom: ${({ theme }) => theme.spaceFive};
`;

export const TopContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spaceEight};
  padding: ${({ theme }) => `0 ${theme.spaceOne}`};
`;

export const HeaderMatches = styled.h3`
  font-size: 20px;
  font-weight: 400;
  margin-bottom: ${({ theme }) => theme.spaceFive};
`;

export const MatchProfileLink = styled.a`
  text-decoration: none;
`;

export const SwapConsentButtonContainer = styled.div`
  margin-top: ${({ theme }) => theme.spaceFive};
  & button {
    margin-right: ${({ theme }) => theme.spaceFive};
  }
`;

export const SwapReqStatus = styled.span`
  margin-top: ${({ theme }) => theme.spaceFive};
  color: ${({ theme }) => theme.colorTextSecondary};
  font-size: ${({ theme }) => theme.fontLarge};
`;
