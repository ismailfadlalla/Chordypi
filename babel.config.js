// Babel configuration for Expo web build
// Updated: 2026-03-26 - Vercel verified deploymentmodule.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: []
  };
};