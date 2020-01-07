/* tslint:disable:no-single-declare-module */
declare module 'json-api-merge' {
    function jsonApiMerge(included: object[], resource: object|object[]): object;
    function jsonApiMerge(included: object[]): (resource: object|object[]) => object;

    export default jsonApiMerge;
}
