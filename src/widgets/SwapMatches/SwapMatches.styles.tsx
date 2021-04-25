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
  display: inline-flex;
  align-items: center;
  margin: ${({ theme }) => `${theme.spaceFive} 0`};

  &:hover {
    cursor: pointer;

    & > p {
      text-decoration: underline;
    }
  }
`;

export const BooksListImage = styled.img`
  width: 60px;
  height: 40px;
  object-fit: contain;
  display: inline-block;
  border: ${({ theme }) => `1px solid ${theme.colorPrimary2}`};
  margin-right: ${({ theme }) => theme.spaceTen};
  border-radius: ${({ theme }) => theme.borderRadius};
`;

export const NoMatchesFound = styled.div`
  font-size: ${({ theme }) => theme.fontLarge};
  font-weight: 400;
  text-align: center;
`;

export const HeaderList = styled.h3`
  font-size: 20px;
  font-weight: 400;
  padding-left: ${({ theme }) => theme.spaceFive};
  margin-bottom: ${({ theme }) => theme.spaceFive};
`;
