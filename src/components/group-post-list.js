import React from 'react'
import { connect } from 'react-redux'
import { Grid, Placeholder, Segment, Icon, Card } from 'semantic-ui-react'

import GroupPostCard from './group-post-card'
import GroupAddPost from './group-add-post'

import '../css/group.css'

class GroupPostList extends React.Component {
  render () {
    const { activeGroupPost, activeGroup } = this.props
    const { isLoaded, post } = activeGroupPost
    const { results, next } = post
    return (
      <Grid.Column width={11}>
        {activeGroup.hasEditRights && <GroupAddPost />}
        {results &&
          results.map(post => {
            return <GroupPostCard key={post.id} post={post} />
          })}
        {!isLoaded &&
          [...Array(5)].map((item, index) => {
            return (
              <Card fluid key={index}>
                <Card.Content>
                  <Placeholder>
                    <Placeholder.Line length='full' />
                  </Placeholder>
                </Card.Content>
                <Card.Content fluid>
                  <Placeholder style={{ minWidth: '100%' }}>
                    <Placeholder.Paragraph>
                      <Placeholder.Line length='full' />
                      <Placeholder.Line length='full' />
                      <Placeholder.Line length='medium' />
                    </Placeholder.Paragraph>
                    {index % 3 === 2 && <Placeholder.Paragraph />}
                    {index % 3 === 2 && <Placeholder.Image rectangular />}
                  </Placeholder>
                </Card.Content>
              </Card>
            )
          })}
        {isLoaded && !next && (
          <Segment basic textAlign='center'>
            <Icon name='frown outline' />
            No more bits available. You have scrolled enough for today.
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
