import React from 'react'
import { connect } from 'react-redux'
import { Route } from 'react-router-dom'
import { isMobile, isBrowser } from 'react-device-detect'
import { Scrollbars } from 'react-custom-scrollbars'

import Sidebar from 'core/common/src/components/primary-sidebar'
import { AppHeader, AppFooter, AppMain } from 'formula_one'
import GroupList from './group-list'
import GroupDetail from './group-detail'
import GroupTeam from './group-team'
import { setGroupList, getMorePost, getMoreTeam } from '../actions'

import main from 'formula_one/src/css/app.css'

class App extends React.PureComponent {
  handleScroll = values => {
    let part = window.location.href.split('/')
    const lastSegment = part.pop() || part.pop()
    const { activeGroupPost, activeGroup, groupTeam } = this.props
    if (`\\${lastSegment}\\` !== this.props.match.path) {
      if (lastSegment === 'team') {
        if (groupTeam.isLoaded && activeGroup.isLoaded) {
          if (
            (1 - values.top) * values.scrollHeight <= 800 &&
            groupTeam.team.next
          ) {
            this.props.GetMoreTeam(groupTeam.team.next)
          }
        }
      } else {
        if (activeGroupPost.isLoaded && activeGroup.isLoaded) {
          if (
            (1 - values.top) * values.scrollHeight <= 800 &&
            activeGroupPost.post.next
          ) {
            this.props.GetMorePost(
              activeGroup.data.slug,
              activeGroupPost.post.next
            )
          }
        }
      }
    }
  }
  render () {
    const { match } = this.props
    const creators = [
      {
        name: 'Dhruv Bhanushali',
        role: 'Backend Developer',
        link: 'https://dhruvkb.github.io/'
      },
      {
        name: 'Praduman Goyal',
        role: 'Frontend Developer',
        link: 'https://pradumangoyal.github.io'
      }
    ]
    return (
      <React.Fragment>
        <div styleName='app'>
          <AppHeader mode='site' appName='groups' userDropdown />
          {isMobile && <Sidebar />}
          <AppMain>
            <div styleName='main.app-main'>
              {isBrowser && <Sidebar />}
              <Scrollbars autoHide onScrollFrame={this.handleScroll}>
                <Route exact path={`${match.path}`} component={GroupList} />
                <Route
                  exact
                  path={`${match.path}:slug`}
                  component={GroupDetail}
                />
                <Route
                  exact
                  path={`${match.path}:slug/team`}
                  component={GroupTeam}
                />
              </Scrollbars>
            </div>
          </AppMain>
          <AppFooter creators={creators} />
        </div>
      </React.Fragment>
    )
  }
}

function mapStateToProps (state) {
  return {
    activeGroupPost: state.activeGroupPost,
    activeGroup: state.activeGroup,
    groupTeam: state.groupTeam
  }
}
const mapDispatchToProps = dispatch => {
  return {
    SetGroupList: () => {
      dispatch(setGroupList())
    },
    GetMorePost: (slug, page) => {
      dispatch(getMorePost(slug, page))
    },
    GetMoreTeam: page => {
      dispatch(getMoreTeam(page))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
