import styled from 'styled-components';
import { FlexItemProps } from './FlexItem';

interface FlexItemDivProps extends FlexItemProps {
  flexCss: string;
}

export const FlexItemDiv = styled.div<FlexItemDivProps>`
  box-sizing: border-box;
  padding: ${(props): string | null =>
    props.padding ? `${props.padding}px` : null};
  ${(props): string => props.flexCss}
  width: ${(props): string | null => (props.width ? props.width : null)};
  height: ${(props): string | null => (props.height ? props.height : null)};
`;
