// @ts-ignore
import * as compiler from 'vue-template-compiler'
import { transformSync } from '@babel/core'

// types
import type { CompilerOptionsWithSourceRange } from 'vue-template-compiler'

// plugin
import plugin from './plugin'

type CompilerPreproty = 'ssrCompile' | 'parseComponent' | 'generateCodeFrame' | 'compileToFunctions' | 'compile'

const decorateCompiler: Record<string, any> = {}

function decorateCompilerPreproty() {

  for (let key in compiler) {

    decorateCompiler[key] = compiler[key as CompilerPreproty]
  }
}

decorateCompilerPreproty()

// over methods then can write my methods
decorateCompiler.ssrCompile = decorateCompiler.compile = function overCompiler(template: string, options: CompilerOptionsWithSourceRange) {
  const { ast, render, staticRenderFns, tips, errors } = compiler.compile(template, options)

  console.log(babelAst(render))

  return { ast, render: babelAst(render), staticRenderFns, tips, errors }
}


function babelAst(render: string) {
  const code = transformSync(toFunction(render), {
    filename: 'compiledTemplate',
    sourceType: 'unambiguous',
    plugins: [plugin]
  })
  return code?.code?.replace(/.+\{/, '').slice(0, -1)
}

function toFunction(code: string) {
  return `function m () {${code}} `
}

// @ts-ignore
export default module.exports = decorateCompiler
