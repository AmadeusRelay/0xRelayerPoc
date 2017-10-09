const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');
const path = require('path');

module.exports = {
  entry: './src/index.ts',
  devtool: 'source-map',
  watch: true,
  target: "node",
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: 'ts-loader'
      }
    ],
    loaders: [
      {
        test: /src\/.+.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },
  plugins: [
      new NodemonPlugin({watch: path.resolve('./dist')}),
  ],
  resolve: {
    extensions: [ ".ts", ".js" ]
  },
  output: {
    filename: 'server.js',
    path: path.resolve(__dirname, 'dist')
  }
};