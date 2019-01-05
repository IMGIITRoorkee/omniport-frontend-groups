import React from 'react'
import { connect } from 'react-redux'
import { Grid, Loader, Segment, Icon } from 'semantic-ui-react'

import { getTheme, getThemeObject } from 'formula_one'
import GroupPostCard from './group-post-card'
import GroupAddPost from './group-add-post'

import '../css/group.css'

class GroupPostList extends React.Component {
  render () {
    const { activeGroupPost, activeGroup } = this.props
    const { isLoaded, post } = activeGroupPost
    const { results, count, previous, next } = post
    return (
      <Grid.Column width={11}>
        {activeGroup.hasEditRights && <GroupAddPost />}
        {results &&
          results.map(post => {
            return <GroupPostCard key={post.id} post={post} />
          })}
        {!isLoaded && (
          <Segment basic>
            <Loader active />
          </Segment>
        )}
        {isLoaded && !next && (
          <Segment basic textAlign='center'>
            <Icon name='frown outline' />
            No more bits availaible. You have scrolled enough for today.
          </Segment>
        )}
      </Grid.Column>
    )
  }
}

function mapStateToProps (state) {
  return {
    activeGroup: state.activeGroup,
    activeGroupPost: state.activeGroupPost
  }
}
const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupPostList)
