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
  font-size: ${({ theme }) => theme.fontSmall};
  font-weight: 400;
  display: ${({ labelAtTop }): string | null => (!labelAtTop ? 'flex' : null)};
  align-items: ${({ labelAtTop }): string | null => (!labelAtTop ? 'center' : null)};
  margin-bottom: ${({ marginBottom }): string | null =>
    marginBottom ? marginBottom : null};
  flex-wrap: wrap;
`;

export const DIV = styled.div<InputStyleProps>`
  ${({ labelAtTop }): string | false | undefined =>
    labelAtTop && 'font-weight: 600'};
  display: ${({ labelAtTop }): string | null => (!labelAtTop ? 'flex' : null)};
  align-items: ${({ labelAtTop }): string | null => (!labelAtTop ? 'center' : null)};
  margin-bottom: ${({ marginBottom }): string | null =>
    marginBottom ? marginBottom : null};
  flex-wrap: wrap;
  font-weight: 500;
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
  font-size: ${({ theme }): string | null => theme.fontSmall};
  ${({ labelAtTop }): string | false | undefined =>
    labelAtTop && 'font-weight: 400'};
  vertical-align: ${(props): string | null => (!props.labelAtTop ? 'top' : null)};
  color: ${({ labelAtTop, theme }): string | null =>
    !labelAtTop ? theme.colorRed : null};
`;
