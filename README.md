# JSON API Merge

`json-api-merge` is a JSON:API specific algorithm for merging included resources into original data.

### Getting Started

### Installation

```sh
npm i @char0n/json-api-merge
```
or
```sh
yarn add @char0n/json-api-merge
```

### Usage

#### ES2O19

```js
const jsonApiData = {
  data: {
    id: 1,
    type: 'resource',
    attributes: {
      name: 'Resource name',
    },
    relationships: {
      related: {
        data: {
          id: 2,
          type: 'related_resource',
        },
      },
    },
  },
  included: [
    {
      id: 2,
      type: 'related_resource',
      attributes: {
        name: 'Related resource name',
      },
    },
  ],
};
```


```javascript
import jsonApiMerge from '@char0n/json-api-merge'

jsonApiMerge(jsonApiData.included, jsonApiData.data)
```

#### Node

```javascript
const jsonApiMerge = require('@char0n/json-api-merge');

jsonApiMerge(jsonApiData.included, jsonApiData.data);
```

Result would be following data structure.

```js
const jsonApiData = {
  id: 1,
  type: 'resource',
  attributes: {
   name: 'Resource name',
  },
  relationships: {
    related: {
      data: {
       id: 2,
       type: 'related_resource',
       attributes: {
         name: 'Related resource name',
       },
      },
    },
  },
}
```

The library can also process data in list format and can transform this:

```js
const jsonApiData = {
  data: [
    {
      id: 1,
      type: 'resource',
      attributes: {
        name: 'Resource name',
      },
      relationships: {
        related: {
          data: {
            id: 2,
            type: 'related_resource',
          },
        },
      },
    }
  ],
  included: [
    {
      id: 2,
      type: 'related_resource',
      attributes: {
        name: 'Related resource name',
      },
    },
  ],
};
```

into this:

```js
const jsonApiData = [
  {
    id: 1,
    type: 'resource',
    attributes: {
      name: 'Resource name',
    },
    relationships: {
      related: {
        data: {
          id: 2,
          type: 'related_resource',
          attributes: {
            name: 'Related resource name',
          },
        },
      },
    },
  }
];
```

## Motivation

I was looking for a simple way how to merge the `included` into `data` without compromising data
structures. All other libraries that I tested were opionated about how the resulting merge should look like.
This library has no opinion and simply merged the `included` into `data`. It does nothing else.

## Requirements

Peer dependencies of [Ramda](https://github.com/ramda/ramda) and [RamdaAdjunct](https://github.com/char0n/ramda-adjunct).

 - ramda >= 0.19.0 <= 0.26.1
 - ramda-adjunct >=0.3.0

## Contributing

If you want to contribute to this project, please consult the [CONTRIBUTING.md](https://github.com/char0n/ramda-adjunct/blob/master/CONTRIBUTING.md) guidelines.

**Obtaining project copy**

```sh
 $ git clone https://github.com/char0n/json-api-merge
 $ npm i
```

**Running tests**
```sh
 $ npm run test
```

**Running tests in browser**
```sh
 $ npm run test:web
```


**Running code coverage numbers**
```sh
 $ npm run coverage
```

**Running linter**

We're using [eslint](https://eslint.org/) and [airbnb codestyle](https://github.com/airbnb/javascript) rules with [prettier](https://prettier.io/) integrated as an eslint plugin.

```sh
 $ npm run lint
```

## Typescript support

Although json-api-merge is written in ES2019, we also support **Typescript**. When json-api-merge gets imported into a Typescript project, typings are automatically imported and used.

## Author

 char0n (Vladimir Gorej)

 vladimir.gorej@gmail.com

 https://www.linkedin.com/in/vladimirgorej/
