

//  state 0 replace key, state 1 replace key and value, state 2 replace part, state 3 add some code
export const treeProprety = {
  data: {
    state: 3,
    // 
    data: `
    function (data, vm, attrs){
      let v = typeof attrs.props === 'string' ? vm[attrs.props] : attrs.props
      if(!v || v.label !== 'label'){
        v = {
          children: 'children',
          label: 'title'
        }
      }
      const val = JSON.parse(JSON.stringify(data))
  
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

  load: {
    state: 0,
    loadData: null
  },
  renderContent: {
    state: 0,
    render: null
  },
}

