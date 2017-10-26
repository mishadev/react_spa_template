import factory from 'debug'
import { padStart, trimEnd } from 'lodash'

const debug = factory('inbrowser:config')

const required = (value) => {
  if (typeof value === 'undefined') {
    throw new Error('Could not find configuration')
  }
  return value
}

const cfg = {
  debug: process.env.DEBUG,
  env: required(process.env.NODE_ENV),
  api_url: required(process.env.API_URL),
  application_relaunch_timeout: 5000,
  react_mount_element_id: 'app',

  app_public_path: padStart(trimEnd(process.env.APP_PUBLIC_PATH, '/'), '/')
}

cfg.is_development = cfg.env === 'development'
cfg.is_production = cfg.env === 'production'

debug('Getting Config.')

export default cfg
