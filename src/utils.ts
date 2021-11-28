import type { Identifier, StringLiteral, ObjectExpression } from '@babel/types'

// @ts-ignore
import * as t from '@babel/types'

export function getTag(name: string) {
  if (name.includes('el')) return `${name.slice(3, 4).toLocaleUpperCase()}${name.slice(4)}`

  return name
}

export function getIdentifier(node: Identifier | StringLiteral) {
  if (node.type === 'StringLiteral') {

    return node.value

  } else {

    return `identifier:${node.name}`
  }
}

export function createObjectProprety(key: string, expression: ObjectExpression) {
  return t.objectProperty(t.stringLiteral(key), expression)
}

export function objectTransformArray(object: Record<string, any>) {
  const array: Array<Record<string, any>> = []

  for (let key of Object.keys(object)) {

    const newObject: Record<string, any> = {
      key: null,
      value: null
    }

    newObject.key = key
    newObject.value = object[key]
    array.push(newObject)
  }
  return array
}
