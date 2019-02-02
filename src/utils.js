export function errorExist (errorObject, field) {
  return Boolean(
    Object.keys(errorObject).find(x => {
      return x === field
    })
  )
}
