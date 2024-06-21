'use strict';

const path = require('node:path');
const { globSync } = require('glob'); // eslint-disable-line import/no-extraneous-dependencies

module.exports = {
  mode: 'production',
  target: 'web',
  entry: [
    ...globSync(path.join(__dirname, './test/*.js'), {}),
  ],
  output: {
    path: path.resolve('.'),
    filename: 'tmp-test-bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        loader: 'babel-loader',
      },
    ],
  },
};
