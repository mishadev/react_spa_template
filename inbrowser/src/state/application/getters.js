import { get } from 'lodash'

export function isApplicationReady (state) {
  return get(state, 'application.initialized') === true
}

