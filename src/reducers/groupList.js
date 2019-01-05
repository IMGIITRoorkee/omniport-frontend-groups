const initialState = {
  isLoaded: false
}
const groupList = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_GROUPLIST':
      return action.payload
    default:
      return state
  }
}

export default groupList
