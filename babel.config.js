'use strict';

module.exports = {
  env: {
    commonjs: {
      presets: [
        [
          '@babel/preset-env',
          {
            debug: false,
            modules: 'commonjs',
            loose: true,
            useBuiltIns: false,
            forceAllTransforms: false,
            ignoreBrowserslistConfig: false,
          },
        ],
      ],
      plugins: ['add-module-exports'],
    },
    es: {
      presets: [
        [
          '@babel/preset-env',
          {
            debug: false,
            modules: false,
            useBuiltIns: false,
            forceAllTransforms: false,
            ignoreBrowserslistConfig: false,
          },
        ],
      ],
    },
    browser: {
      presets: [
        [
          '@babel/preset-env',
          {
            debug: false,
            modules: 'auto',
            useBuiltIns: false,
            forceAllTransforms: false,
            ignoreBrowserslistConfig: false,
          },
        ],
      ],
    },
  },
};
