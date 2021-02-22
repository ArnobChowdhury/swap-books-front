import styled from 'styled-components';
import { mediumScreen, smallScreen } from '../../mediaConfig';

export const StyledUserIcon = styled.div<{
  hasRightMargin: boolean;
  largeIcon: boolean;
}>`
  width: ${({ largeIcon }) => (largeIcon ? '80px' : '32px')};
  height: ${({ largeIcon }) => (largeIcon ? '80px' : '32px')};
  border: ${({ theme, largeIcon }) =>
    `${largeIcon ? '4px' : '2px'} solid ${theme.colorTextPrimary}`};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colorTextPrimary};
  font-family: inherit;
  font-size: ${({ largeIcon }) => (largeIcon ? '50px' : '13px')};
  font-weight: ${({ largeIcon }) => (largeIcon ? '300' : '400')};
  margin-right: ${({ hasRightMargin, theme }) => hasRightMargin && theme.spaceFour};

  @media (min-width: ${smallScreen}px) {
    width: ${({ largeIcon }) => (largeIcon ? '100px' : '32px')};
    height: ${({ largeIcon }) => (largeIcon ? '100px' : '32px')};
    font-size: ${({ largeIcon }) => (largeIcon ? '80px' : '13px')};
  }

  @media (min-width: ${mediumScreen}px) {
    width: ${({ largeIcon }) => (largeIcon ? '150px' : '32px')};
    height: ${({ largeIcon }) => (largeIcon ? '150px' : '32px')};
    font-size: ${({ largeIcon }) => (largeIcon ? '80px' : '13px')};
  }
`;
