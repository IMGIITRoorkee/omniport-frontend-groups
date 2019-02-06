import React from 'react'
import { connect } from 'react-redux'
import {
  Modal,
  Input,
  Button,
  Form,
  Dropdown,
  Icon,
  Header,
  Message
} from 'semantic-ui-react'
import { YearInput } from 'semantic-ui-calendar-react'
import { capitalize, startCase } from 'lodash'

import { getTheme } from 'formula_one'
import {
  changeActiveGroup,
  setCountryList,
  changeActiveGroupWithFile,
  addActiveGroupSocial,
  changeActiveGroupContact,
  changeActiveGroupSocial,
  deleteActiveGroupSocial
} from '../actions'
import { errorExist } from '../utils'

import inline from 'formula_one/src/css/inline.css'
import blocks from '../css/group.css'

class EditBranding extends React.Component {
  constructor (props) {
    super(props)
    const { activeGroup } = this.props
    const { data } = activeGroup
    this.state = {
      primaryPhoneNumber:
        data.contactInformation[0] &&
        data.contactInformation[0]['primaryPhoneNumber']
          ? data.contactInformation[0]['primaryPhoneNumber']
          : '',
      emailAddress:
        data.contactInformation[0] && data.contactInformation[0]['emailAddress']
          ? data.contactInformation[0]['emailAddress']
          : '',
      name: data.name,
      socialInfo: data.socialInformation[0]
        ? data.socialInformation[0].links
        : [],
      yearOfInception: data.yearOfInception || '',
      newLinkUrl: '',
      newLinkSite: '',
      success: '',
      error: '',
      message: ''
    }
  }

  handleChange = e => {
    const { name, value } = e.target
    this.setState({
      [name]: value
    })
  }

  handleYearChange = (e, { name, value }) => {
    this.setState({
      [name]: value
    })
  }

  handleSocialChange = e => {
    const { name, value } = e.target
    this.setState({
      socialInfo: this.state.socialInfo.map(info => {
        if (info.id == name) {
          return { ...info, url: value }
        }
        return info
      })
    })
  }

  handleSocialSiteChange = (e, { name, value }) => {
    this.setState({
      socialInfo: this.state.socialInfo.map(info => {
        if (info.id == name) {
          return { ...info, site: value }
        }
        return info
      })
    })
  }

  handleNewSocialChange = e => {
    const { value } = e.target
    this.setState({
      newLinkUrl: value
    })
  }

  handleNewSocialSiteChange = (e, { value }) => {
    this.setState({
      newLinkSite: value
    })
  }

  handleAddSocialLink = () => {
    const data = {
      slug: this.props.activeGroup.data.slug,
      site: this.state.newLinkSite,
      url: this.state.newLinkUrl
    }
    this.props.AddActiveGroupSocial(
      'addSocial',
      data,
      this.successAddLinkCallback,
      this.errAddLinkCallback
    )
  }

  successAddLinkCallback = res => {
    this.setState({
      socialInfo: [...this.state.socialInfo, res.data],
      newLinkSite: '',
      newLinkUrl: '',
      success: `link${res.data.id}`,
      error: '',
      message: res.data
    })
  }

  errAddLinkCallback = err => {
    this.setState({
      error: `linknew`,
      success: '',
      message: err.response.data
    })
  }

  handleUpdateLink = id => {
    const data = this.state.socialInfo.find(x => {
      return x.id === id
    })
    this.props.ChangeActiveGroupSocial(
      id,
      `socialLink${id}`,
      data,
      this.successUpdateLinkCallback,
      err => this.errUpdateLinkCallback(err, id)
    )
  }

  successUpdateLinkCallback = res => {
    this.setState({
      socialInfo: this.state.socialInfo.map(x => {
        return x.id === res.data.id ? res.data : x
      })
    })
  }

  errUpdateLinkCallback = (err, id) => {
    this.setState({
      error: `link${id}`,
      success: '',
      message: err.response.data
    })
  }

  handleDeleteLink = id => {
    this.props.DeleteActiveGroupSocial(id, `socialLink${id}`, id => {
      this.setState({
        socialInfo: this.state.socialInfo.filter(x => {
          return x.id !== id
        })
      })
    })
  }

  handleSubmitProfile = () => {
    const { name, yearOfInception } = this.state
    let data = {
      name,
      yearOfInception
    }
    this.props.ChangeActiveGroup(
      this.props.activeGroup.data.slug,
      'profileBranding',
      data,
      this.successProfileCallback,
      this.errProfileCallback
    )
  }

  handleUpdateContact = () => {
    const { primaryPhoneNumber, emailAddress } = this.state
    let data = {
      slug: this.props.activeGroup.data.slug,
      primaryPhoneNumber,
      emailAddress
    }
    this.props.ChangeActiveGroupContact(
      this.props.activeGroup.data.contactInformation[0] &&
        this.props.activeGroup.data.contactInformation[0].id,
      'contactBranding',
      data,
      this.successContactCallback,
      this.errContactCallback
    )
  }

  successContactCallback = res => {
    this.setState({
      error: '',
      success: 'contactInfo',
      message: res.data
    })
  }

  errContactCallback = err => {
    this.setState({
      success: '',
      error: 'contactInfo',
      message: err.response.data
    })
  }

  successProfileCallback = res => {
    this.setState({
      error: '',
      success: 'profileInfo',
      message: res.data
    })
  }

  errProfileCallback = err => {
    this.setState({
      success: '',
      error: 'profileInfo',
      message: err.response.data
    })
  }

  render () {
    const { success, error, message } = this.state
    const { activeGroup, countryList } = this.props
    const socialOptions = countryList.isLoaded
      ? countryList.data.actions.POST.socialInformation.child.children.links
        .child.children.site.choices
      : []
    return (
      <Modal trigger={<Icon fitted name='pencil' />} size='small' closeIcon>
        <Modal.Header>Edit group branding</Modal.Header>
        <Modal.Content>
          <Header dividing>Profile</Header>
          <Form>
            {error === 'profileInfo' && (
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
            {success === 'profileInfo' && (
              <Message
                positive
                icon='check'
                header='Success'
                content='Successfuly updated profile.'
              />
            )}
            <Form.Field
              required
              error={errorExist(message, 'name') && error === 'profile'}
            >
              <label>Group name</label>
              <Input
                autoComplete='off'
                onChange={this.handleChange}
                placeholder='Enter group name'
                name='name'
                value={this.state.name}
              />
            </Form.Field>
            <Form.Field
              required
              error={
                errorExist(message, 'yearOfInception') && error === 'profile'
              }
            >
              <label>Year of inception</label>
              <YearInput
                autoComplete='off'
                onChange={this.handleYearChange}
                placeholder='Year of inception'
                name='yearOfInception'
                value={String(this.state.yearOfInception)}
              />
            </Form.Field>
            <Button
              color={getTheme()}
              disabled={!this.state.name || !this.state.yearOfInception}
              floated='right'
              onClick={this.handleSubmitProfile}
              loading={activeGroup.inEditMode === 'profileBranding'}
              content='Update'
              icon='check'
            />
          </Form>
        </Modal.Content>
        <Modal.Content>
          <Header dividing>Contact information</Header>
          <Form>
            {error === 'contactInfo' && (
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
            {success === 'contactInfo' && (
              <Message
                positive
                icon='check'
                header='Success'
                content='Successfuly updated contact information.'
              />
            )}
            <Form.Field
              required
              error={
                errorExist(message, 'primaryPhoneNumber') &&
                error === 'contactInfo'
              }
            >
              <label>Primary phone number</label>
              <Input
                autoComplete='off'
                onChange={this.handleChange}
                placeholder='Primary phone number'
                name='primaryPhoneNumber'
                value={this.state.primaryPhoneNumber}
              />
            </Form.Field>
            <Form.Field
              required
              error={
                errorExist(message, 'emailAddress') && error === 'contactInfo'
              }
            >
              <label>Email address</label>
              <Input
                autoComplete='off'
                onChange={this.handleChange}
                placeholder='Email address'
                name='emailAddress'
                value={this.state.emailAddress}
              />
            </Form.Field>
            <Button
              color={getTheme()}
              floated='right'
              icon='check'
              content='Update'
              onClick={this.handleUpdateContact}
              loading={activeGroup.inEditMode === 'contactBranding'}
            />
          </Form>
        </Modal.Content>
        <Modal.Content>
          <Header dividing>Social information</Header>
          <Form>
            {error.includes('link') && (
              <Message
                icon='frown outline'
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
            {success.includes('link') && (
              <Message positive icon='check' header='Success' />
            )}
            <Form.Field>
              <label>Link</label>
              {this.state.socialInfo.map(link => {
                return (
                  <Form.Field
                    key={link.id}
                    error={error.includes('link') && error === `link${link.id}`}
                  >
                    <Input
                      autoComplete='off'
                      label={
                        <Dropdown
                          name={link.id}
                          basic
                          scrolling
                          autoComplete='off'
                          value={link.site}
                          options={socialOptions.map(social => {
                            return {
                              key: social.value,
                              value: social.value,
                              text: social.displayName
                            }
                          })}
                          disabled={!countryList.isLoaded}
                          loading={!countryList.isLoaded}
                          onChange={this.handleSocialSiteChange}
                        />
                      }
                      onChange={this.handleSocialChange}
                      name={link.id}
                      value={link.url}
                    />
                    <Icon
                      name='edit'
                      onClick={() => {
                        this.handleUpdateLink(link.id)
                      }}
                    />
                    <Icon
                      name='trash'
                      onClick={() => {
                        this.handleDeleteLink(link.id)
                      }}
                    />
                  </Form.Field>
                )
              })}
              <Form.Field error={error.includes('link') && error === 'linknew'}>
                <Input
                  autoComplete='off'
                  label={
                    <Dropdown
                      scrolling
                      basic
                      autoComplete='off'
                      options={socialOptions.map(social => {
                        return {
                          key: social.value,
                          value: social.value,
                          text: social.displayName
                        }
                      })}
                      value={this.state.newLinkSite}
                      disabled={!countryList.isLoaded}
                      loading={!countryList.isLoaded}
                      onChange={this.handleNewSocialSiteChange}
                      placeholder='Social site'
                    />
                  }
                  placeholder='URL'
                  onChange={this.handleNewSocialChange}
                  value={this.state.newLinkUrl}
                />
                <Icon name='save' onClick={this.handleAddSocialLink} />
              </Form.Field>
            </Form.Field>
          </Form>
        </Modal.Content>
      </Modal>
    )
  }
}

function mapStateToProps (state) {
  return {
    activeGroup: state.activeGroup,
    countryList: state.countryList
  }
}
const mapDispatchToProps = dispatch => {
  return {
    ChangeActiveGroup: (slug, field, data, successCallback, errCallback) => {
      dispatch(
        changeActiveGroup(slug, field, data, successCallback, errCallback)
      )
    },
    ChangeActiveGroupContact: (
      id,
      field,
      data,
      successCallback,
      errCallback
    ) => {
      dispatch(
        changeActiveGroupContact(id, field, data, successCallback, errCallback)
      )
    },
    AddActiveGroupSocial: (field, data, successCallback, errCallback) => {
      dispatch(addActiveGroupSocial(field, data, successCallback, errCallback))
    },
    ChangeActiveGroupSocial: (
      id,
      field,
      data,
      successCallback,
      errCallback
    ) => {
      dispatch(
        changeActiveGroupSocial(id, field, data, successCallback, errCallback)
      )
    },
    DeleteActiveGroupSocial: (id, field, callback) => {
      dispatch(deleteActiveGroupSocial(id, field, callback))
    },
    ChangeActiveGroupWithFile: (slug, field, data) => {
      dispatch(changeActiveGroupWithFile(slug, field, data))
    },
    SetCountryList: () => {
      dispatch(setCountryList())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditBranding)
