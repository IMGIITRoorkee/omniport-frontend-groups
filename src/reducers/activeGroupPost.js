const initialState = {
  isLoaded: false,
  post: {},
  adding: false,
  deleting: ''
}
const activeGroupPost = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_POST_TO_ACTIVEGROUP':
      return {
        ...state,
        adding: false,
        post: {
          ...state.post,
          results: [action.payload, ...state.post.results],
          count: state.post.count + 1
        }
      }
    case 'REMOVE_POST_FROM_ACTIVEGROUP':
      return {
        ...state,
        deleting: '',
        post: {
          ...state.post,
          results: state.post.results.filter(x => {
            return x.id != action.payload
          }),
          count: state.post.count - 1
        }
      }
    case 'SET_ACTIVEGROUP_POST':
      return { ...action.payload, adding: false, deleting: '' }
    case 'SET_ACTIVEGROUP_POST_NEXT_PAGE':
      return {
        ...action.payload,
        post: {
          ...action.payload.post,
          results: [...state.post.results, ...action.payload.post.results]
        },
        adding: false,
        deleting: ''
      }
    case 'SET_POST_LOADED':
      return { ...state, isLoaded: action.payload }
    case 'SET_POST_ADDING':
      return { ...state, adding: action.payload }
    case 'SET_POST_DELETING':
      return { ...state, deleting: action.payload }
    default:
      return state
  }
}

export default activeGroupPost
