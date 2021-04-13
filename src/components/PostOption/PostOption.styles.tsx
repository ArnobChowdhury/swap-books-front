import styled from 'styled-components';

export const IconContainer = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  height: 32px;
  display: flex;
  align-items: center;
`;

export const OptionsContainer = styled.div<{ reqShowing?: boolean }>`
  position: absolute;
  right: 0;
  top: 30px;
  background: ${({ theme }) => theme.colorWhite};
  padding: ${({ reqShowing, theme }) =>
    reqShowing ? theme.spaceNine : theme.spaceFour};
  box-shadow: 0 2px 8px rgb(0, 0, 0, 0.2);
  border-radius: ${({ theme }) => theme.borderRadius};
  width: 250px;
`;

export const Option = styled.div`
  cursor: pointer;
  padding: ${({ theme }) => theme.spaceFive};
  border-radius: ${({ theme }) => theme.borderRadius};

  display: flex;
  align-items: center;

  &:hover {
    background: ${({ theme }) => theme.colorSeparator};
  }

  & svg {
    margin-right: ${({ theme }) => theme.spaceFive};
  }
`;
