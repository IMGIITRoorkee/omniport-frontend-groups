import React, { Component } from 'react'
import { Route } from 'react-router-dom'
import App from './components/app.js'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import rootReducers from './reducers'

export default class AppRouter extends Component {
  constructor (props) {
    super(props)
    this.store = createStore(rootReducers, applyMiddleware(thunk))
  }

  render () {
    const { match } = this.props
    return (
      <Provider store={this.store}>
        <Route path={`${match.path}/`} component={App} />
      </Provider>
    )
  }
}
