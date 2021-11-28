

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
