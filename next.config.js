const withPWA = require('next-pwa');
const runtimeCaching = require('./cache');

module.exports = withPWA({
  future: {
    webpack5: true,
  },
  pwa: {
    runtimeCaching,
    disable: process.env.NODE_ENV === 'development',
  },
});
