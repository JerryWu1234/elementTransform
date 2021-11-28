import * as t from '@babel/types';
import type { NodePath } from '@babel/traverse';
export interface pathExtend extends NodePath<t.JSXElement> {
    tagName?: string;
}
