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

- 第一种 .vue 方式类型

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
如上代码所示，我们可以通过替换 vue-loader 中用到的 vue-template-compiler。vue-template-compiler 中我们主要重写下 `compiler.compile` 和 `decorateCompiler.ssrCompile`

- 第二种 render 函数类型

第二种其实是js文件，vue2.0 其实基于webpack封装的脚手架工具，这里我们要了解下 webpack 的 loader 执行顺序

其实：loader 从右到左（或从下到上）地取值(evaluate)/执行(execute)。在下面的示例中，从 sass-loader 开始执行，然后继续执行 css-loader，最后以 style-loader 为结束。查看 [loader 功能](https://webpack.docschina.org/concepts/loaders/#loader-features) 章节，了解有关 loader 顺序的更多信息。

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // 3
          { loader: 'style-loader' },
          // 2
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          // 1
          { loader: 'sass-loader' }
        ]
      }
    ]
  }
};

```

在 vuecli 中我们通过类似的方式拦截 render 函数

例如：
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          // this your loader
          {loader: 'your loader'},
          // 2
          { loader: 'babel-loader' },
          // 1
        ]
      }
    ]
  }
};
```

loader 其实从下往上执行的，我们可以拦截 babel-loader 编译后的产物

</br>
<h2>babel修改render函数</h2>

我这里采用了配置化的方式将 elementUI 转换为 IviewUI 方式

以 button 按钮为例 
```js


//  state 0 replace key, state 1 replace key and value, state 2 replace part
export const buttonProprety = {
  plain: {
    state: 0,
    ghost: null
  },
  circle: {
    state: 1,
    shape: 'circle'
  },
  round: {
    state: 1,
    shape: 'circle'
  },
  nativeType: {
    state: 0,
    htmlType: null
  },
  type: {
    state: 2,
    type: {
      danger: 'error'
    }
  },
  size: {
    state: 2,
    size: {
      medium: 'default',
      mini: 'small',
      default: 'large'
    }
  }
}

```

如上代码，state 0 代表替换 key, state 1代表替换key 和value， state代表替换部分.

```js 
it('state 为 1的时候', () => {
  `h('el-button', {round: ''}, 23)`.expect(`h('Button', {shape: 'circle'}, 23)`)
})

it('state 为 0的时候', () => {
  `h('el-button', {plain: ''}, 23)`.expect(`h('Button', {ghost: ''}, 23)`)
})

it('state 为 2的时候', () => {
  `h('el-button', {size: 'medium'}, 23)`.expect(`h('Button', {small: 'small'}, 23)`)
})
```


我们罗列所有的 Button 的属性,通过 babel 获取到当前 Callexpssion 中的attrs 属性，如何通过数据转换

[有兴趣的同学可以加入到我们的开发](https://github.com/wulinsheng123/elementTransform)

最后使用方式

```js
const compiler = require('YOUR COMPILER')
module.exports = {
  lintOnSave: false,
  chainWebpack: config => {

    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        options.compiler = compiler
        return options
      })
  }
}
```