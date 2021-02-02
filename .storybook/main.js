const path = require('path');
module.exports = {
  stories: [
    '../src/ui-kits/**/*.stories.tsx',
    '../src/components/**/*.stories.tsx',
    '../src/modules/**/*.stories.tsx',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  webpackFinal: async (config, { configType }) => {
    config.resolve.modules = [path.resolve(__dirname, '..', 'src'), 'node_modules'];

    return config;
  },
};
