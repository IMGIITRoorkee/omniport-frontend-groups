import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Card, Image, Icon, Dropdown } from 'semantic-ui-react'

import { DefaultDP } from 'formula_one'
import { removePost } from '../actions'
import '../css/group-post-card.css'

class GroupPostCard extends React.Component {
  render () {
    const { post, activeGroup, activeGroupPost } = this.props
    return (
      <Card fluid>
        <Card.Content>
          <div styleName='post-header'>
            <div styleName='post-user'>
              <div styleName='post-user-pic'>
                {activeGroup.data.logo ? (
                  <Image src={activeGroup.data.logo} avatar />
                ) : (
                  <DefaultDP name={activeGroup.data.name} />
                )}
              </div>

              <div styleName='post-user-desc'>
                <Card.Header>
                  <span styleName='post-user-name'>
                    {activeGroup.data.name}
                  </span>
                </Card.Header>
                <Card.Meta>
                  <span>{moment(post.datetimeCreated).fromNow()}</span>
                </Card.Meta>
              </div>
              <div>
                {activeGroup.hasEditRights && (
                  <Dropdown icon='ellipsis vertical' pointing='top right'>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => {
                          this.props.RemovePost(post.id)
                        }}
                      >
                        <Icon name='trash alternate outline' />
                        Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>
            </div>
          </div>
        </Card.Content>
        <Card.Content>
          <div styleName='post-card-description'>{post.text}</div>
          {post.image && (
            <div styleName='post-card-image-container'>
              <Image
                src={post.image}
                styleName='post-card-image'
                alt={`post by ${activeGroup.data.name}`}
              />
            </div>
          )}
        </Card.Content>
      </Card>
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
  return {
    RemovePost: id => {
      dispatch(removePost(id))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupPostCard)
