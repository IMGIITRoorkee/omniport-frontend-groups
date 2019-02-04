import React from 'react'
import { connect } from 'react-redux'
import { Container } from 'semantic-ui-react'

import CustomBreadcrumb from 'core/common/src/components/custom-breadcrumb'
import { Tiles } from 'formula_one'
import { setGroupList } from '../actions'
import { urlGroupDetailView } from '../urls'

class GroupList extends React.PureComponent {
  componentDidMount () {
    this.props.SetGroupList()
  }
  render () {
    const { groupList } = this.props
    return (
      <Container>
        <CustomBreadcrumb list={[{ name: 'Groups' }]} />
        <Tiles
          tiles={
            groupList.isLoaded
              ? groupList.data.map(group => {
                return {
                  name: group.name,
                  desc: <span>{group.shortDescription}</span>,
                  link: urlGroupDetailView(group.slug),
                  iconName: 'users',
                  imageUrl: group.logo
                }
              })
              : []
          }
        />
      </Container>
    )
  }
}

function mapStateToProps (state) {
  return {
    groupList: state.groupList
  }
}
const mapDispatchToProps = dispatch => {
  return {
    SetGroupList: () => {
      dispatch(setGroupList())
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupList)
