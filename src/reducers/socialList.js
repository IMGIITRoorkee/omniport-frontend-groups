const initialState = {
  isLoaded: false,
  data: []
}
const socialList = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_SOCIALLIST':
      return action.payload
    default:
      return state
  }
}

export default socialList
