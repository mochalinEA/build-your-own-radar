'use strict'

const path = require('path')
const buildPath = path.join(__dirname, './dist')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssPresetEnv = require('postcss-preset-env')
const cssnano = require('cssnano')

const main = ['./src/site.js']

const plugins = [
  new MiniCssExtractPlugin({ filename: '[name].[hash].css' }),
  new HtmlWebpackPlugin({
    template: './src/index.html',
    chunks: ['main'],
    inject: 'body',
  }),
]

module.exports = {
  entry: {
    main: main,
  },

  output: {
    path: buildPath,
    publicPath: '/',
    filename: '[name].[hash].js',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.scss$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { importLoaders: 1 },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                postcssPresetEnv({ browsers: 'last 2 versions' }),
                cssnano({
                  preset: ['default', { discardComments: { removeAll: true } }],
                }),
              ],
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader?name=images/[name].[ext]',
      },
      {
        test: /\.(png|jpg|ico)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader?name=images/[name].[ext]&context=./src/images',
          },
        ],
      },
      {
        test: require.resolve('jquery'),
        use: [
          { loader: 'expose-loader', options: 'jQuery' },
          { loader: 'expose-loader', options: '$' },
        ],
      },
    ],
  },

  plugins: plugins,

  devServer: {
    contentBase: buildPath,
    host: '0.0.0.0',
    port: 3000,
  },
}
