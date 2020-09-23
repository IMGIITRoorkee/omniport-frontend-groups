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

import { Editor } from '@tinymce/tinymce-react'

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
                  
		  <Editor 
			apikey="fb3pb0ana4mvi60jwhefs3g2u3501d9s915efud2rh6ax2ek" 
			init={{
                        	menubar: false,
                        	plugins: [
                        	'advlist autolink lists link image charmap print preview anchor',
                        	'searchreplace visualblocks code fullscreen',
                        	'insertdatetime media table paste code help wordcount'
                        	],
                        	}}
		  	value={this.state[field]}
		  	textareaName={field}
		  	onChange={this.handleEditorChange}
 		/>
                </Form.Field>
              </Form>
              <Dimmer active={inEditMode === field && !error} inverted />
            </Dimmer.Dimmable>
          ) : (
		<Editor 
		  	apikey="fb3pb0ana4mvi60jwhefs3g2u3501d9s915efud2rh6ax2ek"
			init={{
                        	menubar: false,
                        	plugins: [
                        		'advlist autolink lists link image charmap print preview anchor',
                        		'searchreplace visualblocks code fullscreen',
                        		'insertdatetime media table paste code help wordcount'
                        	],
                        }}
			value={data[field]}
			textareaName={field}
			inline={true}
			disabled={true}
			onChange={this.handleEditorChange}
		/>
 			|| 'None'
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
