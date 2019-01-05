import { combineReducers } from 'redux'
import GroupList from './groupList'
import CountryList from './countryList'
import SocialList from './socialList'
import ActiveGroup from './activeGroup'
import ActiveGroupPost from './activeGroupPost'
import GroupTeam from './groupTeam'

const rootReducers = combineReducers({
  groupList: GroupList,
  activeGroup: ActiveGroup,
  countryList: CountryList,
  socialList: SocialList,
  activeGroupPost: ActiveGroupPost,
  groupTeam: GroupTeam
})

export default rootReducers
