import styled, {
  css,
  FlattenInterpolation,
  ThemedStyledProps,
} from 'styled-components';

interface InputStyleProps {
  labelAtTop?: boolean;
  labelMinWidth?: string;
  marginBottom?: string;
}

const labelAtSideMixin = css<InputStyleProps>`
  flex-basis: 18%;
  text-align: right;
  padding-right: ${(props): string | null => props.theme.spaceFive};
`;

export const Label = styled.label<InputStyleProps>`
  font-size: 1.5rem;
  letter-spacing: 0.1rem;
  display: ${(props): string | null => (!props.labelAtTop ? 'flex' : null)};
  align-items: ${(props): string | null => (!props.labelAtTop ? 'center' : null)};
  margin-bottom: ${({ marginBottom }): string | null =>
    marginBottom ? marginBottom : null};
  flex-wrap: wrap;
`;

export const LabelSpan = styled.span<InputStyleProps>`
  ${(
    props,
  ): FlattenInterpolation<
    ThemedStyledProps<InputStyleProps, HTMLSpanElement>
  > | null => (!props.labelAtTop ? labelAtSideMixin : null)};
  box-sizing: border-box;
  min-width: ${({ labelMinWidth }): string | null =>
    labelMinWidth ? labelMinWidth : null};
`;

export const RequiredSpan = styled.span<InputStyleProps>`
  font-size: ${(props): string | null => (props.labelAtTop ? '1.2rem' : '1.6rem')};
  vertical-align: ${(props): string | null => (!props.labelAtTop ? 'top' : null)};
  color: ${({ labelAtTop, theme }): string | null =>
    !labelAtTop ? theme.colorRed : null};
`;

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
  ${labelAtSideMixin}
  min-width: 10rem;
`;
