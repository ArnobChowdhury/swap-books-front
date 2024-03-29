import styled from 'styled-components';
import { FlexContainerProps } from './FlexContainer';

export const ContainerDiv = styled.div<FlexContainerProps>`
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
  height: ${(props): string | null => (props.height ? props.height : null)};
`;

// Just for story purpose

export const InnerDiv = styled.div`
  box-sizing: border-box;
  border-radius: 0.2rem;
  background: #ffc426;
  color: rgb(42, 42, 42);
  font-size: 2rem;
  padding: 1rem;
  text-align: center;
  font-family: inherit;
`;
