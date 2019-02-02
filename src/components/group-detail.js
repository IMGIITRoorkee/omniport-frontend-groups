import React from 'react'
import { connect } from 'react-redux'
import { Container } from 'semantic-ui-react'

import GroupBranding from './group-branding'
import GroupAbout from './group-about'
import { setActiveGroup } from '../actions'
import '../css/group.css'

class GroupDetail extends React.Component {
  componentDidMount () {
    this.props.SetActiveGroup(this.props.match.params.slug, err => {
      this.props.history.push('/404')
    })
  }

  render () {
    const { activeGroup } = this.props
    return (
      <div styleName='group-container'>
        {activeGroup.isLoaded && (
          <Container>
            <GroupBranding />
            <GroupAbout slug={this.props.match.params.slug} />
          </Container>
        )}
      </div>
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
    SetActiveGroup: (slug, errCallback) => {
      dispatch(setActiveGroup(slug, errCallback))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupDetail)
