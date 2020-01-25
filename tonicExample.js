require('ramda');
require('ramda-adjunct');
var jsonApiMerge = require('@char0n/json-api-merge');

var jsonApiData = {
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

jsonApiMerge(jsonApiData.included, jsonApiData.data);
