import React from 'react'
import {
  Card,
  Container,
  Placeholder,
  Segment,
  Header
} from 'semantic-ui-react'

export default class EmptyGroupTeam extends React.Component {
  render () {
    return (
      <div style={{ height: '100%' }}>
        <Container>
          <Segment basic>
            <Placeholder>
              <Placeholder.Line length='very long' />
            </Placeholder>
          </Segment>
          <Header dividing />
          <Segment basic>
            <Placeholder style={{ width: '50em', height: '3em' }}>
              <Placeholder.Image rectangular />
            </Placeholder>
          </Segment>
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
        </Container>
      </div>
    )
  }
}
