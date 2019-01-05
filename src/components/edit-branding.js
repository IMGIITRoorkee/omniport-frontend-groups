import React from 'react'
import { connect } from 'react-redux'
import {
  Modal,
  Input,
  Button,
  Form,
  Dropdown,
  Icon,
  Header
} from 'semantic-ui-react'
import { YearInput } from 'semantic-ui-calendar-react'

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
      shortDescription: data.shortDescription,
      yearOfInception: data.yearOfInception,
      newLinkUrl: '',
      newLinkSite: ''
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
    this.props.AddActiveGroupSocial('addSocial', data, res => {
      console.log(res)
      this.setState({
        socialInfo: [...this.state.socialInfo, res.data]
      })
    })
    this.setState({
      newLinkSite: '',
      newLinkUrl: ''
    })
  }

  handleUpdateLink = id => {
    const data = this.state.socialInfo.find(x => {
      return x.id === id
    })
    this.props.ChangeActiveGroupSocial(id, `socialLink${id}`, data, res => {
      this.setState({
        socialInfo: this.state.socialInfo.map(x => {
          return x.id === res.data.id ? res.data : x
        })
      })
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
    const { name, shortDescription, yearOfInception } = this.state
    let data = {
      name,
      shortDescription,
      yearOfInception
    }
    this.props.ChangeActiveGroup(
      this.props.activeGroup.data.slug,
      'profileBranding',
      data
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
      this.props.activeGroup.data.contactInformation[0].id,
      'contactBranding',
      data
    )
  }

  render () {
    const { activeGroup, countryList } = this.props
    const socialOptions = countryList.isLoaded
      ? countryList.data.actions.POST.socialInformation.child.children.links
        .child.children.site.choices
      : []
    return (
      <Modal trigger={<Icon fitted name='pencil' />} size='small'>
        <Modal.Header>Edit group branding</Modal.Header>
        <Modal.Content>
          <Header dividing>Profile</Header>
          <Form>
            <Form.Field>
              <label>Group name</label>
              <Input
                autoComplete='off'
                onChange={this.handleChange}
                placeholder='Enter group name'
                name='name'
                value={this.state.name}
              />
            </Form.Field>
            <Form.Field>
              <label>Year of inception</label>
              <YearInput
                autoComplete='off'
                onChange={this.handleYearChange}
                placeholder='Year of inception'
                name='yearOfInception'
                value={String(this.state.yearOfInception)}
              />
            </Form.Field>
            <Form.Field>
              <label>Short description</label>
              <Input
                autoComplete='off'
                onChange={this.handleChange}
                placeholder='Short description'
                name='shortDescription'
                value={this.state.shortDescription}
              />
            </Form.Field>
            <Button
              color={getTheme()}
              disabled={
                !this.state.name ||
                !this.state.shortDescription ||
                !this.state.yearOfInception
              }
              floated='right'
              onClick={this.handleSubmitProfile}
              loading={activeGroup.inEditMode === 'profileBranding'}
            >
              Update
            </Button>
          </Form>
        </Modal.Content>
        <Modal.Content>
          <Header dividing>Contact information</Header>
          <Form>
            <Form.Field>
              <label>Primary phone number</label>
              <Input
                autoComplete='off'
                onChange={this.handleChange}
                placeholder='Primary phone number'
                name='primaryPhoneNumber'
                value={this.state.primaryPhoneNumber}
              />
            </Form.Field>
            <Form.Field>
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
              onClick={this.handleUpdateContact}
              loading={activeGroup.inEditMode === 'contactBranding'}
            >
              Update
            </Button>
          </Form>
        </Modal.Content>
        <Modal.Content>
          <Header dividing>Social information</Header>
          <Form>
            <Form.Field>
              <label>Link</label>
              {this.state.socialInfo.map(link => {
                return (
                  <Form.Field key={link.id}>
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
              <Form.Field>
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
    ChangeActiveGroup: (slug, field, data) => {
      dispatch(changeActiveGroup(slug, field, data))
    },
    ChangeActiveGroupContact: (id, field, data) => {
      dispatch(changeActiveGroupContact(id, field, data))
    },
    AddActiveGroupSocial: (field, data, callback) => {
      dispatch(addActiveGroupSocial(field, data, callback))
    },
    ChangeActiveGroupSocial: (id, field, data, callback) => {
      dispatch(changeActiveGroupSocial(id, field, data, callback))
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
