import React from 'react'
import { connect } from 'react-redux'
import {
  Card,
  Icon,
  Segment,
  Modal,
  Form,
  Input,
  Checkbox,
  Button,
  Message,
  Dropdown,
  Placeholder
} from 'semantic-ui-react'
import { DateInput } from 'semantic-ui-calendar-react'
import { capitalize, startCase } from 'lodash'

import { TileCard, UserCard } from 'formula_one'
import EmptyGroupTeamList from './empty-group-team-list'
import AddMember from './add-member'
import { errorExist } from '../utils'
import { changeTeamMember, removeMember } from '../actions'

class GroupTeamList extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      editModalOpen: '',
      editUser: {},
      toDelete: {},
      error: false,
      success: false,
      message: ''
    }
  }
  handleEdit = member => {
    this.setState({
      error: false,
      success: false,
      message: '',
      editModalOpen: member.id,
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
    this.props.ChangeTeamMember(
      this.state.editUser.id,
      data,
      this.successCallback,
      this.errCallback
    )
  }
  handleClose = () => {
    this.setState({ modalOpen: '', toDelete: {} })
  }
  handleEditModalClose = () => {
    this.setState({ editModalOpen: '' })
  }
  handleRemove = member => {
    this.setState({
      modalOpen: member.id,
      toDelete: member
    })
  }
  handleDelete = () => {
    this.props.RemoveMember(this.state.toDelete.id)
    this.setState({ modalOpen: '', toDelete: {} })
  }
  handleCheckChange = (e, { name, checked }) => {
    this.setState({
      [name]: checked
    })
  }
  successCallback = res => {
    this.setState({
      editModalOpen: '',
      success: true,
      error: false,
      message: res.data
    })
  }
  errCallback = err => {
    this.setState({
      success: false,
      error: true,
      message: err.response.data
    })
  }
  render () {
    const { message, error } = this.state
    const { activeGroup, groupTeam } = this.props
    const { hasAdminRights } = activeGroup
    const { team } = groupTeam
    return activeGroup.isLoaded && groupTeam.isLoaded ? (
      <React.Fragment>
        <Card.Group itemsPerRow={3} stackable doubling>
          {activeGroup.hasAdminRights && (
            <Modal
              trigger={
                <TileCard
                  name='Add'
                  iconName='add'
                  desc={<span>Add a new member</span>}
                />
              }
              size='tiny'
              closeIcon
            >
              <Modal.Header>Add member</Modal.Header>
              <Modal.Content>
                <AddMember />
              </Modal.Content>
            </Modal>
          )}
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
                        <Dropdown
                          icon={{ name: 'ellipsis vertical', color: 'grey' }}
                          pointing='top right'
                        >
                          <Dropdown.Menu>
                            <Dropdown.Item>
                              <Modal
                                open={this.state.editModalOpen === member.id}
                                trigger={
                                  <span
                                    onClick={() => {
                                      this.handleEdit(member)
                                    }}
                                  >
                                    <Icon name='pencil' />
                                    Edit
                                  </span>
                                }
                                onClose={this.handleEditModalClose}
                                size='tiny'
                                closeIcon
                              >
                                <Modal.Header>Edit member</Modal.Header>
                                <Modal.Content>
                                  <UserCard
                                    name={member.person.fullName}
                                    roles={[member.designation, member.post]}
                                    image={member.person.displayPicture}
                                  />
                                  <Form>
                                    {error && (
                                      <Message
                                        negative
                                        header='Error'
                                        list={Object.keys(message)
                                          .map(cat => {
                                            return message[cat].map(x => {
                                              return `${capitalize(
                                                startCase(cat)
                                              )}: ${x}`
                                            })
                                          })
                                          .map(x => {
                                            return x[0]
                                          })}
                                      />
                                    )}
                                    <Form.Field
                                      error={
                                        error &&
                                        errorExist(message, 'designation')
                                      }
                                    >
                                      <label>Designation</label>
                                      <Input
                                        name='designation'
                                        value={this.state.designation}
                                        onChange={this.handleChange}
                                      />
                                    </Form.Field>
                                    <Form.Field
                                      error={
                                        error && errorExist(message, 'post')
                                      }
                                    >
                                      <label>Post</label>
                                      <Input
                                        name='post'
                                        value={this.state.post}
                                        onChange={this.handleChange}
                                      />
                                    </Form.Field>
                                    <Form.Field
                                      error={
                                        error &&
                                        errorExist(message, 'startDate')
                                      }
                                      required
                                    >
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
                                    <Form.Field
                                      error={
                                        error && errorExist(message, 'endDate')
                                      }
                                    >
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
                                    <Form.Field
                                      error={
                                        error &&
                                        errorExist(message, 'hasEditRights')
                                      }
                                    >
                                      <Checkbox
                                        onChange={this.handleCheckChange}
                                        name='hasEditRights'
                                        label='Has edit rights'
                                        defaultChecked={
                                          this.state.hasEditRights
                                        }
                                      />
                                    </Form.Field>
                                    <Form.Field
                                      error={
                                        error &&
                                        errorExist(message, 'hasAdminRights')
                                      }
                                    >
                                      <Checkbox
                                        onChange={this.handleCheckChange}
                                        name='hasAdminRights'
                                        label='Has admin rights'
                                        defaultChecked={
                                          this.state.hasAdminRights
                                        }
                                      />
                                    </Form.Field>
                                  </Form>
                                </Modal.Content>
                                <Modal.Actions>
                                  <Button
                                    icon='check'
                                    primary
                                    content='Update'
                                    onClick={this.handleUpdate}
                                  />
                                </Modal.Actions>
                              </Modal>
                            </Dropdown.Item>
                            <Dropdown.Item>
                              <Modal
                                trigger={
                                  <span
                                    onClick={() => this.handleRemove(member)}
                                  >
                                    <Icon name='close' />
                                    Delete
                                  </span>
                                }
                                open={this.state.modalOpen === member.id}
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
                                  <Button
                                    onClick={this.handleClose}
                                    icon='left arrow'
                                    content='Keep'
                                    basic
                                  />
                                  <Button
                                    icon='close'
                                    content="Delete, I'm sure"
                                    negative
                                    onClick={this.handleDelete}
                                  />
                                </Modal.Actions>
                              </Modal>
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </React.Fragment>
                    )
                  }
                />
              )
            })}
        </Card.Group>
        {!groupTeam.isLoaded && <EmptyGroupTeamList />}
        {groupTeam.isLoaded && !team.next ? (
          <Segment basic textAlign='center'>
            <Icon name='frown outline' />
            No more members available. You have scrolled enough for today.
          </Segment>
        ) : (
          <Segment basic textAlign='center'>
            <Icon name='sort' />
            Scroll for more.
          </Segment>
        )}
      </React.Fragment>
    ) : (
      <EmptyGroupTeamList />
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
    ChangeTeamMember: (id, data, successCallback, errCallback) => {
      dispatch(changeTeamMember(id, data, successCallback, errCallback))
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
