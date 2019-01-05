import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import { Container, Icon, Menu, Header } from 'semantic-ui-react'

import { getTheme, getThemeObject } from 'formula_one'
import GroupTeamList from './group-team-list'
import { setActiveGroupWithTeam } from '../actions/index'
import '../css/group-team.css'

class GroupTeam extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activeItem: 'current',
      data: { verboseName: 'Current members', activeStatus: true }
    }
  }
  componentDidMount () {
    this.props.SetActiveGroupWithTeam(this.props.match.params.slug, true)
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
    return (
      <div style={{ height: '100%' }}>
        <Container>
          <div styleName='group-team-container'>
            <Link to='../'>
              <Icon name='arrow left' color={getTheme()} />
              <span style={{ color: getThemeObject().hexCode }}>
                Back to group page
              </span>
            </Link>
            <Header as='h3'>Team members</Header>
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
    SetActiveGroupWithTeam: (slug, active) => {
      dispatch(setActiveGroupWithTeam(slug, active))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupTeam)
