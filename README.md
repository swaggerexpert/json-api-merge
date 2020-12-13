[![Node CI](https://github.com/char0n/json-api-merge/workflows/Node.js%20CI/badge.svg)](https://github.com/char0n/json-api-merge/actions?query=workflow%3A%22Node.js+CI%22)

# JSON API Merge

`json-api-merge` is a JSON:API specific redundant duplication algorithm for merging included resources into original data.

## Getting Started

### Installation

```sh
npm i json-api-merge
```
or
```sh
yarn add json-api-merge
```

### Usage

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

#### ES2O19

```javascript
import jsonApiMerge from 'json-api-merge'

jsonApiMerge(jsonApiData.included, jsonApiData.data)
```

#### Node

```javascript
const jsonApiMerge = require('json-api-merge');

jsonApiMerge(jsonApiData.included, jsonApiData.data);
```

Result would be following data structure.

```js
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
```

The library can also process data in **list** format and can transform this:

```js
{
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
}
```

into this:

```js
[
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
]
```

### Compound document

To reduce the number of HTTP requests, servers MAY allow responses that include related resources
along with the requested primary resources. Such responses are called [“compound documents”](https://jsonapi.org/format/1.1/#document-compound-documents).

```js
const jsonApiData = {
  data: [
    {
      type: 'articles',
      id: '1',
      attributes: {
        title: 'JSON:API paints my bikeshed!',
      },
      links: {
        self: 'http://example.com/articles/1',
      },
      relationships: {
        author: {
          links: {
            self: 'http://example.com/articles/1/relationships/author',
            related: 'http://example.com/articles/1/author',
          },
          data: { type: 'people', id: '9' },
        },
        comments: {
          links: {
            self: 'http://example.com/articles/1/relationships/comments',
            related: 'http://example.com/articles/1/comments',
          },
          data: [
            { type: 'comments', id: '5' },
            { type: 'comments', id: '12' },
          ],
        },
      },
    },
  ],
  included: [
    {
      type: 'people',
      id: '9',
      attributes: {
        firstName: 'Dan',
        lastName: 'Gebhardt',
        twitter: 'dgeb',
      },
      links: {
        self: 'http://example.com/people/9',
      },
    },
    {
      type: 'comments',
      id: '5',
      attributes: {
        body: 'First!',
      },
      relationships: {
        author: {
          data: { type: 'people', id: '2' },
        },
      },
      links: {
        self: 'http://example.com/comments/5',
      },
    },
    {
      type: 'comments',
      id: '12',
      attributes: {
        body: 'I like XML better',
      },
      relationships: {
        author: {
          data: { type: 'people', id: '9' },
        },
      },
      links: {
        self: 'http://example.com/comments/12',
      },
    },
  ],
};
```

Compound documents can achieve full linkage with the following trick:

```js
const included = jsonApiMerge(jsonApiData.included, jsonApiData.included);
jsonApiMerge(included, jsonApiData.data);
```

This operation will generate following compound document with full linkage:

````js
[
  {
    type: 'articles',
    id: '1',
    attributes: {
      title: 'JSON:API paints my bikeshed!',
    },
    links: {
      self: 'http://example.com/articles/1',
    },
    relationships: {
      author: {
        links: {
          self: 'http://example.com/articles/1/relationships/author',
          related: 'http://example.com/articles/1/author',
        },
        data: {
          type: 'people',
          id: '9',
          attributes: {
            firstName: 'Dan',
            lastName: 'Gebhardt',
            twitter: 'dgeb',
          },
          links: {
            self: 'http://example.com/people/9',
          },
        },
      },
      comments: {
        links: {
          self: 'http://example.com/articles/1/relationships/comments',
          related: 'http://example.com/articles/1/comments',
        },
        data: [
          {
            type: 'comments',
            id: '5',
            attributes: {
              body: 'First!',
            },
            relationships: {
              author: {
                data: {
                  type: 'people',
                  id: '2',
                },
              },
            },
            links: {
              self: 'http://example.com/comments/5',
            },
          },
          {
            type: 'comments',
            id: '12',
            attributes: {
              body: 'I like XML better',
            },
            relationships: {
              author: {
                data: {
                  type: 'people',
                  id: '9',
                  attributes: {
                    firstName: 'Dan',
                    lastName: 'Gebhardt',
                    twitter: 'dgeb',
                  },
                  links: {
                    self: 'http://example.com/people/9',
                  },
                },
              },
            },
            links: {
              self: 'http://example.com/comments/12',
            },
          },
        ],
      },
    },
  },
];
````

## Motivation

I was looking for a simple way how to merge the `included` into `data` without compromising data
structures. All other libraries that I tested were opionated about how the resulting merge should look like.
This library has no opinion and simply merged the `included` into `data`. It does nothing else.

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
