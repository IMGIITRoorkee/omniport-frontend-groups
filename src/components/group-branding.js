import React from 'react'
import { connect } from 'react-redux'
import {
  Card,
  Image,
  Header,
  Icon,
  Grid,
  Dimmer,
  Loader
} from 'semantic-ui-react'

import { DefaultDP } from 'formula_one'
import EditBranding from './edit-branding'
import {
  changeActiveGroup,
  changeActiveGroupWithFile,
  setCountryList
} from '../actions'

import inline from 'formula_one/src/css/inline.css'
import blocks from '../css/group.css'

class GroupBranding extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      activeCover: false,
      activeLogo: false
    }
  }
  componentDidMount () {
    const { countryList } = this.props
    if (!countryList.isLoaded) {
      this.props.SetCountryList()
    }
  }
  handleShowCover = () => this.setState({ activeCover: true })
  handleHideCover = () => this.setState({ activeCover: false })
  removeCover = () => {
    this.setState({
      editing: 'brandingCover'
    })
    this.props.ChangeActiveGroup(
      this.props.activeGroup.data.slug,
      'brandingCover',
      { coverImage: null },
      res => {
        this.setState({
          editing: ''
        })
      },
      err => {
        this.setState({
          editing: ''
        })
      }
    )
  }
  addCover = e => {
    this.setState({
      editing: 'brandingCover'
    })
    var formData = new FormData()
    formData.append('cover_image', e.target.files[0])
    this.props.ChangeActiveGroupWithFile(
      this.props.activeGroup.data.slug,
      'brandingCover',
      formData,
      res => {
        this.setState({
          editing: ''
        })
      },
      err => {
        this.setState({
          editing: ''
        })
      }
    )
    this.setState({
      activeCover: false
    })
  }
  handleShowLogo = () => this.setState({ activeLogo: true })
  handleHideLogo = () => this.setState({ activeLogo: false })
  removeLogo = () => {
    this.setState({
      editing: 'brandingLogo'
    })
    this.props.ChangeActiveGroup(
      this.props.activeGroup.data.slug,
      'brandingLogo',
      { logo: null },
      res => {
        this.setState({
          editing: ''
        })
      },
      err => {
        this.setState({
          editing: ''
        })
      }
    )
  }
  addLogo = e => {
    this.setState({
      editing: 'brandingLogo'
    })
    var formData = new FormData()
    formData.append('logo', e.target.files[0])
    this.props.ChangeActiveGroupWithFile(
      this.props.activeGroup.data.slug,
      'brandingLogo',
      formData,
      res => {
        this.setState({
          editing: ''
        })
      },
      err => {
        this.setState({
          editing: ''
        })
      }
    )

    this.setState({
      activeLogo: false
    })
  }
  render () {
    const { activeGroup } = this.props
    const { activeCover, activeLogo, editing } = this.state
    const { data, hasEditRights, inEditMode } = activeGroup
    return (
      <Card fluid>
        <Dimmer.Dimmable
          dimmed={activeCover && hasEditRights}
          onMouseEnter={this.handleShowCover}
          onMouseLeave={this.handleHideCover}
        >
          <Card.Content style={{ padding: 0, minHeight: '5em' }}>
            <div styleName='blocks.group-cover-image-container'>
              {data.coverImage && (
                <Image
                  src={data.coverImage}
                  styleName='blocks.group-cover-image'
                  alt={`${data.name} cover`}
                />
              )}
            </div>
          </Card.Content>
          <Dimmer active={activeCover && hasEditRights}>
            {inEditMode === 'brandingCover' && editing === 'brandingCover' ? (
              <Loader active={inEditMode === 'brandingCover'} />
            ) : (
              <React.Fragment>
                {data.coverImage && (
                  <Icon name='erase' bordered onClick={this.removeCover} />
                )}
                <label htmlFor='coverImage'>
                  <Icon name='pencil' link />
                </label>
                <input
                  type='file'
                  accept='image/*'
                  onChange={this.addCover}
                  name='coverImage'
                  id='coverImage'
                  styleName='inline.display-none'
                />
              </React.Fragment>
            )}
          </Dimmer>
        </Dimmer.Dimmable>
        <div styleName='blocks.group-profile'>
          <Dimmer.Dimmable
            dimmed={activeLogo && hasEditRights}
            onMouseEnter={this.handleShowLogo}
            onMouseLeave={this.handleHideLogo}
          >
            <div styleName='blocks.group-logo-container'>
              {data.logo ? (
                <Image
                  src={data.logo}
                  alt={`${data.name} logo`}
                  styleName='blocks.group-logo'
                  circular
                />
              ) : (
                <DefaultDP name={data.name} size='5em' />
              )}
            </div>
            <Dimmer
              active={activeLogo && hasEditRights}
              style={{ borderRadius: '9999em' }}
            >
              {inEditMode === 'brandingLogo' && editing === 'brandingLogo' ? (
                <Loader active={inEditMode === 'brandingLogo'} />
              ) : (
                <React.Fragment>
                  {data.logo && (
                    <Icon name='erase' bordered onClick={this.removeLogo} />
                  )}
                  <label htmlFor='logo'>
                    <Icon name='pencil' link />
                  </label>
                  <input
                    type='file'
                    accept='image/*'
                    onChange={this.addLogo}
                    name='logo'
                    id='logo'
                    styleName='inline.display-none'
                  />
                </React.Fragment>
              )}
            </Dimmer>
          </Dimmer.Dimmable>
          <div styleName='blocks.branding-text-container'>
            <Header
              as='h3'
              textAlign='center'
              styleName='blocks.branding-heading-container'
            >
              {data.name}
              {data.yearOfInception && (
                <Header.Subheader>
                  Founded in {data.yearOfInception}
                </Header.Subheader>
              )}
            </Header>
          </div>
          {hasEditRights && <EditBranding />}
        </div>
        <Card.Content>
          <Grid
            styleName='blocks.group-display-panel'
            columns={
              !data.socialInformation[0] ||
              data.socialInformation[0].links.length === 0
                ? 2
                : 3
            }
            stackable
          >
            <Grid.Column textAlign='center'>
              <Icon name='phone' />
              {data.contactInformation[0] &&
              data.contactInformation[0]['primaryPhoneNumber'] ? (
                <a
                    href={`tel:${
                      data.contactInformation[0]['primaryPhoneNumber']
                    }`}
                  >
                    {data.contactInformation[0]['primaryPhoneNumber']}
                  </a>
                ) : (
                  'None'
                )}
            </Grid.Column>
            <Grid.Column textAlign='center'>
              <Icon name='mail' />
              {data.contactInformation[0] &&
              data.contactInformation[0].emailAddressVerified ? (
                  data.contactInformation[0]['emailAddress'] ? (
                    <a
                      href={`mailto:${
                        data.contactInformation[0]['emailAddress']
                      }`}
                    >
                      {data.contactInformation[0]['emailAddress']}
                    </a>
                  ) : (
                    'None'
                  )
                ) : data.contactInformation[0] &&
                data.contactInformation[0]['instituteWebmailAddress'] ? (
                  <a
                      href={`
                            mailto:${
                    data.contactInformation[0][
                      'instituteWebmailAddress'
                    ]
                    }
                          `}
                    >
                      {data.contactInformation[0]['instituteWebmailAddress']}
                    </a>
                  ) : (
                    'None'
                  )}
            </Grid.Column>
            {data.socialInformation[0] &&
              data.socialInformation[0].links.length !== 0 && (
              <Grid.Column textAlign='center'>
                {data.socialInformation[0] &&
                    data.socialInformation[0].links.map((link, index) => {
                      return (
                        <a
                          key={index}
                          href={link.url}
                          target='blank'
                          title={link.siteName}
                        >
                          <Icon name={link.siteLogo} />
                        </a>
                      )
                    })}
              </Grid.Column>
            )}
          </Grid>
        </Card.Content>
      </Card>
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
    ChangeActiveGroupWithFile: (
      slug,
      field,
      data,
      successCallback,
      errCallback
    ) => {
      dispatch(
        changeActiveGroupWithFile(
          slug,
          field,
          data,
          successCallback,
          errCallback
        )
      )
    },
    SetCountryList: () => {
      dispatch(setCountryList())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupBranding)
