import type { ObjectProperty } from '@babel/types'
import type { Attrs } from './type'
// @ts-ignore
import * as t from '@babel/types'
import template from '@babel/template'

import { objectTransformArray, getFunctionBody } from './utils'
// iview proprety transform to element property
// targetAttr is file in component
export function transformProperty(attrs: Array<Attrs>, targetAttr: Record<string, any>) {
  const detailPropreties: Array<Record<string, any>> = []

  for (let attr of attrs) {
    const val = targetAttr[attr.key]

    if (!val) continue

    if (val.state === 0) detailPropreties.push(replaceKey(attr, val))

    if (val.state === 1) detailPropreties.push(replaceObject(val))

    if (val.state === 2 || val.state === 3) detailPropreties.push(replaceValue(attr, val))

  }

  function replaceValue(attr: Attrs, val: Record<string, any>) {
    const newObj: Record<string, any> = {
      key: null,
      value: null,
      state: null,
      kind: 'stringLiteral',
      map: null
    }

    for (let k in val) {

      if (k === 'state') {
        newObj.state = val[k]
        continue
      }

      newObj.kind = attr.type
      // set default value when can't find map
      // example: { size: small }
      newObj.value = !val[k][attr.value as any] ? attr.value : val[k][attr.value as any]
      newObj.key = k
      newObj.map = val[k]
    }

    return newObj
  }

  function replaceKey(attr: Attrs, val: Record<string, any>) {
    const newObj: Record<string, any> = {
      key: null,
      value: null,
      state: null,
      kind: 'stringLiteral',
      map: null
    }

    for (let k in val) {

      if (k === 'state') {
        newObj.state = val[k]
        continue
      }

      newObj.kind = attr.type
      newObj.key = k
      newObj.value = attr.value

    }

    return newObj
  }

  function replaceObject(val: Record<string, any>) {
    const newObj: Record<string, any> = {
      key: null,
      value: null,
      state: null,
      kind: 'stringLiteral',
      map: null
    }

    for (let k in val) {

      if (k === 'state') {
        newObj.state = val[k];
        continue;
      }

      newObj.key = k
      newObj.value = val[k]
    }

    return newObj
  }

  return detailPropreties
}

export function createPropreties(object: Record<string, any>, attrs: any) {
  const propreties: Array<ObjectProperty> = [];


  for (let item of Object.assign(object)) {
    let create;

    if ((item.kind === 'stringLiteral') || (!item.map && item.kind === 'Identifier')) {

      create = t[item.kind as 'stringLiteral'](item.value)
    } else {
      create = createObjctpropretyValue(item, attrs)

    }

    // @ts-ignore
    const objectproprety = t.objectProperty(t.stringLiteral(item.key), create)

    propreties.push(objectproprety)
  }

  return propreties
}


function createObjctpropretyValue(object: Record<string, any>, attrs: any) {
  if (object.state === 2) {
    const data: Array<any> = objectTransformArray(object.map).map((v: any) => t.objectProperty(t.stringLiteral(v.key), t.stringLiteral(v.value)))
    return t.memberExpression(t.objectExpression(data), t[object.kind as 'identifier'](object.value), true)
  } else if (object.state === 3) {
    const expssion = template.expression(`(function (data, vm, attrs) {
    })(DATA, this)`)({ DATA: object.value })
    const ast = template.ast`${getFunctionBody(object.map)}`;

    // @ts-ignore
    const body = (expssion as t.CallExpression).callee?.body.body
    // @ts-ignore
    expssion.arguments.push(attrs.get('value').node)
    body.push(ast)

    return expssion
  }
}
