import styled from 'styled-components';

export const Container = styled.div`
  background: ${({ theme }) => theme.colorGreyLight};
  border: 1px solid ${({ theme }) => theme.colorGreyDark};
  border-radius: 5px;
  padding: ${({ theme }) => theme.spaceTen};
  font-size: ${({ theme }) => theme.fontSizeOne};
`;

export const FieldWrapper = styled.div`
  padding: ${({ theme }) => theme.spaceFive};
`;
