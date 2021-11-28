// types
import type { NodePath } from '@babel/traverse'
import type { CallExpression, StringLiteral, ObjectExpression, ObjectProperty } from '@babel/types'

// @ts-ignore
import * as t from '@babel/types'
import { getIdentifier, createObjectProprety } from './utils'
import { transformProperty, createPropreties } from './transform'
// component attribute
import { buttonProprety } from './componen/button'
import { treeProprety } from './componen/tree'

export const COMPONENTMAP = {
  'el-button'(path: NodePath<CallExpression>) {

    const arg = path.get('arguments.0') as NodePath<StringLiteral>

    arg.replaceWith(t.stringLiteral('Button'))

    path.traverse({
      ObjectProperty(cpath) {

        const preprotyName = cpath.get('key').toString()

        if (preprotyName === 'attrs') {
          const attrs: Record<string, any> = {}
          const ObjectExpression = cpath.get('value') as NodePath<ObjectExpression>
          const properties = ObjectExpression.node.properties as Array<ObjectProperty>

          properties.forEach((item) => {
            attrs[(item.key as StringLiteral).value] = getIdentifier(item.value as any)
          })

          /**
           * {
           *  size: 'mini'
           * }
           */
          if (!attrs.size) attrs.size = 'default'

          const propreies = createPropreties(transformProperty(attrs, buttonProprety))
          cpath.replaceWith(createObjectProprety(preprotyName, t.objectExpression(propreies)))

        }

        cpath.skip()
      }
    })
  },
  'el-tree'(path: NodePath<CallExpression>) {
    const arg = path.get('arguments.0') as NodePath<StringLiteral>
    arg.replaceWith(t.stringLiteral('Tree'))

    path.traverse({
      ObjectProperty(cpath) {
        const preprotyName = cpath.get('key').toString()

        if (preprotyName === 'attrs') {

          const attrs: Record<string, any> = {}
          const ObjectExpression = cpath.get('value') as NodePath<ObjectExpression>
          const properties = ObjectExpression.node.properties as Array<ObjectProperty>

          properties.forEach((item) => {
            attrs[(item.key as StringLiteral).value] = getIdentifier(item.value as any)
          })

          const propreies = createPropreties(transformProperty(attrs, treeProprety))
          cpath.replaceWith(createObjectProprety(preprotyName, t.objectExpression(propreies)))

        }
        cpath.skip()
      }
    })
  }
}
