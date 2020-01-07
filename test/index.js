import { assert } from 'chai';

import jsonApiMerge from '../src';

describe('jsonApiMerge', function() {
  context('given single resource', function() {
    context('and has one-to-one relationship', function() {
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

      specify('should merge included', function() {
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

    context('and has one-to-many relationship', function() {
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

      specify('should merge included', function() {
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

    context('and non matching includes', function() {
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
        function() {
          const actual = jsonApiMerge(jsonApiData.included, jsonApiData.data);

          assert.deepEqual(actual, jsonApiData.data);
        }
      );
    });

    context('and non existing includes', function() {
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

      specify('should return original resource', function() {
        const actual1 = jsonApiMerge(null, jsonApiData.data);
        const actual2 = jsonApiMerge(undefined, jsonApiData.data);

        assert.deepEqual(actual1, jsonApiData.data);
        assert.deepEqual(actual2, jsonApiData.data);
      });
    });
  });

  context('given multiple resources', function() {
    context('and has one-to-one relationship', function() {
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

      specify('should merge included', function() {
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

    context('and has one-to-many relationship', function() {
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

      specify('should merge included', function() {
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

    context('and non matching includes', function() {
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
        function() {
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

    context('and non existing includes', function() {
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

      specify('should return original resource', function() {
        const actual1 = jsonApiMerge(null, jsonApiData.data);
        const actual2 = jsonApiMerge(undefined, jsonApiData.data);

        assert.deepEqual(actual1, jsonApiData.data);
        assert.deepEqual(actual2, jsonApiData.data);
      });
    });
  });

  it('should curry', function() {
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
