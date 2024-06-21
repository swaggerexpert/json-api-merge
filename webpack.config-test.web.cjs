'use strict';

const path = require('node:path');
const { globSync } = require('glob'); // eslint-disable-line import/no-extraneous-dependencies

module.exports = {
  mode: 'production',
  target: 'web',
  entry: [
    '@babel/polyfill',
    ...globSync(path.join(__dirname, './test/*.js'), {
      ignore: ['./test/mocha-bootstrap.js'],
    }),
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
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                forceAllTransforms: true,
              },
            ],
          ],
          plugins: [
            [
              '@babel/plugin-transform-modules-commonjs',
              {
                loose: true,
              },
            ],
          ],
        },
      },
    ],
  },
};
