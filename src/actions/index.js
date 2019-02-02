import axios from 'axios'

import { getCookie } from 'formula_one'
import {
  urlGroupList,
  urlGroupDescription,
  urlHasRights,
  urlActiveGroupPost,
  urlActiveGroupPostSpecific,
  urlGroupMembership,
  urlGroupMembershipSpecific,
  urlActiveGroupContactInfo,
  urlActiveGroupSocialInfo,
  urlActiveGroupSocialInfoSpecific,
  urlActiveGroupLocationtInfo,
  urlActiveGroupLocationtInfoEdit,
  urlActiveGroupContactInfoSpecific
} from '../urls'

const getActiveGroup = slug => {
  return axios.get(urlGroupDescription(slug))
}

const setRights = (slug, which) => {
  return axios.get(urlHasRights(), { params: { which: which, group: slug } })
}

const setPost = slug => {
  return axios.get(urlActiveGroupPost(), { params: { group__slug: slug } })
}

const setTeam = (slug, active) => {
  return axios.get(urlGroupMembership(), {
    params: { group__slug: slug, is_active: active }
  })
}

export const setGroupList = () => {
  return dispatch => {
    axios
      .get(urlGroupList())
      .then(res => {
        dispatch({
          type: 'SET_GROUPLIST',
          payload: {
            isLoaded: true,
            data: res.data
          }
        })
      })
      .catch(err => {})
  }
}

export const setCountryList = () => {
  return dispatch => {
    axios
      .options(urlGroupList())
      .then(res => {
        dispatch({
          type: 'SET_COUNTRYLIST',
          payload: {
            isLoaded: true,
            data: res.data
          }
        })
      })
      .catch(err => {})
  }
}

export const setActiveGroup = (slug, errCallback) => {
  return dispatch => {
    dispatch({
      type: 'SET_POST_LOADED',
      payload: false
    })
    axios
      .all([
        getActiveGroup(slug),
        setRights(slug, 'edit'),
        setRights(slug, 'admin'),
        setPost(slug)
      ])
      .then(
        axios.spread((data, edit, admin, post) => {
          dispatch({
            type: 'SET_ACTIVE_GROUP',
            payload: {
              isLoaded: true,
              data: data.data,
              inEditMode: '',
              hasEditRights: edit.data.hasRights,
              hasAdminRights: admin.data.hasRights
            }
          })
          dispatch({
            type: 'SET_ACTIVEGROUP_POST',
            payload: {
              isLoaded: true,
              post: post.data
            }
          })
        })
      )
      .catch(err => {
        errCallback(err)
      })
  }
}

export const changeActiveGroup = (
  slug,
  field,
  data,
  successCallback,
  errCallback
) => {
  let headers = {
    'X-CSRFToken': getCookie('csrftoken')
  }
  return dispatch => {
    dispatch({
      type: 'SET_CHANGING',
      payload: { isLoaded: true, inEditMode: field }
    })
    axios
      .patch(urlGroupDescription(slug), data, { headers: headers })
      .then(res => {
        dispatch({
          type: 'SET_ACTIVE_GROUP_CHANGED',
          payload: {
            isLoaded: true,
            inEditMode: '',
            data: res.data
          }
        })
        successCallback(res)
      })
      .catch(err => {
        dispatch({
          type: 'SET_CHANGING',
          payload: { isLoaded: true, inEditMode: field }
        })
        errCallback(err)
      })
  }
}

export const changeActiveGroupWithFile = (slug, field, data) => {
  let headers = {
    'Content-Type': 'multipart/form-data',
    'X-CSRFToken': getCookie('csrftoken')
  }
  return dispatch => {
    dispatch({
      type: 'SET_CHANGING',
      payload: { isLoaded: true, inEditMode: field }
    })
    axios
      .patch(urlGroupDescription(slug), data, { headers: headers })
      .then(res => {
        dispatch({
          type: 'SET_ACTIVE_GROUP_CHANGED',
          payload: {
            isLoaded: true,
            inEditMode: '',
            data: res.data
          }
        })
      })
      .catch(err => {})
  }
}

export const changeActiveGroupLocation = (
  id,
  field,
  data,
  successCallback,
  errCallback
) => {
  let headers = {
    'X-CSRFToken': getCookie('csrftoken')
  }
  return dispatch => {
    dispatch({
      type: 'SET_CHANGING',
      payload: { isLoaded: true, inEditMode: field }
    })
    if (id) {
      axios
        .patch(urlActiveGroupLocationtInfoEdit(id), data, { headers: headers })
        .then(res => {
          dispatch({
            type: 'SET_ACTIVE_GROUP_CHANGED_LOCATION',
            payload: res.data
          })
          successCallback(res)
        })
        .catch(err => {
          dispatch({
            type: 'SET_CHANGING',
            payload: { isLoaded: true, inEditMode: field }
          })
          errCallback(err)
        })
    } else {
      axios
        .post(urlActiveGroupLocationtInfo(), data, { headers: headers })
        .then(res => {
          dispatch({
            type: 'SET_ACTIVE_GROUP_CHANGED_LOCATION',
            payload: res.data
          })
          successCallback(res)
        })
        .catch(err => {
          dispatch({
            type: 'SET_CHANGING',
            payload: { isLoaded: true, inEditMode: field }
          })
          errCallback(err)
        })
    }
  }
}

export const changeActiveGroupContact = (
  id,
  field,
  data,
  successCallback,
  errCallback
) => {
  let headers = {
    'X-CSRFToken': getCookie('csrftoken')
  }
  return dispatch => {
    dispatch({
      type: 'SET_CHANGING',
      payload: { isLoaded: true, inEditMode: field }
    })
    if (id) {
      axios
        .patch(urlActiveGroupContactInfoSpecific(id), data, {
          headers: headers
        })
        .then(res => {
          dispatch({
            type: 'SET_ACTIVE_GROUP_CHANGED_CONTACT',
            payload: res.data
          })
          successCallback(res)
        })
        .catch(err => {
          dispatch({
            type: 'SET_CHANGING',
            payload: { isLoaded: true, inEditMode: '' }
          })
          errCallback(err)
        })
    } else {
      axios
        .post(urlActiveGroupContactInfo(), data, { headers: headers })
        .then(res => {
          dispatch({
            type: 'SET_ACTIVE_GROUP_CHANGED_CONTACT',
            payload: res.data
          })
          successCallback(res)
        })
        .catch(err => {
          dispatch({
            type: 'SET_CHANGING',
            payload: { isLoaded: true, inEditMode: '' }
          })
          errCallback(err)
        })
    }
  }
}

export const addActiveGroupSocial = (
  field,
  data,
  successCallback,
  errCallback
) => {
  let headers = {
    'X-CSRFToken': getCookie('csrftoken')
  }
  return dispatch => {
    dispatch({
      type: 'SET_CHANGING',
      payload: { isLoaded: true, inEditMode: field }
    })
    axios
      .post(urlActiveGroupSocialInfo(), data, { headers: headers })
      .then(res => {
        dispatch({
          type: 'SET_ACTIVE_GROUP_ADD_SOCIAL',
          payload: res.data
        })
        successCallback(res)
      })
      .catch(err => {
        errCallback(err)
      })
  }
}

export const changeActiveGroupSocial = (
  id,
  field,
  data,
  successCallback,
  errCallback
) => {
  let headers = {
    'X-CSRFToken': getCookie('csrftoken')
  }
  return dispatch => {
    dispatch({
      type: 'SET_CHANGING',
      payload: { isLoaded: true, inEditMode: field }
    })
    axios
      .patch(urlActiveGroupSocialInfoSpecific(id), data, { headers: headers })
      .then(res => {
        dispatch({
          type: 'SET_ACTIVE_GROUP_CHANGED_SOCIAL',
          payload: res.data
        })
        successCallback(res)
      })
      .catch(err => {
        errCallback(err)
      })
  }
}

export const deleteActiveGroupSocial = (
  id,
  field,
  successCallback,
  errCallback
) => {
  let headers = {
    'X-CSRFToken': getCookie('csrftoken')
  }
  return dispatch => {
    dispatch({
      type: 'SET_CHANGING',
      payload: { isLoaded: true, inEditMode: field }
    })
    axios
      .delete(urlActiveGroupSocialInfoSpecific(id), { headers: headers })
      .then(res => {
        dispatch({
          type: 'SET_ACTIVE_GROUP_DELETE_SOCIAL',
          payload: id
        })
        successCallback(id)
      })
      .catch(err => {
        errCallback(err)
      })
  }
}

export const getMorePost = (slug, page) => {
  return dispatch => {
    dispatch({
      type: 'SET_POST_LOADED',
      payload: false
    })
    axios
      .get(page)
      .then(res => {
        dispatch({
          type: 'SET_ACTIVEGROUP_POST_NEXT_PAGE',
          payload: {
            isLoaded: true,
            post: res.data
          }
        })
      })
      .catch(err => {
        dispatch({
          type: 'SET_POST_LOADED',
          payload: true
        })
      })
  }
}

export const addPost = (data, successCallback, errCallback) => {
  let headers = {
    'Content-Type': 'multipart/form-data',
    'X-CSRFToken': getCookie('csrftoken')
  }
  return dispatch => {
    dispatch({
      type: 'SET_POST_ADDING',
      payload: true
    })
    axios
      .post(urlActiveGroupPost(), data, { headers: headers })
      .then(res => {
        dispatch({
          type: 'ADD_POST_TO_ACTIVEGROUP',
          payload: res.data
        })
        successCallback(res)
      })
      .catch(err => {
        dispatch({
          type: 'SET_POST_ADDING',
          payload: false
        })
        errCallback(err)
      })
  }
}

export const removePost = id => {
  let headers = {
    'X-CSRFToken': getCookie('csrftoken')
  }
  return dispatch => {
    dispatch({
      type: 'SET_POST_DELETING',
      payload: id
    })
    axios
      .delete(urlActiveGroupPostSpecific(id), { headers: headers })
      .then(res => {
        dispatch({
          type: 'REMOVE_POST_FROM_ACTIVEGROUP',
          payload: id
        })
      })
      .catch(err => {
        dispatch({
          type: 'SET_POST_DELETING',
          payload: ''
        })
      })
  }
}

export const setActiveGroupWithTeam = (slug, active, errCallback) => {
  return dispatch => {
    dispatch({
      type: 'SET_TEAM_LOADED',
      payload: false
    })
    axios
      .all([
        getActiveGroup(slug),
        setRights(slug, 'edit'),
        setRights(slug, 'admin'),
        setTeam(slug, active)
      ])
      .then(
        axios.spread((data, edit, admin, team) => {
          dispatch({
            type: 'SET_ACTIVE_GROUP',
            payload: {
              isLoaded: true,
              data: data.data,
              inEditMode: '',
              hasEditRights: edit.data.hasRights,
              hasAdminRights: admin.data.hasRights
            }
          })
          dispatch({
            type: 'SET_TEAM',
            payload: {
              isLoaded: true,
              team: team.data
            }
          })
        })
      )
      .catch(err => {
        errCallback(err)
      })
  }
}

export const getMoreTeam = page => {
  return dispatch => {
    dispatch({
      type: 'SET_TEAM_LOADED',
      payload: false
    })
    axios
      .get(page)
      .then(res => {
        dispatch({
          type: 'SET_TEAM_NEXT_PAGE',
          payload: {
            isLoaded: true,
            team: res.data
          }
        })
      })
      .catch(err => {
        dispatch({
          type: 'SET_TEAM_LOADED',
          payload: true
        })
      })
  }
}

export const changeTeamMember = (id, data, successCallback, errCallback) => {
  let headers = {
    'X-CSRFToken': getCookie('csrftoken')
  }
  return dispatch => {
    dispatch({
      type: 'SET_MEMBER_CHANGING',
      payload: true
    })
    axios
      .patch(urlGroupMembershipSpecific(id), data, { headers: headers })
      .then(res => {
        dispatch({
          type: 'CHANGE_TEAM',
          payload: res.data
        })
        successCallback(res)
      })
      .catch(err => {
        dispatch({
          type: 'SET_MEMBER_CHANGING',
          payload: false
        })
        errCallback(err)
      })
  }
}

export const removeMember = id => {
  let headers = {
    'X-CSRFToken': getCookie('csrftoken')
  }
  return dispatch => {
    dispatch({
      type: 'SET_MEMBER_DELETING',
      payload: id
    })
    axios
      .delete(urlGroupMembershipSpecific(id), { headers: headers })
      .then(res => {
        dispatch({
          type: 'REMOVE_MEMBER_FROM_TEAM',
          payload: id
        })
      })
      .catch(err => {
        dispatch({
          type: 'SET_MEMBER_DELETING',
          payload: ''
        })
      })
  }
}

export const addTeam = (data, successCallback, errCallback) => {
  let headers = {
    'X-CSRFToken': getCookie('csrftoken')
  }
  return dispatch => {
    dispatch({
      type: 'SET_MEMBER_CHANGING',
      payload: true
    })
    axios
      .post(urlGroupMembership(), data, { headers: headers })
      .then(res => {
        dispatch({
          type: 'SET_MEMBER_CHANGING',
          payload: false
        })
        successCallback(res)
      })
      .catch(err => {
        dispatch({
          type: 'SET_MEMBER_CHANGING',
          payload: false
        })
        errCallback(err)
      })
  }
}
