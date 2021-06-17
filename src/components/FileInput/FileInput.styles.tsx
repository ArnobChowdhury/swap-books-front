import styled from 'styled-components';
import { smallScreen } from 'mediaConfig';

export const StyledInput = styled.input`
  display: block;
  font-family: inherit;
  height: 0;
  visibility: hidden;
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
`;

export const PreviewContainer = styled.div`
  position: relative;
  cursor: pointer;
  margin-top: ${({ theme }) => theme.spaceFive};
  outline: none;
  display: flex;
  justify-content: center;

  &:focus {
    & > div {
      border: ${({ theme }) => `1px solid ${theme.colorPrimary3}`};
    }
    & > img {
      border: ${({ theme }) => `1px solid ${theme.colorPrimary3}`};
    }
  }
`;

export const PreviewPlaceholder = styled.div<{ show: boolean }>`
  position: absolute;
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
  left: 0;
  top: 0;
  width: 200px;
  height: 113px;
  border: ${({ theme }) => `1px solid ${theme.colorInputBox}`};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: ${({ theme }) => theme.borderRadius};

  @media (min-width: ${smallScreen}px) {
    width: 300px;
    height: 170px;
  }
`;

export const Preview = styled.img<{ show: boolean }>`
  width: 200px;
  height: 113px;
  border: ${({ theme }) => `1px solid ${theme.colorInputBox}`};
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
  object-fit: contain;
  border-radius: ${({ theme }) => theme.borderRadius};

  @media (min-width: ${smallScreen}px) {
    width: 300px;
    height: 170px;
  }
`;

export const Label = styled.label``;
