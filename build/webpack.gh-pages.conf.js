const path = require('path')
const webpack = require('webpack')
const config = require('./webpack.base.conf')

const TerserPlugin = require('terser-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

config.output.path = path.resolve(__dirname, '../gh-pages')

config.module.rules = (config.module.rules || []).concat([
  {
    test: /\.css$/,
    use: [
      { loader: 'style-loader' },
      { loader: 'css-loader' },
    ],
  },
])

config.optimization = {
  minimize: true,
  minimizer: [
    new TerserPlugin({
      extractComments: false,
      terserOptions: {
        format: {
          comments: false,
        },
      },
    }),
  ],
},

config.plugins = (config.plugins || []).concat([
  new HtmlWebpackPlugin({
    title: 'Vue It Bigger!',
    fileName: 'index.html',
    template: path.resolve(__dirname, '../src/index.html'),
    inject: false,
  }),

  new webpack.NoEmitOnErrorsPlugin(),
])

module.exports = config
