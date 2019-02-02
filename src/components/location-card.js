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
  Flag,
  Message
} from 'semantic-ui-react'
import { startCase, capitalize } from 'lodash'

import { getTheme } from 'formula_one'
import { setCountryList, changeActiveGroupLocation } from '../actions'
import '../css/group.css'

class LocationCard extends React.Component {
  constructor (props) {
    super(props)
    const { activeGroup, field } = this.props
    const { data } = activeGroup
    this.state = {
      editMode: false,
      address: data[field].length !== 0 ? data[field][0].address : null,
      city: data[field].length !== 0 ? data[field][0].city : null,
      state: data[field].length !== 0 ? data[field][0].state : null,
      postalCode: data[field].length !== 0 ? data[field][0].postalCode : null,
      countryCode:
        data[field].length !== 0 ? data[field][0].countryDetail.code : null,
      success: false,
      error: false,
      message: ''
    }
  }
  handleChange = (e, { name, value }) => {
    this.setState({
      [name]: value
    })
  }
  handleClick = () => {
    const { activeGroup, field, countryList } = this.props
    const { data } = activeGroup
    if (!countryList.isLoaded) {
      this.props.SetCountryList()
    }
    if (this.state.editMode) {
      this.props.ChangeActiveGroupLocation(
        data.locationInformation[0] && data.locationInformation[0].id,
        field,
        {
          slug: activeGroup.data.slug,
          address: this.state.address,
          city: this.state.city,
          state: this.state.state,
          country: this.state.countryCode,
          postalCode: this.state.postalCode || null
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
      success: true,
      error: false,
      message: ''
    })
  }
  errCallback = err => {
    this.setState({
      editMode: true,
      success: false,
      error: true,
      message: err.response.data
    })
  }
  render () {
    const { error, message } = this.state
    const { activeGroup, heading, field, countryList } = this.props
    const { data, inEditMode, hasEditRights } = activeGroup
    const countryOptions = countryList.isLoaded
      ? countryList.data.actions.POST.locationInformation.child.children.country
        .choices
      : []
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
          {this.state.editMode || inEditMode === field ? (
            <Dimmer.Dimmable dimmed={inEditMode === field && !error}>
              <Form>
                {this.state.error && (
                  <Message
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
                <Form.Field
                  required
                  error={Boolean(
                    Object.keys(message).find(x => {
                      return x === 'address'
                    })
                  )}
                >
                  <label>Address</label>
                  <TextArea
                    autoHeight
                    name='address'
                    placeholder='Address'
                    value={this.state.address}
                    onChange={this.handleChange}
                    rows={2}
                  />
                </Form.Field>
                <Form.Field
                  error={Boolean(
                    Object.keys(message).find(x => {
                      return x === 'postalCode'
                    })
                  )}
                >
                  <label>Postal code</label>
                  <Form.Input
                    autoHeight
                    type='number'
                    name='postalCode'
                    placeholder='Postal code'
                    value={this.state.postalCode}
                    onChange={this.handleChange}
                    rows={2}
                  />
                </Form.Field>
                <Form.Group widths='equal'>
                  <Form.Field
                    required
                    error={
                      Boolean(
                        Object.keys(message).find(x => {
                          return x === 'city'
                        })
                      ) && error
                    }
                  >
                    <Form.Input
                      fluid
                      autocomplete='off'
                      label='City'
                      name='city'
                      value={this.state.city}
                      onChange={this.handleChange}
                      placeholder='City'
                      error={Boolean(
                        Object.keys(message).find(x => {
                          return x === 'city'
                        })
                      )}
                    />
                  </Form.Field>
                  <Form.Field
                    required
                    error={Boolean(
                      Object.keys(message).find(x => {
                        return x === 'state'
                      })
                    )}
                  >
                    <Form.Input
                      fluid
                      autocomplete='off'
                      label='State'
                      name='state'
                      value={this.state.state}
                      onChange={this.handleChange}
                      placeholder='State'
                    />
                  </Form.Field>
                </Form.Group>
                <Form.Field
                  required
                  error={Boolean(
                    Object.keys(message).find(x => {
                      return x === 'countryDetail'
                    })
                  )}
                >
                  <label>Country</label>
                  <Form.Select
                    name='countryCode'
                    search
                    autoComplete='off'
                    options={countryOptions.map(country => {
                      return {
                        key: country.value,
                        value: country.value,
                        text: country.displayName,
                        flag: country.value.toLowerCase()
                      }
                    })}
                    disabled={!countryList.isLoaded}
                    loading={!countryList.isLoaded}
                    value={this.state.countryCode}
                    onChange={this.handleChange}
                  />
                </Form.Field>
              </Form>
              <Dimmer active={inEditMode === field && !error} inverted />
            </Dimmer.Dimmable>
          ) : data[field].length !== 0 ? (
            <React.Fragment>
              <p styleName='group-address-container'>
                {data[field][0].address}
              </p>
              <p>
                {data[field][0].city}
                {data[field][0].postalCode && ` (${data[field][0].postalCode})`}
                , {data[field][0].state}
              </p>
              <p>
                {data[field][0].countryDetail.name}{' '}
                <Flag name={data[field][0].countryDetail.code.toLowerCase()} />
              </p>
            </React.Fragment>
          ) : (
            'None'
          )}
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
    ChangeActiveGroupLocation: (
      id,
      field,
      data,
      successCallback,
      errCallback
    ) => {
      dispatch(
        changeActiveGroupLocation(id, field, data, successCallback, errCallback)
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
)(LocationCard)
