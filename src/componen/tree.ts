

//  state 0 replace key, state 1 replace key and value, state 2 replace part, state 3 add some code
export const treeProprety = {
  data: {
    state: 3,
    // 
    data: `
    function (data, vm, attrs){
      const val = JSON.parse(JSON.stringify(data))
      const v = {
        children: 'children',
        label: 'title'
      }
      function replaceKeyAndValue(array, props) {
        return array.map(item => {
          item[props.label] = item.label
          delete item.label
          if (item.children) {
            item[props.children] = replaceKeyAndValue(item.children, props)
          }
          return item
        })
      }
     return replaceKeyAndValue(val, v)
    }`
  },
  props: {
    state: 3,
    props:`
      function (data, vm, attrs) {
        const prop = attrs.props
        if (prop.label === 'label') {
          prop.title = prop.label
          delete prop.label
        }
      }
      `
  }
}

