import { assert } from 'chai';

import jsonApiMerge from '../src';

describe('jsonApiMerge', function () {
  context('given single resource', function () {
    context('and has one-to-one relationship', function () {
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

      specify('should merge included', function () {
        const expected = {
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
        };
        const actual = jsonApiMerge(jsonApiData.included, jsonApiData.data);

        assert.deepEqual(actual, expected);
      });
    });

    context('and has one-to-many relationship', function () {
      const jsonApiData = {
        data: {
          id: 1,
          type: 'resource',
          attributes: {
            name: 'Resource name',
          },
          relationships: {
            related: {
              data: [
                {
                  id: 2,
                  type: 'related_resource',
                },
                {
                  id: 3,
                  type: 'related_resource',
                },
              ],
            },
          },
        },
        included: [
          {
            id: 2,
            type: 'related_resource',
            attributes: {
              name: 'Related resource foo',
            },
          },
          {
            id: 3,
            type: 'related_resource',
            attributes: {
              name: 'Related resource bar',
            },
          },
        ],
      };

      specify('should merge included', function () {
        const expected = {
          id: 1,
          type: 'resource',
          attributes: {
            name: 'Resource name',
          },
          relationships: {
            related: {
              data: [
                {
                  id: 2,
                  type: 'related_resource',
                  attributes: {
                    name: 'Related resource foo',
                  },
                },
                {
                  id: 3,
                  type: 'related_resource',
                  attributes: {
                    name: 'Related resource bar',
                  },
                },
              ],
            },
          },
        };
        const actual = jsonApiMerge(jsonApiData.included, jsonApiData.data);

        assert.deepEqual(actual, expected);
      });
    });

    context('and non matching includes', function () {
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
            id: 3,
            type: 'related_resource',
            attributes: {
              name: 'Related resource name',
            },
          },
        ],
      };

      specify(
        'should return original resource relationship representation',
        function () {
          const actual = jsonApiMerge(jsonApiData.included, jsonApiData.data);

          assert.deepEqual(actual, jsonApiData.data);
        }
      );
    });

    context('and non existing includes', function () {
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
      };

      specify('should return original resource', function () {
        const actual1 = jsonApiMerge(null, jsonApiData.data);
        const actual2 = jsonApiMerge(undefined, jsonApiData.data);

        assert.deepEqual(actual1, jsonApiData.data);
        assert.deepEqual(actual2, jsonApiData.data);
      });
    });
  });

  context('given multiple resources', function () {
    context('and has one-to-one relationship', function () {
      const jsonApiData = {
        data: [
          {
            id: 1,
            type: 'resource',
            attributes: {
              name: 'Resource foo',
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
          {
            id: 3,
            type: 'resource',
            attributes: {
              name: 'Resource bar',
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

      specify('should merge included', function () {
        const expected = [
          {
            id: 1,
            type: 'resource',
            attributes: {
              name: 'Resource foo',
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
          },
          {
            id: 3,
            type: 'resource',
            attributes: {
              name: 'Resource bar',
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
          },
        ];
        const actual = jsonApiMerge(jsonApiData.included, jsonApiData.data);

        assert.deepEqual(actual, expected);
      });
    });

    context('and has one-to-many relationship', function () {
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
                data: [
                  {
                    id: 2,
                    type: 'related_resource',
                  },
                  {
                    id: 3,
                    type: 'related_resource',
                  },
                ],
              },
            },
          },
          {
            id: 4,
            type: 'resource',
            attributes: {
              name: 'Resource name',
            },
            relationships: {
              related: {
                data: [
                  {
                    id: 2,
                    type: 'related_resource',
                  },
                  {
                    id: 5,
                    type: 'related_resource',
                  },
                ],
              },
            },
          },
        ],
        included: [
          {
            id: 2,
            type: 'related_resource',
            attributes: {
              name: 'Related resource foo',
            },
          },
          {
            id: 3,
            type: 'related_resource',
            attributes: {
              name: 'Related resource bar',
            },
          },
          {
            id: 5,
            type: 'related_resource',
            attributes: {
              name: 'Related resource foobar',
            },
          },
        ],
      };

      specify('should merge included', function () {
        const expected = [
          {
            id: 1,
            type: 'resource',
            attributes: {
              name: 'Resource name',
            },
            relationships: {
              related: {
                data: [
                  {
                    id: 2,
                    type: 'related_resource',
                    attributes: {
                      name: 'Related resource foo',
                    },
                  },
                  {
                    id: 3,
                    type: 'related_resource',
                    attributes: {
                      name: 'Related resource bar',
                    },
                  },
                ],
              },
            },
          },
          {
            id: 4,
            type: 'resource',
            attributes: {
              name: 'Resource name',
            },
            relationships: {
              related: {
                data: [
                  {
                    id: 2,
                    type: 'related_resource',
                    attributes: {
                      name: 'Related resource foo',
                    },
                  },
                  {
                    id: 5,
                    type: 'related_resource',
                    attributes: {
                      name: 'Related resource foobar',
                    },
                  },
                ],
              },
            },
          },
        ];
        const actual = jsonApiMerge(jsonApiData.included, jsonApiData.data);

        assert.deepEqual(actual, expected);
      });
    });

    context('and non matching includes', function () {
      const jsonApiData = {
        data: [
          {
            id: 1,
            type: 'resource',
            attributes: {
              name: 'Resource foo',
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
          {
            id: 3,
            type: 'resource',
            attributes: {
              name: 'Resource bar',
            },
            relationships: {
              related: {
                data: {
                  id: 4,
                  type: 'related_resource',
                },
              },
            },
          },
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

      specify(
        'should return original resource relationship representation',
        function () {
          const expecte = [
            {
              id: 1,
              type: 'resource',
              attributes: {
                name: 'Resource foo',
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
            },
            {
              id: 3,
              type: 'resource',
              attributes: {
                name: 'Resource bar',
              },
              relationships: {
                related: {
                  data: {
                    id: 4,
                    type: 'related_resource',
                  },
                },
              },
            },
          ];
          const actual = jsonApiMerge(jsonApiData.included, jsonApiData.data);

          assert.deepEqual(actual, expecte);
        }
      );
    });

    context('and non existing includes', function () {
      const jsonApiData = {
        data: [
          {
            id: 1,
            type: 'resource',
            attributes: {
              name: 'Resource foo',
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
          {
            id: 3,
            type: 'resource',
            attributes: {
              name: 'Resource bar',
            },
            relationships: {
              related: {
                data: {
                  id: 4,
                  type: 'related_resource',
                },
              },
            },
          },
        ],
      };

      specify('should return original resource', function () {
        const actual1 = jsonApiMerge(null, jsonApiData.data);
        const actual2 = jsonApiMerge(undefined, jsonApiData.data);

        assert.deepEqual(actual1, jsonApiData.data);
        assert.deepEqual(actual2, jsonApiData.data);
      });
    });
  });

  context('given compound document', function () {
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

    specify('should create full linkage', function () {
      const expected = [
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

      const included = jsonApiMerge(jsonApiData.included, jsonApiData.included);
      const actual = jsonApiMerge(included, jsonApiData.data);

      assert.deepEqual(actual, expected);
    });
  });

  context("given relationships doesn't have data property", function () {
    const jsonApiData = {
      data: {
        id: 1,
        type: 'resource',
        attributes: {
          name: 'Resource name',
        },
        relationships: {
          related: {
            links: {
              related: {
                href: 'http://example.com/related-resource/',
                title: 'Related',
              },
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

    specify('should throw error', function () {
      const expected = {
        id: 1,
        type: 'resource',
        attributes: {
          name: 'Resource name',
        },
        relationships: {
          related: {
            links: {
              related: {
                href: 'http://example.com/related-resource/',
                title: 'Related',
              },
            },
          },
        },
      };

      const actual = jsonApiMerge(jsonApiData.included, jsonApiData.data);

      assert.deepEqual(actual, expected);
    });
  });

  context(
    'given relationships have data property containing null',
    function () {
      const jsonApiData = {
        data: {
          id: 1,
          type: 'resource',
          attributes: {
            name: 'Resource name',
          },
          relationships: {
            related: {
              links: {
                related: {
                  href: 'http://example.com/related-resource/',
                  title: 'Related',
                },
              },
              data: null,
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

      specify('should do nothing', function () {
        const actual = jsonApiMerge(jsonApiData.included, jsonApiData.data);
        const expected = actual;

        assert.deepEqual(actual, expected);
      });
    }
  );

  it('should curry', function () {
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
    };

    assert.deepEqual(jsonApiMerge(null, jsonApiData.data), jsonApiData.data);
    assert.deepEqual(jsonApiMerge(null)(jsonApiData.data), jsonApiData.data);
  });
});
