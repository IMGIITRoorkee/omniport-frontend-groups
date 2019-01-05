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
  Label
} from 'semantic-ui-react'

import { DefaultDP, getTheme } from 'formula_one'
import { addPost } from '../actions'

import inline from 'formula_one/src/css/inline.css'
import main from '../css/group-post-card.css'

class GroupAddPost extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      text: '',
      fileSrc: '',
      logo: null
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
  handleClick = () => {
    var formData = new FormData()
    formData.append('group', this.props.activeGroup.data.id)
    formData.append('text', this.state.text)
    if (this.state.logo) {
      formData.append('image', this.state.logo)
    }
    this.props.AddPost(formData)
    this.setState({
      text: '',
      logo: null,
      fileSrc: ''
    })
  }
  render () {
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
              <Dimmer.Dimmable dimmed={activeGroupPost.adding}>
                <Form.Field>
                  <label>Attach a picture</label>
                </Form.Field>
                {!fileSrc ? (
                  <React.Fragment>
                    <label htmlFor='uploadLogo'>
                      <Button
                        as='span'
                        icon
                        labelPosition='left'
                        color={getTheme()}
                        styleName='inline.margin-bottom-1em'
                      >
                        <Icon name='upload' />
                        Upload
                      </Button>
                    </label>
                    <input
                      type='file'
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
                <Form.Field>
                  <TextArea
                    autoHeight
                    rows={2}
                    onChange={this.handleChange}
                    name='text'
                    value={this.state.text}
                    placeholder='Write something here...'
                  />
                </Form.Field>

                <Dimmer active={activeGroupPost.adding} inverted />
              </Dimmer.Dimmable>
              <Form.Field>
                <Button
                  color={getTheme()}
                  floated='right'
                  disabled={!this.state.text}
                  onClick={this.handleClick}
                  loading={activeGroupPost.adding}
                >
                  Post
                </Button>
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
    AddPost: data => {
      dispatch(addPost(data))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupAddPost)
