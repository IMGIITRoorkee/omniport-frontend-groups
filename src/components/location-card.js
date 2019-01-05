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
  Flag
} from 'semantic-ui-react'

import { getTheme } from 'formula_one'
import {
  changeActiveGroup,
  setCountryList,
  changeActiveGroupLocation
} from '../actions'
import '../css/group.css'

class PurposeCard extends React.Component {
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
        data[field].length !== 0 ? data[field][0].countryDetail.code : null
    }
  }

  handleClick = () => {
    const { activeGroup, field, countryList } = this.props
    const { data } = activeGroup
    if (!countryList.isLoaded) {
      this.props.SetCountryList()
    }
    if (this.state.editMode) {
      this.props.ChangeActiveGroupLocation(
        data.locationInformation[0].id,
        field,
        {
          address: this.state.address,
          city: this.state.city,
          state: this.state.state,
          country: this.state.countryCode,
          postalCode: this.state.postalCode || null
        }
      )
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
                <Form.Field>
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
                <Form.Field>
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
                  <Form.Input
                    fluid
                    autocomplete='off'
                    label='City'
                    name='city'
                    value={this.state.city}
                    onChange={this.handleChange}
                    placeholder='City'
                  />
                  <Form.Input
                    fluid
                    autocomplete='off'
                    label='State'
                    name='state'
                    value={this.state.state}
                    onChange={this.handleChange}
                    placeholder='State'
                  />
                </Form.Group>
                <Form.Field>
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
              <Dimmer active={inEditMode === field} inverted />
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
    ChangeActiveGroupLocation: (id, field, data) => {
      dispatch(changeActiveGroupLocation(id, field, data))
    },
    SetCountryList: () => {
      dispatch(setCountryList())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PurposeCard)
