import {
  curry,
  has,
  keys,
  pipe,
  isNil,
  propOr,
  reduce,
  assoc,
  path as rpath,
  concat,
  insert,
  assocPath,
} from 'ramda';
import { mapIndexed, reduceIndexed, ensureArray, isArray } from 'ramda-adjunct';

// Type definitions:
//     Resource = Object
//     ResourceRel = {type: String, id: Number}
//     ResourceKey = String
//     Relationships = Object
//     Included = [Resource]
//     IncludedCache = {k: ResourceKey, v: Resource}
//     RelPath = {path: String, key: ResourceKey}

// getRelationships :: Resource -> Relationships
const getRelationships = pipe(propOr({}, ['relationships']), keys);

// resourceKey :: ResourceRel -> ResourceKey
const resourceKey = ({ type, id }) => `${type}-${id}`;

// createIncludedCache :: Included -> IncludedCache
const createIncludedCache = reduce(
  (acc, resource) => assoc(resourceKey(resource), resource, acc),
  {}
);

// relToPath :: (String, ResourceRel) -> RelPath
const relToPath = (relationship, { type, id }) => ({
  path: ['relationships', relationship, 'data'],
  key: resourceKey({ type, id }),
});

// relToPaths :: (String, [ResourceRel]) -> [RelPath]
const relToPaths = (relationship, resources) =>
  mapIndexed(
    (resource, index) => ({
      path: ['relationships', relationship, 'data', index],
      key: resourceKey(resource),
    }),
    resources
  );

// getRelPaths :: Resource -> [RelPath]
const getRelPaths = (resource) => {
  const relationships = getRelationships(resource);

  return reduce(
    (acc, relationship) => {
      const { data: relData } = resource.relationships[relationship];
      const paths = ensureArray(
        isArray(relData)
          ? relToPaths(relationship, relData)
          : relToPath(relationship, relData)
      );

      return concat(acc, paths);
    },
    [],
    relationships
  );
};

// jsonApiMergeSingle :: (Included, Resource) -> Resource
const jsonApiMergeSingle = (includedCache, resource) => {
  const relPaths = getRelPaths(resource);

  return reduce(
    (acc, { key, path }) => {
      const includedResource = has(key, includedCache)
        ? includedCache[key]
        : rpath(path, resource);

      return assocPath(path, includedResource, acc);
    },
    resource,
    relPaths
  );
};

// jsonApiMergeMulti :: (IncludedCache, [Resource]) -> [Resource]
const jsonApiMergeMulti = (includedCache, resources) =>
  reduceIndexed(
    (acc, datum, index) => {
      const mergedDatum = jsonApiMergeSingle(includedCache, datum);
      return insert(index, mergedDatum, acc);
    },
    [],
    resources
  );

// jsonApiMerge :: (Included, Resource) -> Resource
// jsonApiMerge :: (Included, [Resource]) -> [Resource]
const jsonApiMerge = curry((included, resource) => {
  if (isNil(included)) return resource;

  const includedCache = createIncludedCache(included);

  return isArray(resource)
    ? jsonApiMergeMulti(includedCache, resource)
    : jsonApiMergeSingle(includedCache, resource);
});

export default jsonApiMerge;
