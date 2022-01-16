'use strict'
const path = require('path')
const buildPath = path.join(__dirname, './dist')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const postcssPresetEnv = require('postcss-preset-env')
const cssnano = require('cssnano')
const webpack = require('webpack')

const getProjectNames = require('./src/util/getProjectNames.js')

const projects = getProjectNames('./src/data')

const pagesPlugins = projects.map((projectName) => {
  return new HtmlWebpackPlugin({
    template: './src/project.html',
    chunks: ['main'],
    inject: 'body',
    filename: `${projectName}/index.html`
  })
})

const plugins = [
  new webpack.DefinePlugin({'process.env.proj': JSON.stringify(projects)}),
  new MiniCssExtractPlugin({ filename: '[name].[hash].css' }),
  new HtmlWebpackPlugin({
    template: './src/index.html',
    chunks: ['main'],
    inject: 'body',
  }),
  ...pagesPlugins
]

module.exports = {
  entry: {
    main: ['./src/site.js'],
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
        test: /\.(csv)$/,
        loader: 'file-loader?name=data/[name].[ext]',
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
    open: true,
    contentBase: buildPath,
    port: 3000,
  },
}
