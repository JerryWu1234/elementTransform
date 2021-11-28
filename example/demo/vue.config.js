const v = require('../../dist/index')
module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    // config.module
    //   .rule('myrule').resourceQuery(/type=template/).use('myrule').loader(require.resolve(
    //     './webpack/ElementTransformIview/dist/ElementTransformIview'))
    config.module
      .rule('vue')
      .use('vue-loader')
      .tap(options => {
        options.compiler = v
        return options
      })
  }
}
