import styled from 'styled-components';

export const ErrorWrapper = styled.div`
  flex-basis: 100%;
  display: flex;
  height: 2rem;
`;

export const ErrorText = styled.div`
  font-size: ${({ theme }): string => theme.fontSizeSmall};
  font-weight: 600;
  line-height: ${({ theme }): string => theme.spaceTen};
  color: ${({ theme }): string => theme.colorRed};
  flex-grow: 1;
  margin-left: ${({ theme }): string => theme.spaceFour};
`;

export const ErrorGutter = styled.div`
  flex-basis: 18%;
  text-align: right;
  padding-right: ${(props): string | null => props.theme.spaceFive};
  min-width: 10rem;
`;
