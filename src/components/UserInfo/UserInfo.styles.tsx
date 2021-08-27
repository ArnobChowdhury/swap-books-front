import styled from 'styled-components';
import { mediumScreen } from '../../mediaConfig';

export const Container = styled.div`
  margin-top: ${({ theme }) => theme.spaceFive};
  background: ${({ theme }) => theme.colorWhite};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spaceFive};
  font-size: ${({ theme }) => theme.fontLarge};
  display: flex;
  box-shadow: ${({ theme }) => theme.boxShadow};
  align-items: center;

  @media (min-width: ${mediumScreen}px) {
    padding: ${({ theme }) => theme.spaceTen};
  }
`;

export const ProfileIconContainer = styled.div`
  width: 30%;
  padding: ${({ theme }) => `${theme.spaceFive} 0`};

  @media (min-width: ${mediumScreen}px) {
    padding: ${({ theme }) => theme.spaceTen};
  }
`;

export const ProfileInfoContainer = styled.div`
  width: 70%;
  padding: ${({ theme }) => theme.spaceFive};

  @media (min-width: ${mediumScreen}px) {
    padding: ${({ theme }) => theme.spaceTen};
  }
`;
