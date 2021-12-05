// types
import type { NodePath } from '@babel/traverse'
import type { CallExpression, StringLiteral, ObjectExpression, ObjectProperty } from '@babel/types'
import type { Attrs } from './type'

// @ts-ignore
import * as t from '@babel/types'
import { astAttrsIntoObject, createObjectProprety } from './utils'
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

        /**
         * attrs: {
         *    a: '2',
         *    b: b,
         *    d: {a: 1},
         *    m: (function(){})()
         * }
         *  attrs may is one of "stringliteral, identifier, callexpression, Objectexpssion"
         * 
         * */
        if (preprotyName === 'attrs') {
          const attrs: Array<Attrs> = [] 
          const ObjectExpression = cpath.get('value') as NodePath<ObjectExpression>
          const properties = ObjectExpression.node.properties as Array<ObjectProperty>

          /**
           * {
           *  size: 'mini'
           * }
           */
          // if (!attrs.size) attrs.size = 'default'
          astAttrsIntoObject(properties, attrs)
          const propreies = createPropreties(transformProperty(attrs, buttonProprety), attrs)
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
          /**
           * 
           * {
              props: 'identifier:defaultProps',
              data: []
            }
           *  
          */
          const attrs: Array<Attrs> = [] 

          const ObjectExpression = cpath.get('value') as NodePath<ObjectExpression>
          const properties = ObjectExpression.node.properties as Array<ObjectProperty>

          astAttrsIntoObject(properties, attrs)
 
          const propreies = createPropreties(transformProperty(attrs, treeProprety), cpath)
          cpath.replaceWith(createObjectProprety(preprotyName, t.objectExpression(propreies)))

        }
      }
    })
  }
}
