import Ajv from 'ajv'
import dotProp from 'dot-prop-immutable'
import factory from 'debug'
import { combineReducers } from 'redux'
import {
  get,
  trim,
  extend,
  isEmpty,
  isFunction,
  isPlainObject,
  isString,
  mapValues
} from 'lodash'
import { success, fails } from 'cq-dispatcher'

import persistence from '@/state/persistence'
import config from '@/config'

const debug = factory('sitepanel:state-utils')

const ajv = Ajv({ allErrors: true, removeAdditional: true })

function _validate (state, validate) {
  if (!validate(state)) {
    throw new Error('Invalid state' + config.is_development
      ? ' ajv: ' + ajv.errorsText(validate.errors) : '')
  }
}

export function createReducer (reducermap, path) {
  if ('undefined' in reducermap) {
    throw new Error('seem like forgotten constant')
  }
  if (!('schema' in reducermap)) {
    throw new Error('all reducers should have schema')
  }
  const validate = ajv.compile(reducermap.schema)
  const initial = reducermap.schema.default || {}
  if (!isEmpty(initial)) _validate(reducermap.schema.default, validate)
  return (state = initial, action) => {
    if (!reducermap[action.type]) return state
    if (process.env.NODE_ENV === 'development') {
      debug('start handeling %s', action.type)
    }
    // it will pass args to reducer
    // adding result/error as last parameter if necessary
    const args = [...action.args]
    if ('result' in action) args.push(action.result)
    else if ('error' in action) args.push(action.error)

    const nextState = reducermap[action.type](state, ...args)
    _validate(nextState, validate)
    if (reducermap.schema.persist) persistence.set(path, nextState)
    return nextState
  }
}

// NOTE: private class used as object attribute
class Combination {
  constructor (obj) {
    if (!isPlainObject(obj)) throw Error('only plain js objects!')
    extend(this, obj)
  }
}

const _path = (base, path) => trim(base + '.' + path, '.')

const _visitCombinations = (combination, path = '') =>
  combination instanceof Combination
  ? combineReducers(
    mapValues(
      combination,
      (next, key) => _visitCombinations(next, _path(path, key))
    ))
  : createReducer(combination, path)

export function createRootReducer (combination) {
  return _visitCombinations(combination)
}

export function combine (obj) {
  return new Combination(obj)
}

export function isAsyncActionNeverPerformed (asyncStatus) {
  const wasPerformed =
    get(asyncStatus, 'loading') ||
    get(asyncStatus, 'success') ||
    get(asyncStatus, 'error')

  return !wasPerformed
}

export function createAsyncStatusReducer (asyncActionType, keyBuilder) {
  if (!(asyncActionType && isString(asyncActionType))) {
    throw new Error('action type have to be string!')
  }
  var createHandler = (newStatus, dynamicKey) =>
    function (oldStatus) {
      return isFunction(dynamicKey)
        ? dotProp.set(
          oldStatus,
          dynamicKey(...arguments),
          newStatus)
        : newStatus
    }

  return {
    schema: {
      type: 'object'
    },

    [asyncActionType]: createHandler({
      loading: true,
      success: false,
      error: false
    }, keyBuilder),

    [success(asyncActionType)]: createHandler({
      loading: false,
      success: true,
      error: false
    }, keyBuilder),

    [fails(asyncActionType)]: createHandler({
      loading: false,
      success: false,
      error: true
    }, keyBuilder)
  }
}

