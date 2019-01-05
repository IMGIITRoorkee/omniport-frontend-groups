import React from 'react'
import { Card, Image, Header } from 'semantic-ui-react'

import { DefaultDP } from 'formula_one'
import '../css/group-team-card.css'

export default class TeamCard extends React.Component {
  render () {
    return (
      <Card fluid>
        <Card.Content>
          <div styleName='team-card-container'>
            <div styleName='user-image-container'>
              {Math.random() > 0.5 ? (
                <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' />
              ) : (
                <DefaultDP name='Praduman' size='2em' />
              )}
            </div>
            <div styleName='user-desc'>
              <Header as='h4'>
                Praduman Goyal
                <Header.Subheader>17312020</Header.Subheader>
                <Header.Subheader>Frontend Developer</Header.Subheader>
              </Header>
            </div>
          </div>
        </Card.Content>
      </Card>
    )
  }
}
