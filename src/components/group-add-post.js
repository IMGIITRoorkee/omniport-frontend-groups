import React from 'react'
import { connect } from 'react-redux'
import {
  Card,
  Image,
  Form,
  TextArea,
  Button,
  Dimmer,
  Segment,
  Icon,
  Label,
  Message
} from 'semantic-ui-react'
import { capitalize, startCase } from 'lodash'

import { DefaultDP, getTheme } from 'formula_one'
import { errorExist } from '../utils'
import { addPost } from '../actions'
import { RTField } from '../fields'

import inline from 'formula_one/src/css/inline.css'
import main from '../css/group-post-card.css'

class GroupAddPost extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '',
      fileSrc: '',
      logo: null,
      success: false,
      error: false,
      message: ''
    }
  }
  removeImage = () => {
    this.setState({
      logo: null,
      fileSrc: ''
    })
  }
  fileChange = e => {
    this.setState({
      logo: e.target.files[0],
      fileSrc: e.target.files[0]
        ? URL.createObjectURL(e.target.files[0])
        : null
    })
  }
  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value
    })
  }
  handleEditorChange = (content) => {
    this.setState({
      text: content.level.content
    })
  }
  handleClick = () => {
    var formData = new FormData()
    formData.append('group', this.props.activeGroup.data.id)
    formData.append('text', this.state.text)
    if (this.state.logo) {
      formData.append('image', this.state.logo)
    }
    this.props.AddPost(formData, this.successCallback, this.errCallback)
  }
  successCallback = res => {
    this.setState({
      text: '',
      logo: null,
      fileSrc: '',
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
    const { error, message, success } = this.state
    const { activeGroup, activeGroupPost } = this.props
    const { fileSrc } = this.state
    const content = (
      <Label color={getTheme()} floating onClick={this.removeImage}>
        <Icon name='close' fitted />
      </Label>
    )
    return (
      <Card fluid color={getTheme()}>
        <Card.Content>
          <div styleName='main.post-header'>
            <div styleName='main.post-user'>
              <div styleName='main.post-user-pic'>
                {activeGroup.data.logo ? (
                  <Image src={activeGroup.data.logo} avatar />
                ) : (
                  <DefaultDP name={activeGroup.data.name} />
                )}
              </div>

              <div styleName='main.post-user-desc'>
                <Card.Header>
                  <span styleName='main.post-user-name'>
                    {activeGroup.data.name}
                  </span>
                </Card.Header>
                <Card.Meta>Add a new post</Card.Meta>
              </div>
            </div>
          </div>
        </Card.Content>
        <Card.Content>
          <div styleName='main.post-card-description'>
            <Form>
              {error && (
                <Message
                  negative
                  icon='frown outline'
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
              <Dimmer.Dimmable dimmed={activeGroupPost.adding}>
                <Form.Field error={error && errorExist(message, 'image')}>
                  <label>Attach a picture</label>
                </Form.Field>
                {!fileSrc ? (
                  <React.Fragment>
                    <label htmlFor='uploadLogo'>
                      <Button
                        as='span'
                        basic
                        icon='upload'
                        content='Upload'
                        color={getTheme()}
                        styleName='inline.margin-bottom-1em'
                      />
                    </label>
                    <input
                      type='file'
                      accept='image/*'
                      onChange={this.fileChange}
                      name='logo'
                      id='uploadLogo'
                      styleName='inline.display-none'
                    />
                  </React.Fragment>
                ) : (
                  <Segment basic compact>
                    {content}
                    <Image
                      src={fileSrc}
                      style={{ width: '100%', height: '100%' }}
                    />
                  </Segment>
                )}
                <Form.Field
                  required
                  error={error && errorExist(message, 'text')}
                >
                <RTField 
                  field={this.state.text} 
                  handleEditorChange={this.handleEditorChange} 
                  disabled={false} 
                  inline={false} 
                />
                </Form.Field>

                <Dimmer active={activeGroupPost.adding} inverted />
              </Dimmer.Dimmable>
              <Form.Field>
                <Button
                  content='Post'
                  icon='send'
                  color={getTheme()}
                  floated='right'
                  disabled={!this.state.text}
                  onClick={this.handleClick}
                  loading={activeGroupPost.adding}
                />
              </Form.Field>
            </Form>
          </div>
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
    AddPost: (data, successCallback, errCallback) => {
      dispatch(addPost(data, successCallback, errCallback))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupAddPost)
