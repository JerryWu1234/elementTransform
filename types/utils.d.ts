import type { ObjectExpression } from '@babel/types';
import type { Attrs } from './type';
import * as t from '@babel/types';
export declare function getTag(name: string): string;
export declare function createObjectProprety(key: string, expression: ObjectExpression): t.ObjectProperty;
export declare function objectTransformArray(object: Record<string, any>): Record<string, any>[];
export declare function astAttrsIntoObject(properties: Array<t.ObjectProperty>, attrsList: Array<Attrs>): void;
export declare function getFunctionBody(str: string): string;
export declare function camel(string: string): string;
