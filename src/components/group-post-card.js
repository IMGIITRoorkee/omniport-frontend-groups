import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { Card, Image, Icon, Dropdown, Modal, Button } from 'semantic-ui-react'

import { DefaultDP } from 'formula_one'
import { removePost } from '../actions'
import { Rtffield } from '../fields'
import '../css/group-post-card.css'

class GroupPostCard extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      modalOpen: false
    }
  }

  handleClose = () => {
    this.setState({
      modalOpen: false
    })
  }

  handleOpen = () => {
    this.setState({
      modalOpen: true
    })
  }

  render () {
    const { post, activeGroup } = this.props
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
                  <Dropdown
                    icon={{ name: 'ellipsis vertical', color: 'grey' }}
                    pointing='top right'
                  >
                    <Dropdown.Menu>
                      <Modal
                        trigger={
                          <Dropdown.Item onClick={this.handleOpen}>
                            <Icon name='trash alternate outline' />
                            Delete
                          </Dropdown.Item>
                        }
                        open={this.state.modalOpen}
                        onClose={this.handleClose}
                        size='small'
                        dimmer='blurring'
                        closeIcon
                      >
                        <Modal.Header>
                          <Icon name='warning sign' color='red' />
                          Confirm irreversible deletion
                        </Modal.Header>
                        <Modal.Content>
                          Are you sure you want to remove this post?
                        </Modal.Content>
                        <Modal.Actions>
                          <Button
                            positive
                            onClick={this.handleClose}
                            icon='left arrow'
                            content='Keep'
                            basic
                          />
                          <Button
                            icon='close'
                            content="Delete, I'm sure"
                            basic
                            negative
                            onClick={() => {
                              this.props.RemovePost(post.id)
                            }}
                          />
                        </Modal.Actions>
                      </Modal>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </div>
            </div>
          </div>
        </Card.Content>
        <Card.Content>
          <div styleName='post-card-description'>
	    <Rtffield field = {post.text} handleEditorChange={null} disabled={true} inline={true}/>
	  </div>
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
