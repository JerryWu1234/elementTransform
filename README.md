<h1>element UI 和 ivivew UI 合并方案 (vue2.0)</h1> 


**故事背景:** 公司想搭建物料库、组件库、低代码平台等相关的基础工具，但是公司内有两套 UI 框架分别是 elementUI 和 iviewUI , 导致开发前端基础设施就非常困难。所以我们想将 elementUI 合并到 iviewUI 上.

</br>

<h2>vue前端编译工具</h2>
</br>
在vue代码里其实是分为两种类型

</br>

- 第一种.vue 文件类型

```vue
<template>
  <div id="app">
    <el-button round>2323</el-button>
  </div>
</template>
<script>
export default {
  data(){
    return {
      data: [{
        label: '一级 1'
      }]
    }
  }
}
</script>>
```
- 第二种.js类型

```js

export default {
  data(){
    return {
      data: [{
        label: '一级 1'
      }]
    }
  },
  render(h) {
    return <div id="app">
    <el-button round>2323</el-button>
  </div>
  },
}

```
不管哪种类型，我希望同一套转换代码能兼容两种 vue 的语法糖，经过调研不管是jsx类型还是 .vue 文件类型。其实最后都是 render 函数渲染

- 第一种.vue 转化render函数

```vue
<template>
  _c('div', [
    _c('el-button',{
        attrs: {
          round: ''
        }
      }, 
    '2323')
  ])
</template>
<script>
export default {
  data(){
    return {
      data: [{
        label: '一级 1'
      }]
    }
  }
}
</script>>
```

- 第二种.js类型的 render 函数
  
```js

export default {
  data(){
    return {
      data: [{
        label: '一级 1'
      }]
    }
  },
  render(h) {
    return h('div',[
      h('el-button', {
        attrs: {
          round: ''
        }
      }, '2323')
    ])
  },
}

```

**<h3>其实第一种类型中的 _c 其实就是第二种里面的 h 函数</h3>**

其实拿到这个 render 其实就成功了一半，我们只需要把这个render 交给babel，拦截 render 函数，然后将组件的 tag 或者 attrs 替换成 iviewUi 组件即可

</br>

比如：`h('el-button'})`  =>  `h('Button'})`

</br>
<h2>拦截 vue 的 render 函数</h2>
</br>

[vue-loader 原理可以看这里](https://juejin.cn/post/6994468137584295973)

ps: [本来想通过 webpack 钩子获取拦截 render 函数，但是不可以甚至问了下webpack的作者, 可以直接连接跳转过去看下](https://github.com/didi/epage/issues/12)

通过 vue-loader 我们可以拦截 template 生产的render函数

拦截方式
```js
const customer = require('your vue-template-compiler')

chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        options.compiler = v
        return options
      })
  }

// ========= your vue-template-compiler

import * as compiler from 'vue-template-compiler'

const decorateCompiler: Record<string, any> = {}

function decorateCompilerPreproty() {

  for (let key in compiler) {

    decorateCompiler[key] = compiler[key as CompilerPreproty]
  }
}

decorateCompilerPreproty()

// main methods 
decorateCompiler.ssrCompile = decorateCompiler.compile = function overCompiler(template: string, options: CompilerOptionsWithSourceRange) {
  const { ast, render, staticRenderFns, tips, errors } = compiler.compile(template, options)
  // ... add your code like "() => render"
  return { ast, render, staticRenderFns, tips, errors }
}
```
如上代码所示，我们可以通过替换 vue-loader 中用到的 vue-template-compiler。vue-template-compiler 我们主要重写下 `compiler.compile` 和 `decorateCompiler.ssrCompile`

