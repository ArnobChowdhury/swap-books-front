import styled, {
  css,
  FlattenInterpolation,
  ThemedStyledProps,
} from 'styled-components';

interface InputStyleProps {
  labelAtTop: boolean;
}

const labelAtSideMixin = css<InputStyleProps>`
  flex-basis: 20%;
  text-align: right;
  padding-right: 1rem;
`;

export const Label = styled.label<InputStyleProps>`
  font-size: 1rem;
  display: ${(props): string | null => (!props.labelAtTop ? 'flex' : null)};
  align-items: ${(props): string | null => (!props.labelAtTop ? 'center' : null)};
`;

export const LabelSpan = styled.span<InputStyleProps>`
  ${(
    props,
  ): FlattenInterpolation<
    ThemedStyledProps<InputStyleProps, HTMLSpanElement>
  > | null => (!props.labelAtTop ? labelAtSideMixin : null)};
  box-sizing: border-box;
`;

export const RequiredSpan = styled.span<InputStyleProps>`
  font-size: ${(props): string | null => (props.labelAtTop ? '.8rem' : '1rem')};
  vertical-align: ${(props): string | null => (!props.labelAtTop ? 'top' : null)};
  color: ${(props): string | null => (!props.labelAtTop ? '#ff0000' : null)};
`;
