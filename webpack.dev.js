const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const webpackBase = require('./webpack.config')

module.exports = Object.assign(webpackBase, {
  devtool: 'inline-source-map',
  devServer: {
    port: 3000,
    static: './artifacts',
    historyApiFallback: true,
    hot: true,
  },
  plugins: [...webpackBase.plugins, new ReactRefreshWebpackPlugin()],
})
