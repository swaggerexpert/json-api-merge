import jsonApiMerge from 'json-api-merge';

jsonApiMerge([{}], {}); // $ExpectType object
jsonApiMerge([{}], [{}]); // $ExpectType object

jsonApiMerge(null, {}); // $ExpectError
jsonApiMerge(undefined, [{}]); // $ExpectError
