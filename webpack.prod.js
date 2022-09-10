/* eslint-disable @typescript-eslint/no-var-requires */
const CompressionPlugin = require('compression-webpack-plugin')
const webpackBase = require('./webpack.config')
const TerserPlugin = require('terser-webpack-plugin')
module.exports = Object.assign(webpackBase, {
  output: {
    ...webpackBase.output,
    publicPath: '/assets/', // JS files are served from `/assets` by web
  },
  plugins: [...webpackBase.plugins, new CompressionPlugin({})],
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        minify: TerserPlugin.swcMinify,
        // `terserOptions` options will be passed to `swc` (`@swc/core`)
        // Link to options - https://swc.rs/docs/config-js-minify
        terserOptions: {},
      }),
    ],
  },
})
