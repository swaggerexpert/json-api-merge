import { expectType, expectError } from 'tsd';
import jsonApiMerge from './index';

// Test basic functionality with objects
expectType<object>(jsonApiMerge([{}], {}));
expectType<object>(jsonApiMerge([{}], [{}]));

// Test curried version
const curriedMerge = jsonApiMerge([{}]);
expectType<object>(curriedMerge({}));
expectType<object>(curriedMerge([{}]));

// Test that null/undefined included arrays cause errors
expectError(jsonApiMerge(null, {}));
expectError(jsonApiMerge(undefined, [{}]));
