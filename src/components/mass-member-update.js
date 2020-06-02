import React from 'react'
import { connect } from 'react-redux'
import { DateInput } from 'semantic-ui-calendar-react'
import { Form, Button, Checkbox, Message, Modal, Icon } from 'semantic-ui-react'
import { capitalize, startCase, debounce } from 'lodash'
import { errorExist } from '../utils'
import { addMassTeam, editMassTeam, deleteMassTeam } from '../actions'

class MassMemberUpdate extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      isLoading: false,
      value: '',
      results: [],
      designation: '',
      post: '',
      startDate: '',
      endDate: '',
      hasEditRights: false,
      hasAdminRights: false,
      success: false,
      error: false,
      message: '',
      modalOpen: false,
      enrolmentNumbers: [],
      disabled: true
    }
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
    if (this.props.method === 'add') {
      if (
        name === 'startDate' &&
        value !== '' &&
        this.state.enrolmentNumbers.length !== 0
      ) {
        this.setState({ disabled: false })
      } else {
        this.setState({ disabled: true })
      }
    }
  }
  handleCheckChange = (e, { name, checked }) => {
    this.setState({
      [name]: checked
    })
  }
  handleListChange = (e, { value }) => {
    var a = value.split(',')
    var enrolmentNumbers = []
    a.forEach(element => {
      enrolmentNumbers.push(Number(element))
    })
    if (this.props.method !== 'add' && enrolmentNumbers.length !== 0) {
      this.setState({ disabled: false })
    }
    this.setState({
      enrolmentNumbers: enrolmentNumbers
    })
  }
  handleAdd = () => {
    this.setState({ disabled: true })
    const data = {
      enrolmentNos: this.state.enrolmentNumbers,
      startDate: this.state.startDate,
      endDate: this.state.endDate || null,
      designation: this.state.designation,
      post: this.state.post,
      hasAdminRights: this.state.hasAdminRights,
      hasEditRights: this.state.hasEditRights,
      group: this.props.activeGroup.data.id
    }
    this.props.AddMassTeam(data, this.successCallback, this.errCallback)
  }
  handleDelete = () => {
    this.setState({ disabled: true })
    this.handleClose()
    const data = {
      method: 'delete',
      enrolmentNos: this.state.enrolmentNumbers,
      group: this.props.activeGroup.data.id
    }
    this.props.DeleteMassTeam(data, this.successCallback, this.errCallback)
  }
  handleEdit = () => {
    this.setState({ disabled: true })
    const data = {
      method: 'edit',
      enrolmentNos: this.state.enrolmentNumbers,
      startDate: this.state.startDate,
      endDate: this.state.endDate || null,
      designation: this.state.designation,
      post: this.state.post,
      hasAdminRights: this.state.hasAdminRights,
      hasEditRights: this.state.hasEditRights,
      group: this.props.activeGroup.data.id
    }
    this.props.EditMassTeam(data, this.successCallback, this.errCallback)
  }
  successCallback = res => {
    this.setState({
      success: true,
      error: false,
      message: res.data,
      value: '',
      results: [],
      designation: '',
      post: '',
      enrolmentNumbers: [],
      startDate: 'YYYY-MM-DD',
      endDate: 'YYYY-MM-DD',
      hasEditRights: false,
      hasAdminRights: false,
      modalOpen: false,
      disabled: true
    })
  }
  errCallback = err => {
    console.log(err)
    this.setState({
      success: false,
      error: true,
      message: err.response.data
    })
  }
  handleOpen = () => {
    this.setState({
      modalOpen: true
    })
  }
  handleClose = () => {
    this.setState({
      modalOpen: false
    })
  }
  render () {
    const { message, error, success, modalOpen, enrolmentNumbers } = this.state
    const { groupTeam, method, activeGroup } = this.props
    var add = false
    var edit = false
    var del = false
    if (method === 'add') {
      add = true
    } else if (method === 'edit') {
      edit = true
    } else {
      del = true
    }
    return (
      <React.Fragment>
        {error && (
          <Message
            negative
            header='Error'
            list={Object.keys(message)
              .map(cat => {
                return message[cat].map(x => {
                  return `${capitalize(startCase(cat))}: ${x}`
                })
              })
              .map(x => {
                return x[0]
              })}
          />
        )}
        {success && (
          <Message positive header='Success' content={`Successfully updated`} />
        )}
        {del && (
          <Form>
            <Form.Field required>
              <label>Enrolment Numbers</label>
              <Form.TextArea
                name='enrolmentNumbers'
                placeholder='Enrolment Numbers'
                onChange={this.handleListChange}
                fluid
              />
            </Form.Field>
            <Form.Field>
              <Button
                negative
                disabled={this.state.disabled}
                icon='user delete'
                content='Delete'
                onClick={this.handleOpen}
                loading={groupTeam.changing}
                type='submit'
              />
            </Form.Field>
            <Modal
              open={modalOpen}
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
                {enrolmentNumbers.map((item, index) => {
                  return <strong>{item} </strong>
                })}{' '}
                from members of <strong>{activeGroup.data.name}</strong>? This
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
          </Form>
        )}
        {add && (
          <Form>
            <Form.Field required error={error && errorExist(message, 'person')}>
              <label>Enrolment Numbers</label>
              <Form.TextArea
                name='enrolmentNumbers'
                placeholder='Enrolment Numbers'
                onChange={this.handleListChange}
                fluid
              />
            </Form.Field>
            <Form.Field error={error && errorExist(message, 'designation')}>
              <label>Designation</label>
              <Form.Input
                name='designation'
                placeholder='Designation'
                value={this.state.designation}
                onChange={this.handleChange}
                fluid
              />
            </Form.Field>
            <Form.Field error={error && errorExist(message, 'post')}>
              <label>Post</label>
              <Form.Input
                name='post'
                placeholder='Post'
                value={this.state.post}
                onChange={this.handleChange}
                fluid
              />
            </Form.Field>
            <Form.Field
              required
              error={error && errorExist(message, 'startDate')}
            >
              <label>Joining date</label>
              <DateInput
                dateFormat='YYYY-MM-DD'
                fluid
                placeholder='YYYY-MM-DD'
                name='startDate'
                value={this.state.startDate}
                iconPosition='left'
                onChange={this.handleDateChange}
              />
            </Form.Field>
            <Form.Field error={error && errorExist(message, 'endDate')}>
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
            <Form.Field error={error && errorExist(message, 'hasEditRights')}>
              <Checkbox
                onChange={this.handleCheckChange}
                checked={this.state.hasEditRights}
                name='hasEditRights'
                label='Has edit rights'
              />
            </Form.Field>
            <Form.Field error={error && errorExist(message, 'hasAdminRights')}>
              <Checkbox
                onChange={this.handleCheckChange}
                checked={this.state.hasAdminRights}
                name='hasAdminRights'
                label='Has admin rights'
              />
            </Form.Field>
            <Form.Field>
              <Button
                primary
                disabled={this.state.disabled}
                icon='user add'
                content='Add'
                onClick={this.handleAdd}
                loading={groupTeam.changing}
                type='submit'
              />
            </Form.Field>
          </Form>
        )}
        {edit && (
          <Form>
            <Form.Field required error={error && errorExist(message, 'person')}>
              <label>Enrolment Numbers</label>
              <Form.TextArea
                name='enrolmentNumbers'
                placeholder='Enrolment Numbers'
                onChange={this.handleListChange}
                fluid
              />
            </Form.Field>
            <Form.Field error={error && errorExist(message, 'designation')}>
              <label>Designation</label>
              <Form.Input
                name='designation'
                placeholder='Designation'
                value={this.state.designation}
                onChange={this.handleChange}
                fluid
              />
            </Form.Field>
            <Form.Field error={error && errorExist(message, 'post')}>
              <label>Post</label>
              <Form.Input
                name='post'
                placeholder='Post'
                value={this.state.post}
                onChange={this.handleChange}
                fluid
              />
            </Form.Field>
            <Form.Field error={error && errorExist(message, 'startDate')}>
              <label>Joining date</label>
              <DateInput
                dateFormat='YYYY-MM-DD'
                fluid
                placeholder='YYYY-MM-DD'
                name='startDate'
                value={this.state.startDate}
                iconPosition='left'
                onChange={this.handleDateChange}
              />
            </Form.Field>
            <Form.Field error={error && errorExist(message, 'endDate')}>
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
            <Form.Field error={error && errorExist(message, 'hasEditRights')}>
              <Checkbox
                onChange={this.handleCheckChange}
                checked={this.state.hasEditRights}
                name='hasEditRights'
                label='Has edit rights'
              />
            </Form.Field>
            <Form.Field error={error && errorExist(message, 'hasAdminRights')}>
              <Checkbox
                onChange={this.handleCheckChange}
                checked={this.state.hasAdminRights}
                name='hasAdminRights'
                label='Has admin rights'
              />
            </Form.Field>
            <Form.Field>
              <Button
                primary
                disabled={this.state.disabled}
                icon='user edit'
                content='Edit'
                onClick={this.handleEdit}
                loading={groupTeam.changing}
                type='submit'
              />
            </Form.Field>
          </Form>
        )}
      </React.Fragment>
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
    AddMassTeam: (data, successCallback, errCallback) => {
      dispatch(addMassTeam(data, successCallback, errCallback))
    },
    EditMassTeam: (data, successCallback, errCallback) => {
      dispatch(editMassTeam(data, successCallback, errCallback))
    },
    DeleteMassTeam: (data, successCallback, errCallback) => {
      dispatch(deleteMassTeam(data, successCallback, errCallback))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MassMemberUpdate)
