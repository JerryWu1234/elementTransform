

//  state 0 replace key, state 1 replace key and value, state 2 replace part, state 3 add some code
export const treeProprety = {
  data: {
    state: 3,
    data(data: any) {
      return  `(function(data,a){
        debugger
        return data.map(item => {
          item.title = item.label
          return item
        })
      })(${data},this)`
    }
  }
}
