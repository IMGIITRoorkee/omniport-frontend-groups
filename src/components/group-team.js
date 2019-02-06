import React from 'react'
import { connect } from 'react-redux'
import { Container, Menu } from 'semantic-ui-react'

import CustomBreadcrumb from 'core/common/src/components/custom-breadcrumb'
import GroupTeamList from './group-team-list'
import EmptyGroupTeam from './empty-group-team'
import { setActiveGroupWithTeam } from '../actions/index'
import { urlGroupDetailView, urlBaseView } from '../urls'

class GroupTeam extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activeItem: 'current',
      data: { verboseName: 'Current members', activeStatus: true }
    }
  }
  componentDidMount () {
    this.props.SetActiveGroupWithTeam(
      this.props.match.params.slug,
      true,
      err => {
        this.props.history.push('/404')
      }
    )
  }
  handleClick = (e, { name }) => {
    const data = {}
    if (name === 'current') {
      data['verboseName'] = 'Current members'
      data['activeStatus'] = true
      this.props.SetActiveGroupWithTeam(this.props.match.params.slug, true)
    }
    if (name === 'alumni') {
      data['verboseName'] = 'Alumni'
      data['activeStatus'] = false
      this.props.SetActiveGroupWithTeam(this.props.match.params.slug, false)
    }
    this.setState({ activeItem: name, data })
  }

  render () {
    const { activeItem } = this.state
    const { activeGroup } = this.props
    return (
      <div style={{ height: '100%' }}>
        <Container>
          <div>
            {activeGroup.data ? (
              <React.Fragment>
                <CustomBreadcrumb
                  list={[
                    { name: 'Groups', link: urlBaseView() },
                    {
                      name: activeGroup.data.name,
                      link: urlGroupDetailView(
                        activeGroup.data ? activeGroup.data.slug : ''
                      )
                    },
                    {
                      name: 'Team members'
                    }
                  ]}
                />
                <Menu tabular>
                  <Menu.Item
                    name='current'
                    active={activeItem === 'current'}
                    onClick={this.handleClick}
                  />
                  <Menu.Item
                    name='alumni'
                    active={activeItem === 'alumni'}
                    onClick={this.handleClick}
                  />
                </Menu>
                <GroupTeamList />
              </React.Fragment>
            ) : (
              <EmptyGroupTeam />
            )}
          </div>
        </Container>
      </div>
    )
  }
}

function mapStateToProps (state) {
  return {
    activeGroup: state.activeGroup,
    groupTeam: state.groupTeam
  }
}
const mapDispatchToProps = dispatch => {
  return {
    SetActiveGroupWithTeam: (slug, active, errCallback) => {
      dispatch(setActiveGroupWithTeam(slug, active, errCallback))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupTeam)
