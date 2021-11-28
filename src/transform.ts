import type { ObjectProperty } from '@babel/types'
// @ts-ignore
import * as t from '@babel/types'
import template from '@babel/template'

import { objectTransformArray } from './utils'
// iview proprety transform to element property
// targetAttr is file in component
export function transformProperty(sourceAttr: Record<string, any>, targetAttr: Record<string, any>) {
  const detailPropreties: Array<Record<string, any>> = []

  for (let key of Object.keys(sourceAttr)) {
    const val = targetAttr[key]

    if (!val) break

    if (val.state === 0) detailPropreties.push(replaceKey(sourceAttr, val, key))

    if (val.state === 1) detailPropreties.push(replaceObject(val))

    if (val.state === 2 || val.state === 3) detailPropreties.push(replaceValue(sourceAttr, val))

  }

  function replaceValue(sourceAttr: Record<string, any>, val: Record<string, any>) {
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

      const kind = sourceAttr[k].split(':')
      if (kind.length > 1) {
        newObj.kind = kind[0]
        sourceAttr[k] = kind[1]
      }
      // set default value when can't find map
      // example: { size: small }
      newObj.value = !val[k][sourceAttr[k]] ? sourceAttr[k] : val[k][sourceAttr[k]]
      newObj.key = k
      newObj.map = val[k]
    }

    return newObj
  }

  function replaceKey(sourceAttr: Record<string, any>, val: Record<string, any>, key: string) {
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

      const kind = sourceAttr[k].split(':')
      if (kind.length > 1) {
        newObj.kind = kind[0]
        sourceAttr[k] = kind[1]
      }

      newObj.key = k
      newObj.value = sourceAttr[key]

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

export function createPropreties(object: Record<string, any>) {
  const propreties: Array<ObjectProperty> = [];


  for (let item of Object.assign(object)) {
    let create;

    if (item.kind === 'stringLiteral' || !item.kind) {

      create = t[item.kind as 'stringLiteral'](item.value)
    } else {
      create = createObjctpropretyValue(item)

    }

    // @ts-ignore
    const objectproprety = t.objectProperty(t.stringLiteral(item.key), create)

    propreties.push(objectproprety)
  }

  return propreties
}


function createObjctpropretyValue(object: Record<string, any>) {
  if (object.state === 2) {
    const data: Array<any> = objectTransformArray(object.map).map((v: any) => t.objectProperty(t.stringLiteral(v.key), t.stringLiteral(v.value)))
    return t.memberExpression(t.objectExpression(data), t[object.kind as 'identifier'](object.value), true)
  } else if (object.state === 3) {
    return template.expression(`${object.map(object.value)}`)()
  }
}
