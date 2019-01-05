const initialState = {
  isLoaded: false,
  data: []
}
const countryList = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_COUNTRYLIST':
      return action.payload
    default:
      return state
  }
}

export default countryList
