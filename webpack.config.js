'use strict';

const webpack = require('webpack');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const nonMinimizeTrait = {
  optimization: {
    minimize: false,
    usedExports: false,
    concatenateModules: false,
  },
};

const minimizeTrait = {
  plugins: [
    new webpack.LoaderOptionsPlugin({
      minimize: true,
    }),
  ],
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            warnings: false,
          },
          output: {
            comments: false,
          },
        },
      }),
    ],
  },
};

const web = {
  mode: 'production',
  entry: './src/index.js',
  target: 'web',
  output: {
    path: path.resolve('./dist'),
    filename: 'web.js',
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: 'JsonApiMerge',
  },
  externals: {
    ramda: 'R',
    'ramda-adjunct': 'RA',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  ...nonMinimizeTrait,
};

const webMin = {
  mode: 'production',
  entry: './src/index.js',
  target: 'web',
  output: {
    path: path.resolve('./dist'),
    filename: 'web.min.js',
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: 'JsonApiMerge',
  },
  externals: {
    ramda: 'R',
    'ramda-adjunct': 'RA',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  ...minimizeTrait,
};

const webStandalone = {
  mode: 'production',
  entry: './src/index.js',
  target: 'web',
  output: {
    path: path.resolve('./dist'),
    filename: 'web.standalone.js',
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: 'JsonApiMerge',
  },
  performance: {
    maxAssetSize: 780000,
    maxEntrypointSize: 780000,
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  ...nonMinimizeTrait,
};

const webStandaloneMin = {
  mode: 'production',
  entry: './src/index.js',
  target: 'web',
  output: {
    path: path.resolve('./dist'),
    filename: 'web.standalone.min.js',
    libraryTarget: 'umd',
    libraryExport: 'default',
    library: 'JsonApiMerge',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
  ...minimizeTrait,
};

module.exports = [web, webMin, webStandalone, webStandaloneMin];
