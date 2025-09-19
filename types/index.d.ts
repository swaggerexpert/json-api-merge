declare function jsonApiMerge(included: object[], resource: object | object[]): object;
declare function jsonApiMerge(included: object[]): (resource: object | object[]) => object;

export default jsonApiMerge;
