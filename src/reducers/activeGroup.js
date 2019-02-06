const initialState = {
  isLoaded: false,
  inEditMode: '',
  hasEditRights: false,
  hasAdminRights: false
}
const activeGroup = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_ACTIVE_GROUP':
      return action.payload
    case 'SET_ACTIVE_GROUP_CHANGED':
      return {
        ...action.payload,
        inEditMode: '',
        hasAdminRights: state.hasAdminRights,
        hasEditRights: state.hasEditRights
      }
    case 'SET_ACTIVE_GROUP_CHANGED_LOCATION':
      return {
        data: { ...state.data, locationInformation: [{ ...action.payload }] },
        inEditMode: '',
        isLoaded: true,
        hasAdminRights: state.hasAdminRights,
        hasEditRights: state.hasEditRights
      }
    case 'SET_ACTIVE_GROUP_CHANGED_CONTACT':
      return {
        data: { ...state.data, contactInformation: [{ ...action.payload }] },
        inEditMode: '',
        isLoaded: true,
        hasAdminRights: state.hasAdminRights,
        hasEditRights: state.hasEditRights
      }
    case 'SET_ACTIVE_GROUP_ADD_SOCIAL':
      if (!state.data.socialInformation[0]) {
        return {
          data: {
            ...state.data,
            socialInformation: [
              {
                links: [action.payload]
              }
            ]
          },
          inEditMode: '',
          isLoaded: true,
          hasAdminRights: state.hasAdminRights,
          hasEditRights: state.hasEditRights
        }
      }
      return {
        data: {
          ...state.data,
          socialInformation: [
            {
              links: [...state.data.socialInformation[0].links, action.payload]
            }
          ]
        },
        inEditMode: '',
        isLoaded: true,
        hasAdminRights: state.hasAdminRights,
        hasEditRights: state.hasEditRights
      }
    case 'SET_ACTIVE_GROUP_CHANGED_SOCIAL':
      return {
        data: {
          ...state.data,
          socialInformation: [
            {
              ...state.data.socialInformation[0],
              links: state.data.socialInformation[0].links.map(x => {
                return x.id === action.payload.id ? action.payload : x
              })
            }
          ]
        },
        inEditMode: '',
        isLoaded: true,
        hasAdminRights: state.hasAdminRights,
        hasEditRights: state.hasEditRights
      }
    case 'SET_ACTIVE_GROUP_DELETE_SOCIAL':
      return {
        data: {
          ...state.data,
          socialInformation: [
            {
              ...state.data.socialInformation[0],
              links: state.data.socialInformation[0].links.filter(x => {
                return x.id !== action.payload
              })
            }
          ]
        },
        inEditMode: '',
        isLoaded: true,
        hasAdminRights: state.hasAdminRights,
        hasEditRights: state.hasEditRights
      }
    case 'SET_CHANGING':
      return {
        ...action.payload,
        data: state.data,
        hasAdminRights: state.hasAdminRights,
        hasEditRights: state.hasEditRights
      }
    default:
      return state
  }
}

export default activeGroup
