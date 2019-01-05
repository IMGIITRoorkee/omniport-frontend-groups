import React from 'react'
import { connect } from 'react-redux'
import {
  Card,
  Icon,
  Segment,
  Loader,
  Modal,
  Form,
  Input,
  Checkbox,
  Button
} from 'semantic-ui-react'
import { DateInput } from 'semantic-ui-calendar-react'

import { UserCard } from 'formula_one'
import {
  setActiveGroupWithTeam,
  changeTeamMember,
  removeMember
} from '../actions'
import '../css/group-team.css'

class GroupTeamList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      editModalOpen: false,
      editUser: {},
      toDelete: {}
    }
  }
  handleEdit = member => {
    this.setState({
      editModalOpen: true,
      editUser: member,
      designation: member.designation || '',
      post: member.post || '',
      joiningDate: member.startDate || '',
      endDate: member.endDate || '',
      hasEditRights: member.hasEditRights || false,
      hasAdminRights: member.hasAdminRights || false
    })
  }
  handleChange = e => {
    const { name, value } = e.target
    this.setState({
      [name]: value
    })
  }
  handleDateChange = (e, { name, value }) => {
    this.setState({
      [name]: value
    })
  }
  handleUpdate = () => {
    const data = {
      startDate: this.state.joiningDate,
      endDate: this.state.endDate || null,
      designation: this.state.designation,
      post: this.state.post,
      hasAdminRights: this.state.hasAdminRights,
      hasEditRights: this.state.hasEditRights
    }
    this.props.ChangeTeamMember(this.state.editUser.id, data)
  }
  handleClose = () => this.setState({ modalOpen: false, toDelete: {} })
  handleRemove = member => {
    this.setState({
      modalOpen: true,
      toDelete: member
    })
  }
  handleDelete = () => {
    this.props.RemoveMember(this.state.toDelete.id)
    this.setState({ modalOpen: false, toDelete: {} })
  }
  handleCheckChange = (e, { name, checked }) => {
    this.setState({
      [name]: checked
    })
  }
  render () {
    const { activeGroup, groupTeam } = this.props
    const { hasAdminRights } = activeGroup
    const { team } = groupTeam
    return (
      activeGroup.isLoaded && (
        <React.Fragment>
          <Card.Group itemsPerRow={3} stackable doubling>
            {team.results &&
              team.results.map(member => {
                return (
                  <UserCard
                    key={member.id}
                    name={member.person.fullName}
                    roles={[member.designation, member.post]}
                    image={member.person.displayPicture}
                    right={
                      hasAdminRights && (
                        <React.Fragment>
                          <div>
                            <Modal
                              trigger={
                                <Icon
                                  name='pencil'
                                  onClick={() => {
                                    this.handleEdit(member)
                                  }}
                                />
                              }
                              size='tiny'
                            >
                              <Modal.Header>Edit person</Modal.Header>
                              <Modal.Content>
                                <UserCard
                                  name={member.person.fullName}
                                  roles={[member.designation, member.post]}
                                  image={member.person.displayPicture}
                                />
                                <Form>
                                  <Form.Field>
                                    <label>Designation</label>
                                    <Input
                                      name='designation'
                                      value={this.state.designation}
                                      onChange={this.handleChange}
                                    />
                                  </Form.Field>
                                  <Form.Field>
                                    <label>Post</label>
                                    <Input
                                      name='post'
                                      value={this.state.post}
                                      onChange={this.handleChange}
                                    />
                                  </Form.Field>
                                  <Form.Field>
                                    <label>Joining date</label>
                                    <DateInput
                                      dateFormat='YYYY-MM-DD'
                                      fluid
                                      placeholder='YYYY-MM-DD'
                                      name='joiningDate'
                                      value={this.state.joiningDate}
                                      iconPosition='left'
                                      onChange={this.handleDateChange}
                                    />
                                  </Form.Field>
                                  <Form.Field>
                                    <label>End date</label>
                                    <DateInput
                                      dateFormat='YYYY-MM-DD'
                                      fluid
                                      placeholder='YYYY-MM-DD'
                                      name='endDate'
                                      onChange={this.handleDateChange}
                                      value={this.state.endDate}
                                      iconPosition='left'
                                    />
                                  </Form.Field>
                                  <Form.Field>
                                    <Checkbox
                                      onChange={this.handleCheckChange}
                                      name='hasEditRights'
                                      label='Has edit rights'
                                      defaultChecked={this.state.hasEditRights}
                                    />
                                    <Checkbox
                                      onChange={this.handleCheckChange}
                                      name='hasAdminRights'
                                      label='Has admin rights'
                                      defaultChecked={this.state.hasAdminRights}
                                    />
                                  </Form.Field>
                                </Form>
                              </Modal.Content>
                              <Modal.Actions>
                                <Button
                                  primary
                                  content='Update'
                                  onClick={this.handleUpdate}
                                />
                              </Modal.Actions>
                            </Modal>
                          </div>
                          <div>
                            <Modal
                              trigger={
                                <Icon
                                  onClick={() => this.handleRemove(member)}
                                  name='close'
                                />
                              }
                              open={this.state.modalOpen}
                              onClose={this.handleClose}
                              size='small'
                              dimmer='blurring'
                            >
                              <Modal.Header>
                                <Icon name='warning sign' color='red' />
                                Confirm irreversible deletion
                              </Modal.Header>
                              <Modal.Content>
                                Are you sure you want to remove{' '}
                                <strong>
                                  {this.state.toDelete.person &&
                                    this.state.toDelete.person.fullName}
                                </strong>{' '}
                                from members of{' '}
                                <strong>{activeGroup.data.name}</strong>? This
                                action <strong>cannot</strong> be undone.
                              </Modal.Content>
                              <Modal.Actions>
                                <Button positive onClick={this.handleClose}>
                                  <Icon name='left arrow' /> Keep
                                </Button>
                                <Button negative onClick={this.handleDelete}>
                                  <Icon name='close' /> Delete, I'm sure
                                </Button>
                              </Modal.Actions>
                            </Modal>
                          </div>
                        </React.Fragment>
                      )
                    }
                  />
                )
              })}
          </Card.Group>
          {!groupTeam.isLoaded && (
            <Segment basic>
              <Loader active />
            </Segment>
          )}
          {groupTeam.isLoaded && !team.next ? (
            <Segment basic textAlign='center'>
              <Icon name='frown outline' />
              No more members availaible. You have scrolled enough for today.
            </Segment>
          ) : (
            <Segment basic textAlign='center'>
              <Icon name='sort' />
              Scroll for more.
            </Segment>
          )}
        </React.Fragment>
      )
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
    },
    ChangeTeamMember: (id, data) => {
      dispatch(changeTeamMember(id, data))
    },
    RemoveMember: id => {
      dispatch(removeMember(id))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupTeamList)
