import React from 'react'
import {
  Card,
  Container,
  Placeholder,
  Segment,
  Header,
  Grid,
  Icon
} from 'semantic-ui-react'

import blocks from '../css/group.css'
import style from '../css/group.css'

export default class EmptyGroupDetail extends React.Component {
  render () {
    return (
      <Container>
        <Segment basic>
          <Placeholder>
            <Placeholder.Line length='very long' />
          </Placeholder>
        </Segment>
        <Header dividing />
        <Card fluid>
          <Card.Content style={{ padding: 0, height: '15em' }}>
            <Placeholder style={{ height: '100%', minWidth: '100%' }}>
              <Placeholder.Image
                style={{ height: '100%', width: '100%' }}
                rectangular
              />
            </Placeholder>
          </Card.Content>
          <div styleName='blocks.group-profile'>
            <Placeholder style={{ height: '8em', minWidth: '8em' }}>
              <Placeholder.Image square />
            </Placeholder>
            <div styleName='blocks.branding-text-container'>
              <Placeholder style={{ width: '100%', textAlign: 'center' }}>
                <Placeholder.Line length='full' />
                <Placeholder.Line length='full' />
                <Placeholder.Line length='short' />
              </Placeholder>
            </div>
          </div>
          <Card.Content>
            <Grid styleName='blocks.group-display-panel' stackable columns={3}>
              <Grid.Column textAlign='center'>
                <Placeholder>
                  <Placeholder.Line length='full' />
                </Placeholder>
              </Grid.Column>
              <Grid.Column textAlign='center'>
                <Placeholder>
                  <Placeholder.Line length='full' />
                </Placeholder>
              </Grid.Column>
              <Grid.Column textAlign='center'>
                <Placeholder>
                  <Placeholder.Line length='full' />
                </Placeholder>
              </Grid.Column>
            </Grid>
          </Card.Content>
        </Card>
        <Grid styleName='style.group-post-container' stackable>
          <Grid.Column width={5}>
            {[...Array(3)].map((item, index) => {
              return (
                <Card fluid key={index}>
                  <Card.Content>
                    <Placeholder>
                      <Placeholder.Line length='medium' />
                    </Placeholder>
                  </Card.Content>
                  <Card.Content>
                    <Placeholder>
                      <Placeholder.Paragraph>
                        <Placeholder.Line length='full' />
                        <Placeholder.Line length='full' />
                        <Placeholder.Line length='medium' />
                      </Placeholder.Paragraph>
                    </Placeholder>
                  </Card.Content>
                </Card>
              )
            })}
            <Card fluid>
              <Card.Content>
                <Card.Content>
                  <Placeholder>
                    <Placeholder.Line length='medium' />
                  </Placeholder>
                </Card.Content>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column width={11}>
            {[...Array(5)].map((item, index) => {
              return (
                <Card fluid key={index}>
                  <Card.Content>
                    <Placeholder>
                      <Placeholder.Line length='full' />
                    </Placeholder>
                  </Card.Content>
                  <Card.Content fluid>
                    <Placeholder style={{ minWidth: '100%' }}>
                      <Placeholder.Paragraph>
                        <Placeholder.Line length='full' />
                        <Placeholder.Line length='full' />
                        <Placeholder.Line length='medium' />
                      </Placeholder.Paragraph>
                      {index % 3 === 2 && <Placeholder.Paragraph />}
                      {index % 3 === 2 && <Placeholder.Image rectangular />}
                    </Placeholder>
                  </Card.Content>
                </Card>
              )
            })}
          </Grid.Column>
        </Grid>
      </Container>
    )
  }
}
