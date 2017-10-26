import factory from 'debug'
import CQDispatcher from 'cq-dispatcher'
import { createStore } from 'redux'
import { bind } from 'lodash'
import { connect as reduxConnect } from 'react-redux'

import reducer from '@/state/reducer'
import persistence from '@/state/persistence'
import config from '@/config'

const debug = factory('inbrowser:app-state-management')

let _dispatcher = null
const _cq = {
  command: function () {
    if (!_dispatcher) throw new Error('State is not mounted!')
    return bind(_dispatcher.Command, _dispatcher, ...arguments)
  },
  query: function () {
    if (!_dispatcher) throw new Error('State is not mounted!')
    return bind(_dispatcher.Query, _dispatcher, ...arguments)
  }
}

export function mount (asynchronous, persistenceId) {
  debug('Mount Application State.')

  persistence.init(persistenceId || 'common')
  const store = createStore(reducer, persistence.get(),
    config.is_development &&
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__())

  _dispatcher = new CQDispatcher(store, asynchronous)

  return { store, dispatcher: _dispatcher }
}

export function connect (stateMapper, dispatchMapper, merge, options) {
  let commandQueryMapper = dispatchMapper
  if (commandQueryMapper) {
    // NOTE: here we getting rid of first arg
    // it will be 'dispatch' function from redux store
    // we pass our command and query instead
    commandQueryMapper = (_, ownProps) => dispatchMapper(_cq, ownProps)
  }
  return reduxConnect(
      stateMapper,
      commandQueryMapper,
      merge,
      options)
}

