const path = require('path');
module.exports = {
  stories: ['../components/**/*.stories.tsx'],
  webpackFinal: async config => {
    config.module.rules.push({
      test: /\.(ts|tsx)$/,
      use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [['react-app', { flow: false, typescript: true }]],
              }, 
            }, 
            {
              loader: 'react-docgen-typescript-loader'
            }
          ],
    });
    config.resolve.extensions.push('.ts', '.tsx');
    return config;
  },
  addons: ['@storybook/addon-docs', 
           '@storybook/addon-knobs/register',
           '@storybook/addon-actions/register',
           '@storybook/addon-links/register',
           '@storybook/addon-a11y/register',
           '@storybook/addon-backgrounds/register',
          ],
};