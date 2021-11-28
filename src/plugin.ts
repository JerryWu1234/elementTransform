
import { declare } from '@babel/helper-plugin-utils'

// function
import { COMPONENTMAP } from './component'

export default declare(() => {
  return {
    visitor: {
      CallExpression(path) {

        const componenName = path.get('arguments.0').toString()

        if (componenName.indexOf('el-button') > -1) {

          COMPONENTMAP['el-button'](path)
        }

        if (componenName.indexOf('el-tree') > -1) {

          COMPONENTMAP['el-tree'](path)
        }
      }
    }
  }
})
