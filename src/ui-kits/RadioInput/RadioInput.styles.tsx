import styled from 'styled-components';

export const Input = styled.input`
  margin-right: ${({ theme }) => theme.spaceTwo};
`;

export const RadioLabel = styled.label`
  display: inline-flex;
`;

export const LabelSpan = styled.span`
  margin-right: ${({ theme }) => theme.spaceFive};
  font-size: 1.5rem;
  font-weight: 400;
`;
