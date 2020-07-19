import styled from 'styled-components';

export const DateInputWrapper = styled.div`
  display: flex;
  width: 300px;
`;

export const Input = styled.input<{ doubleWidth?: boolean }>`
  font-family: inherit;
  font-size: inherit;
  letter-spacing: ${({ theme }) => theme.spaceOne};
  text-align: center;
  width: ${({ doubleWidth }) => (doubleWidth ? '100px' : '60px')};
  min-height: 3.8rem;
  height: 3.8rem;
  border-radius: ${({ theme }) => theme.spaceOne};
  border: ${({ theme }) => `1px solid ${theme.colorGreyLight}`};

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  -moz-appearance: textfield;

  &:not(:last-child) {
    margin-right: ${({ theme }) => theme.spaceTen};
  }

  &::-webkit-input-placeholder {
    letter-spacing: normal;
  }

  &::-moz-placeholder {
    letter-spacing: normal;
  }

  &:-ms-input-placeholder {
    letter-spacing: normal;
  }

  &:-moz-placeholder {
    letter-spacing: normal;
  }
`;

interface InputStyleProps {
  labelMinWidth?: string;
  marginBottom?: string;
}
