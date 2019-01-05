import React from 'react'
import { connect } from 'react-redux'
import {
  Card,
  Header,
  Icon,
  Form,
  TextArea,
  Loader,
  Dimmer
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
      [field]: data[field]
    }
  }

  handleClick = () => {
    const { activeGroup, field } = this.props
    const { data } = activeGroup
    if (this.state.editMode) {
      this.props.ChangeActiveGroup(data.slug, field, {
        [field]: this.state[field]
      })
    }
    this.setState({
      editMode: !this.state.editMode,
      [field]: data[field]
    })
  }

  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value
    })
  }

  render () {
    const { activeGroup, heading, field } = this.props
    const { data, inEditMode, hasEditRights } = activeGroup
    return (
      <Card color={getTheme()} fluid>
        <Card.Content styleName='info-card-heading-container'>
          <div styleName='info-card-heading'>
            <Header as='h4'>{heading}</Header>
          </div>
          {hasEditRights ? (
            inEditMode === field ? (
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
          {this.state.editMode || inEditMode === field ? (
            <Dimmer.Dimmable dimmed={inEditMode === field}>
              <Form>
                <TextArea
                  autoHeight
                  name={field}
                  value={this.state[field]}
                  onChange={this.handleChange}
                />
              </Form>
              <Dimmer active={inEditMode === field} inverted />
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
    ChangeActiveGroup: (slug, field, data) => {
      dispatch(changeActiveGroup(slug, field, data))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PurposeCard)
