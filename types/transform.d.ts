import type { ObjectProperty } from '@babel/types';
import type { Attrs } from './type';
export declare function transformProperty(attrs: Array<Attrs>, targetAttr: Record<string, any>): Record<string, any>[];
export declare function createPropreties(object: Record<string, any>, attrs: any): ObjectProperty[];
