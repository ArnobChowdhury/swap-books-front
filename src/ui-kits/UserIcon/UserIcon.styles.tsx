import styled from 'styled-components';

export const StyledUserIcon = styled.div<{ hasRightMargin: boolean }>`
  width: 32px;
  height: 32px;
  border: ${({ theme }) => `2px solid ${theme.colorTextPrimary}`};
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.colorTextPrimary};
  font-size: 13px;
  font-weight: 400;
  margin-right: ${({ hasRightMargin, theme }) => hasRightMargin && theme.spaceFour};
`;
