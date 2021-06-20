const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { EnvironmentPlugin } = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { HOST = 'localhost', PORT = '8000' } = process.env;

module.exports = {
  mode: 'development',

  entry: {
    main: ['./src/index.tsx'],
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].[fullhash].js',
  },

  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: {
      src: 'src',
    },
  },

  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'esbuild-loader',
            options: {
              loader: 'tsx',
              target: 'es2015',
            },
          },
        ],
      },
    ],
  },

  devServer: {
    host: HOST,
    port: PORT,
    historyApiFallback: true,
    progress: false,
    overlay: true,
    hot: true,
    // fix webpack-dev-server crashing with sockjs-node
    // https://github.com/webpack/webpack-dev-server/issues/2628#issuecomment-634475007
    // transportMode: 'ws',
  },

  plugins: [
    new CleanWebpackPlugin(),

    new EnvironmentPlugin({}),

    new ReactRefreshWebpackPlugin(),

    new HtmlWebpackPlugin(),
  ],
};
