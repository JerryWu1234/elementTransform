import type { Identifier, StringLiteral, ObjectExpression } from '@babel/types';
import * as t from '@babel/types';
export declare function getTag(name: string): string;
export declare function getIdentifier(node: Identifier | StringLiteral): string;
export declare function createObjectProprety(key: string, expression: ObjectExpression): t.ObjectProperty;
export declare function objectTransformArray(object: Record<string, any>): Record<string, any>[];
