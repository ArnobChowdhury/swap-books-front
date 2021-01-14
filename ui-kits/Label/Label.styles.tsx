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

export const Label = styled.label<InputStyleProps>`
  font-size: 1.5rem;
  ${({ labelAtTop }): string | false | undefined =>
    labelAtTop && 'font-weight: 600'};
  letter-spacing: 0.1rem;
  display: ${({ labelAtTop }): string | null => (!labelAtTop ? 'flex' : null)};
  align-items: ${({ labelAtTop }): string | null => (!labelAtTop ? 'center' : null)};
  margin-bottom: ${({ marginBottom }): string | null =>
    marginBottom ? marginBottom : null};
  flex-wrap: wrap;
`;

export const DIV = styled.div<InputStyleProps>`
  font-size: 1.5rem;
  ${({ labelAtTop }): string | false | undefined =>
    labelAtTop && 'font-weight: 600'};
  letter-spacing: 0.1rem;
  display: ${({ labelAtTop }): string | null => (!labelAtTop ? 'flex' : null)};
  align-items: ${({ labelAtTop }): string | null => (!labelAtTop ? 'center' : null)};
  margin-bottom: ${({ marginBottom }): string | null =>
    marginBottom ? marginBottom : null};
  flex-wrap: wrap;
`;

const labelAtSideMixin = css<InputStyleProps>`
  flex-basis: 18%;
  text-align: right;
  padding-right: ${(props): string | null => props.theme.spaceFive};
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
  ${({ labelAtTop }): string | false | undefined =>
    labelAtTop && 'font-weight: 400'};
  vertical-align: ${(props): string | null => (!props.labelAtTop ? 'top' : null)};
  color: ${({ labelAtTop, theme }): string | null =>
    !labelAtTop ? theme.colorRed : null};
`;
