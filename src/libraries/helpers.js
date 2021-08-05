export const pipe = (actions,firstValue) => actions.reduce((result, action) => {
  return action(result)
}, firstValue)