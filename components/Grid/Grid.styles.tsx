import styled from 'styled-components';
import { GridProps } from './Grid';
import { GridColumnProps } from './GridColumn';

interface GridDivProps {
  direction: string;
  alignContent: string;
}

interface ColumnDivProps extends GridColumnProps {
  gridCss: string;
}

export const GridDiv = styled.div<GridProps>`
  display: flex;
  flex-wrap: ${(props): string | null => (props.wrap ? props.wrap : null)};
  flex-direction: ${(props): string | null =>
    props.direction ? props.direction : null};
  justify-content: ${(props): string | null =>
    props.justify ? props.justify : null};
  align-content: ${(props): string | null =>
    props.alignContent ? props.alignContent : null};
  align-items: ${(props): string | null =>
    props.alignItems ? props.alignItems : null};
  width: ${(props): string | null =>
    props.spacing ? `calc(100% + ${props.spacing * 2})px` : null};
  margin: ${(props): string | null =>
    props.spacing ? `-${props.spacing}px` : null};
  box-sizing: border-box;
`;

export const ColumnDiv = styled.div<ColumnDivProps>`
  box-sizing: border-box;
  padding: ${(props): string | null =>
    props.padding ? `${props.padding}px` : null};
  ${(props): string => props.gridCss}
`;

export const GridInnerDiv = styled.div`
  box-sizing: border-box;
  background: #ff8398;
  color: white;
  font-size: 14px;
  padding: 10px;
  text-align: center;
  font-family: 'ubuntu';
`;
