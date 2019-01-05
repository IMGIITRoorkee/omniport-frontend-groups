const initialState = {
  isLoaded: false,
  team: {},
  changing: false,
  deleting: ''
}
const groupTeam = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_TEAM':
      return { ...action.payload, changing: false, deleting: '' }
    case 'SET_TEAM_LOADED':
      return { ...state, isLoaded: action.payload }
    case 'REMOVE_MEMBER_FROM_TEAM':
      return {
        ...state,
        deleting: '',
        team: {
          ...state.team,
          results: state.team.results.filter(x => {
            return x.id != action.payload
          }),
          count: state.team.count - 1
        }
      }
    case 'SET_TEAM_NEXT_PAGE':
      return {
        ...action.payload,
        team: {
          ...action.payload.team,
          results: [...state.team.results, ...action.payload.team.results]
        },
        changing: false,
        deleting: ''
      }
    case 'CHANGE_TEAM':
      return {
        ...state,
        changing: false,
        team: {
          ...state.team,
          results: state.team.results.map(member => {
            if (member.id !== action.payload.id) {
              return member
            } else {
              return action.payload
            }
          })
        }
      }
    case 'SET_MEMBER_CHANGING':
      return { ...state, changing: action.payload }
    case 'SET_MEMBER_DELETING':
      return { ...state, deleting: action.payload }
    default:
      return state
  }
}

export default groupTeam
