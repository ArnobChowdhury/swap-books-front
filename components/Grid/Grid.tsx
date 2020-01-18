import { GridDiv } from './Grid.styles';
import GridColumn from './GridColumn';
import React, { ReactNode } from 'react';

export interface GridProps {
  alignContent?:
    | 'flex-end'
    | 'flex-start'
    | 'center'
    | 'stretch'
    | 'space-between'
    | 'space-around';
  alignItems?: 'flex-end' | 'flex-start' | 'center' | 'stretch' | 'baseline';
  children?: ReactNode;
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  justify?:
    | 'flex-end'
    | 'flex-start'
    | 'center'
    | 'space-between'
    | 'space-evenly'
    | 'space-around';
  spacing?: number;
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
}

const Grid = ({
  alignContent = 'stretch',
  alignItems = 'stretch',
  children,
  direction = 'row',
  justify = 'flex-start',
  spacing,
  wrap = 'wrap',
}: GridProps): JSX.Element => {
  let childrenArray;
  if (children) {
    childrenArray = React.Children.map(children, child => {
      if (React.isValidElement(child)) {
        if (
          typeof child.type === 'function' &&
          child.type.name === 'GridColumn'
        ) {
          return React.cloneElement(child, { padding: spacing });
        } else {
          return child;
        }
      } else {
        return null;
      }
    });
  }

  return (
    <GridDiv
      {...{ alignContent, alignItems, direction, justify, wrap, spacing }}
    >
      {childrenArray ? childrenArray : null}
    </GridDiv>
  );
};

export default Grid;

Grid.column = GridColumn;
// config.js
// import { configure } from '@storybook/react';
// // automatically import all files ending in *.stories.tsx
// configure(require.context('../components', true, /\.stories\.tsx?$/), module)

// webpack.config.js
// module.exports = ({ config }) => {
//   config.module.rules.push({
//     test: /\.(ts|tsx)$/,
//     loader: require.resolve('babel-loader'),
//     options: {
//       presets: [require.resolve('babel-preset-react-app')],
//     },
//   });
// addons.js
//   config.resolve.extensions.push('.ts', '.tsx');
//   return config;
// };
// import '@storybook/addon-knobs/register';
// import '@storybook/addon-docs/register';
