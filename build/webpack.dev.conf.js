const config = require('./webpack.base.conf')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const path = require('path')

config.devtool = '#eval-source-map'

config.devServer = {
  host: 'localhost',
  port: 1805,
  historyApiFallback: true,
  hotOnly: true,
  overlay: true,
  noInfo: true,
}

config.module.rules = (config.module.rules || []).concat([
  {
    test: /\.css$/,
    use: [
      { loader: 'style-loader' },
      { loader: 'css-loader' },
    ],
  },
])

config.plugins = (config.plugins || []).concat([
  new HtmlWebpackPlugin({
    title: 'Vue It Bigger (Vladfork)!',
    filename: 'index.html',
    template: path.resolve(__dirname, '../src/index.html'),
  }),

  new webpack.NoEmitOnErrorsPlugin(),
])

module.exports = config
