import React from 'react'
import { Card, Placeholder, Segment } from 'semantic-ui-react'

export default class EmptyGroupTeamList extends React.Component {
  render () {
    return (
      <Card.Group itemsPerRow={3} stackable doubling>
        {[...Array(6)].map((item, index) => {
          return (
            <Card>
              <Segment>
                <Placeholder>
                  <Placeholder.Header image>
                    <Placeholder.Line />
                    <Placeholder.Line />
                  </Placeholder.Header>
                </Placeholder>
              </Segment>
            </Card>
          )
        })}
      </Card.Group>
    )
  }
}
