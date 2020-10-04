import React from 'react'
import { connect } from 'react-redux'
import {
  Segment,
  Header,
  Icon,
  Form,
  TextArea,
  Loader,
  Dimmer,
  Message,
  Dropdown
} from 'semantic-ui-react'

import { getTheme } from 'formula_one'
import { changeActiveGroup } from '../actions'
import '../css/group.css'
import { RTField } from '../fields'
import { Textfield } from '../fields'

class PurposeCard extends React.Component {
  constructor (props) {
    super(props)
    const { activeGroup, field } = this.props
    const { data } = activeGroup
    this.state = {
      editMode: false,
      [field]: data[field],
      error: false,
      success: false,
      message: ''
    }
  }

  handleClick = () => {
    const { activeGroup, field } = this.props
    const { data } = activeGroup
    if (this.state.editMode) {
      this.props.ChangeActiveGroup(
        data.slug,
        field,
        {
          [field]: this.state[field]
        },
        this.successCallback,
        this.errCallback
      )
    } else {
      this.setState({
        editMode: !this.state.editMode,
        [field]: data[field]
      })
    }
  }

  successCallback = res => {
    this.setState({
      editMode: false,
      error: false,
      success: true,
      message: ''
    })
  }

  errCallback = err => {
    this.setState({
      editMode: true,
      error: true,
      success: false,
      message: err.response.data
    })
  }

  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value
    })
  }

  handleEditorChange = (content) => {
    const { activeGroup, field } = this.props
    const { data } = activeGroup
    this.setState({[field]: content.level.content})
  }

  render () {
    const { error, message, success } = this.state
    const { activeGroup, heading, field } = this.props
    const { data, inEditMode, hasEditRights } = activeGroup
    const purposeField = {
      'shortDescription': Textfield,
      'about': RTField,
      'mission': RTField
    };
    let name = {field}.field
    let Component = purposeField[name];
    let display;
    display = this.state[field] || 'None'

    return (
      <React.Fragment>
        <Segment
          styleName='info-card-heading-container'
          color={getTheme()}
          attached='top'
        >
          <div styleName='info-card-heading'>
            <Header as='h4'>{heading}</Header>
          </div>
          {hasEditRights ? (
            inEditMode === field && !error ? (
              <Loader active size='tiny' inline />
            ) : this.state.editMode ? (
              <Icon name='save' onClick={this.handleClick} color='blue' link />
            ) : (
              <Dropdown
                icon={{ name: 'ellipsis vertical', color: 'grey' }}
                pointing='top right'
              >
                <Dropdown.Menu>
                  <Dropdown.Item onClick={this.handleClick}>
                    <Icon name='pencil' link />
                    Edit
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )
          ) : (
            false
          )}
        </Segment>
        <Segment styleName='info-card-description-container' attached='bottom'>
          {this.state.error && (
            <Message
              negative
              header='Error'
              list={this.state.message[field].map(x => {
                return `${heading}: ${x}`
              })}
            />
          )}
          {this.state.editMode || inEditMode === field ? (
            <Dimmer.Dimmable dimmed={inEditMode === field}>
              <Form>
                <Form.Field
                  error={
                    Boolean(
                      Object.keys(message).find(x => {
                        return x === field
                      })
                    ) && error
                  }
                >
                  <Component 
                    field={this.state[field]} 
                    handleEditorChange={this.handleEditorChange} 
                    disabled={false} 
                    inline={false} 
                    handleChange={this.handleChange} 
                    name={{field}.field}
                  />
		</Form.Field>
              </Form>
              <Dimmer active={inEditMode === field && !error} inverted />
            </Dimmer.Dimmable>
          ) : (  
                <RTField 
                  field={display} 
                  handleEditorChange={this.handleEditorChange} 
                  disabled={true} 
                  inline={true}
                />
             )}
        </Segment>
      </React.Fragment>
    )
  }
}

function mapStateToProps (state) {
  return {
    activeGroup: state.activeGroup
  }
}
const mapDispatchToProps = dispatch => {
  return {
    ChangeActiveGroup: (slug, field, data, successCallback, errCallback) => {
      dispatch(
        changeActiveGroup(slug, field, data, successCallback, errCallback)
      )
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PurposeCard)
