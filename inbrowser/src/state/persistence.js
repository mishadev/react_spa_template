import { set } from 'lodash'
import factory from 'debug'

const debug = factory('inbrowser:app-state-management')

const _default = {}
const _root = ''
let _storageId

function _generateKey () {
  if (!_storageId) throw new Error('persistence is not initialized!')

  return '__application__state__' + _storageId
}

function _get () {
  try {
    return JSON.parse(localStorage.getItem(_generateKey()) || '')
  } catch (e) {
    return _reset(_default)
  }
}

function _set (path, value) {
  localStorage.setItem(
    _generateKey(),
    JSON.stringify(
      path
      ? set(_get(), path, value)
      : value
    )
  )
}

function _reset (value) {
  _set(_root, value)
  return value
}

function _init (storageId) {
  debug('initializing persistence')
  if (!storageId) throw new Error('could not initialize persistence')

  _storageId = storageId
}

export default {
  init: _init,
  get: _get,
  set: _set,
  reset: _reset
}

