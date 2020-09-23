import React from 'react'
import { connect } from 'react-redux'
import { Container, Grid, Segment, Placeholder } from 'semantic-ui-react'

import CustomBreadcrumb from 'core/common/src/components/custom-breadcrumb'
import { Tiles } from 'formula_one'
import { setGroupList } from '../actions'
import { urlGroupDetailView } from '../urls'

import { Editor } from '@tinymce/tinymce-react'


class GroupList extends React.PureComponent {
  componentDidMount () {
    this.props.SetGroupList()
  }
  render () {
    const { groupList } = this.props
    return (
      <Container>
        <CustomBreadcrumb list={[{ name: 'Groups' }]} />
        {groupList.isLoaded ? (
          <Tiles
            tiles={groupList.data.map(group => {
              return {
                name: group.name,
                desc: <Editor apikey="fb3pb0ana4mvi60jwhefs3g2u3501d9s915efud2rh6ax2ek" init={{
                        menubar: false,
                        plugins: [
                        'advlist autolink lists link image charmap print preview anchor',
                        'searchreplace visualblocks code fullscreen',
                        'insertdatetime media table paste code help wordcount'
                        ],
                        toolbar:
                        'undo redo | formatselect | bold italic backcolor | \
                        alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | help'
                        }}
                         disabled={true} inline={true} initialValue={group.shortDescription} />,
                link: urlGroupDetailView(group.slug),
                iconName: 'users',
                imageUrl: group.logo
              }
            })}
          />
        ) : (
          <Grid columns={3} stackable doubling>
            {[...Array(6)].map((item, index) => {
              return (
                <Grid.Column key={index}>
                  <Segment>
                    <Placeholder>
                      <Placeholder.Header image square>
                        <Placeholder.Line />
                        <Placeholder.Line />
                      </Placeholder.Header>
                    </Placeholder>
                  </Segment>
                </Grid.Column>
              )
            })}
          </Grid>
        )}
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
