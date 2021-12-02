import * as t from '@babel/types';
import type { NodePath } from '@babel/traverse';
export interface PathExtend extends NodePath<t.JSXElement> {
    tagName?: string;
}
export interface Attrs {
    key: string;
    value: string | Array<Attrs> | undefined;
    type: t.StringLiteral | t.ObjectExpression | t.CallExpression | t.Identifier | null;
}
