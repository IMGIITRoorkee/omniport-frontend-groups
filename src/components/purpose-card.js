import React from 'react'
import { connect } from 'react-redux'
import {
  Card,
  Header,
  Icon,
  Form,
  TextArea,
  Loader,
  Dimmer,
  Message
} from 'semantic-ui-react'

import { getTheme } from 'formula_one'
import { changeActiveGroup } from '../actions'
import '../css/group.css'

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

  render () {
    const { error, message, success } = this.state
    const { activeGroup, heading, field } = this.props
    const { data, inEditMode, hasEditRights } = activeGroup
    return (
      <Card color={getTheme()} fluid>
        <Card.Content styleName='info-card-heading-container'>
          <div styleName='info-card-heading'>
            <Header as='h4'>{heading}</Header>
          </div>
          {hasEditRights ? (
            inEditMode === field && !error ? (
              <Loader active size='tiny' inline />
            ) : (
              <Icon
                name={this.state.editMode ? 'save' : 'pencil'}
                onClick={this.handleClick}
              />
            )
          ) : (
            false
          )}
        </Card.Content>
        <Card.Content styleName='info-card-description-container'>
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
                  <TextArea
                    autoHeight
                    name={field}
                    value={this.state[field]}
                    onChange={this.handleChange}
                  />
                </Form.Field>
              </Form>
              <Dimmer active={inEditMode === field && !error} inverted />
            </Dimmer.Dimmable>
          ) : (
            data[field] || 'None'
          )}
        </Card.Content>
      </Card>
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
