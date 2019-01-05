import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Card, Icon, Grid } from 'semantic-ui-react'

import PurposeCard from './purpose-card'
import LocationCard from './location-card'
import GroupPostList from './group-post-list'
import AddMember from './add-member'
import { getTheme, getThemeObject } from 'formula_one'
import '../css/group.css'

class GroupAbout extends React.Component {
  render () {
    const { activeGroup } = this.props
    return (
      <Grid styleName='group-post-container' stackable>
        <Grid.Column width={5}>
          <PurposeCard heading='About' field='about' />
          <PurposeCard heading='Mission' field='mission' />
          <LocationCard heading='Location' field='locationInformation' />
          <Card color={getTheme()} fluid>
            <Card.Content
              styleName='info-card-description-container'
              as={Link}
              to='./team'
            >
              <Icon name='user outline' color={getTheme()} />
              <span style={{ color: getThemeObject().hexCode }}>
                View members
              </span>
            </Card.Content>
          </Card>
          {activeGroup.hasAdminRights && <AddMember />}
        </Grid.Column>
        <GroupPostList />
      </Grid>
    )
  }
}

function mapStateToProps (state) {
  return {
    activeGroup: state.activeGroup
  }
}
const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupAbout)
