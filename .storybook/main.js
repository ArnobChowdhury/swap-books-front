const path = require('path');
module.exports = {
  stories: [
    '../components/Button/*.stories.tsx',
    '../components/IconButton/*.stories.tsx',
    '../components/Post/*.stories.tsx',
    '../components/PostOption/*.stories.tsx',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  webpackFinal: async (config, { configType }) => {
    config.resolve.modules = [path.resolve(__dirname, '..'), 'node_modules'];

    return config;
  },
};
