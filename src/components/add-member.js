import React from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import { DateInput } from 'semantic-ui-calendar-react'
import {
  Form,
  Header,
  Segment,
  Search,
  Button,
  Checkbox
} from 'semantic-ui-react'

import { getTheme, UserCard } from 'formula_one'
import { urlSearchPerson } from '../urls'
import '../css/group-team.css'
import { addTeam } from '../actions'

class AddMember extends React.Component {
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
      hasAdminRights: false
    }
  }
  handleSearchChange = (e, { value }) => {
    this.setState({
      value: value,
      isLoading: true
    })
    axios.get(urlSearchPerson(), { params: { search: value } }).then(res => {
      this.setState({
        results: res.data.slice(0, 3).map(person => {
          return { person, title: person.fullName }
        }),
        isLoading: false
      })
    })
  }
  handleResultSelect = (e, { result }) => {
    this.setState({
      value: result.person.fullName,
      person_id: result.person.id
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
  handleCheckChange = (e, { name, checked }) => {
    this.setState({
      [name]: checked
    })
  }
  handleAdd = () => {
    const data = {
      person: this.state.person_id,
      startDate: this.state.startDate,
      endDate: this.state.endDate || null,
      designation: this.state.designation,
      post: this.state.post,
      hasAdminRights: this.state.hasAdminRights,
      hasEditRights: this.state.hasEditRights,
      group: this.props.activeGroup.data.id
    }
    this.props.AddTeam(data)
    this.setState({
      value: '',
      results: [],
      designation: '',
      post: '',
      startDate: 'YYYY-MM-DD',
      endDate: 'YYYY-MM-DD',
      hasEditRights: false,
      hasAdminRights: false
    })
  }
  render () {
    const { isLoading, value, results } = this.state
    const { groupTeam } = this.props
    const resultRenderer = ({ person, title }) => (
      <UserCard
        key={person.id}
        name={person.fullName}
        roles={person.roles.map(x => {
          return x.role
        })}
        image={person.displayPicture}
      />
    )
    return (
      <React.Fragment>
        <Segment attached='top' color={getTheme()}>
          <Header as='h3'>Add members</Header>
        </Segment>
        <Segment attached='bottom'>
          <Form>
            <Form.Field>
              <label>Select</label>
              <Search
                loading={isLoading}
                onSearchChange={this.handleSearchChange}
                onResultSelect={this.handleResultSelect}
                results={results}
                value={value}
                fluid
                input={{ fluid: true }}
                resultRenderer={resultRenderer}
                placeholder='Add members by their name or contact information'
              />
            </Form.Field>

            <Form.Field>
              <label>Designation</label>
              <Form.Input
                name='designation'
                placeholder='Designation'
                value={this.state.designation}
                onChange={this.handleChange}
                fluid
              />
            </Form.Field>
            <Form.Field>
              <label>Post</label>
              <Form.Input
                name='post'
                placeholder='Post'
                value={this.state.post}
                onChange={this.handleChange}
                fluid
              />
            </Form.Field>
            <Form.Field>
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
                checked={this.state.hasEditRights}
                name='hasEditRights'
                label='Has edit rights'
              />
            </Form.Field>
            <Form.Field>
              <Checkbox
                onChange={this.handleCheckChange}
                checked={this.state.hasAdminRights}
                name='hasAdminRights'
                label='Has admin rights'
              />
            </Form.Field>
            <Form.Field>
              <Button
                basic
                primary
                icon='user add'
                content='Add'
                onClick={this.handleAdd}
                loading={groupTeam.changing}
              />
            </Form.Field>
          </Form>
        </Segment>
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
    AddTeam: data => {
      dispatch(addTeam(data))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddMember)
