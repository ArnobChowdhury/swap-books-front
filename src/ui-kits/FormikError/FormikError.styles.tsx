import styled from 'styled-components';

export const ErrorWrapper = styled.div<{ noFlexBasis: boolean }>`
  flex-basis: ${({ noFlexBasis }) => (!noFlexBasis ? '100%' : 'auto')};
  display: flex;
  min-height: 2.5rem;
`;

export const ErrorText = styled.div`
  font-size: ${({ theme }): string => theme.fontSmall};
  font-weight: 400;
  line-height: 2.5rem;
  color: ${({ theme }): string => theme.colorAlert};
  flex-grow: 1;
`;

export const ErrorGutter = styled.div`
  flex-basis: 18%;
  text-align: right;
  padding-right: ${(props): string | null => props.theme.spaceFive};
  min-width: 10rem;
`;
